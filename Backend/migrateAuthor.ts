/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Types } from "mongoose";
import { Book } from "./src/app/module/book/book.model";
import { Author } from "./src/app/module/author/author.model";


/**
 * এই ফাংশনটি পুরনো স্ট্রিং-ভিত্তিক 'author' নামগুলিকে
 * নতুন 'Author' কালেকশনের ObjectId রেফারেন্সে রূপান্তর করবে।
 */
async function migrateAuthors(dbUri: string) {
    try {
        console.log("Connecting to MongoDB...");
        // MongoDB এর সাথে সংযোগ স্থাপন করুন
        await mongoose.connect(dbUri);
        console.log("MongoDB Connected. Starting Migration...");
        console.log("-----------------------------------------");

        // 1. সমস্ত বই শুধুমাত্র ID এবং author স্ট্রিং ফিল্ড সহ lean ফরম্যাটে নিয়ে আসা
        const books = await Book.find({}).select("_id author").lean();
        
        if (books.length === 0) {
            console.log("No books found to migrate.");
            return;
        }

        let authorsCreatedCount = 0;
        let booksUpdatedCount = 0;
        const authorCache = new Map<string, Types.ObjectId>();
        const bulkOps = [];

        console.log(`Processing ${books.length} books...`);

        // 2. 🔄 লুপ শুরু: প্রতিটি বইয়ের জন্য
        for (const book of books) {
            const rawAuthorName = (book as any).author; // পুরনো author স্ট্রিং অ্যাক্সেস
            
            if (!rawAuthorName || typeof rawAuthorName !== 'string') continue;

            // ডেটা ক্লিনিং: ডুপ্লিকেশন এড়াতে নামটিকে পরিষ্কার (trim ও lowercase) করা
            const cleanedAuthorKey = rawAuthorName.trim().toLowerCase(); 
            // ডিসপ্লে করার জন্য নাম
            const displayAuthorName = rawAuthorName.trim();

            let authorId: Types.ObjectId | undefined = authorCache.get(cleanedAuthorKey);

            // 3. যদি ObjectId ক্যাশে না থাকে, তবে ডাটাবেসে খুঁজুন বা নতুন তৈরি করুন
            if (!authorId) {
                // ডাটাবেসে খুঁজুন (Case-insensitive সার্চ করা হলো)
                let authorDoc = await Author.findOne({ name: { $regex: new RegExp(`^${displayAuthorName}$`, 'i') } });

                if (!authorDoc) {
                    // নতুন লেখক তৈরি করুন
                    authorDoc = await Author.create({ name: displayAuthorName, isDeleted: false });
                    authorsCreatedCount++;
                }
                
                authorId = authorDoc._id;
                // ObjectId কে ক্যাশে সেভ করা হলো
                authorCache.set(cleanedAuthorKey, authorId); 
            }

            // 4. বাল্ক অপারেশন অ্যারেতে বই আপডেটের লজিক যুক্ত করা
            if (authorId) {
                bulkOps.push({
                    updateOne: {
                        filter: { _id: book._id },
                        update: { $set: { author: authorId } }, // ObjectId সেট করা হলো
                    },
                });
                booksUpdatedCount++;
            }
        } // 🔄 লুপ শেষ

        // 5. বাল্ক রাইট অপারেশন: একবারেই সমস্ত বই আপডেট করা
        if (bulkOps.length > 0) {
            const result = await Book.bulkWrite(bulkOps);
            console.log(`\nBulk update result: ${result.modifiedCount} documents modified.`);
        }

        console.log("\n-----------------------------------------");
        console.log(`Migration Complete! ✅`);
        console.log(`Total Authors created: ${authorsCreatedCount}`);
        console.log(`Total Books processed: ${books.length}`);
        console.log(`Total Books updated (author reference set): ${booksUpdatedCount}`);

    } catch (error) {
        console.error("Migration Failed! ❌", error);
        throw error;
    } finally {
        await mongoose.disconnect();
        console.log("MongoDB Disconnected.");
    }
}

// 🚨 ব্যবহারের জন্য: নিচের লাইনটি Uncomment করুন এবং আপনার DB URI দিন
migrateAuthors("mongodb+srv://abubakr:Limon6699@cluster0.lfjkv.mongodb.net/howladar-bookstore?retryWrites=true&w=majority&appName=Cluster0")
  .catch(err => {
    console.error("Script execution failed:", err);
    process.exit(1);
  });

// স্ক্রিপ্টটি বাইরে থেকে রান করার জন্য এক্সপোর্ট করা হলো
export { migrateAuthors };
import * as crypto from "crypto";

/**
 * একটি ক্রিপ্টোগ্রাফিকভাবে সুরক্ষিত র্যান্ডম ট্রানজ্যাকশন আইডি তৈরি করে।
 * @param length আইডির দৈর্ঘ্য (ডিফল্ট: 16 অক্ষর)
 * @returns ইউনিক ট্রানজ্যাকশন আইডি স্ট্রিং
 */
export const generateSecureTransactionId = (length: number): string => {
  // 8 বাইট র্যান্ডম ডেটা তৈরি করা (16 হেক্সাডেসিমেল অক্ষর তৈরি করবে)
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") // হেক্সাডেসিমেল স্ট্রিং-এ রূপান্তর করা
    .slice(0, length) // নির্দিষ্ট দৈর্ঘ্যে ট্রিম করা
    .toUpperCase(); // বড় হাতের অক্ষর ব্যবহার করা (ঐচ্ছিক)
};

// ব্যবহারের উদাহরণ:
// const transactionId = generateSecureTransactionId(20);
// console.log(transactionId); // আউটপুট: 80B9C6A7E3F1D4B59C2A

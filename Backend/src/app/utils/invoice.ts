/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import path from "path";
import { IOrder } from "../module/order/order.interface";
import { IBook } from "../module/book/book.interface";

export const generateOrderInvoicePDF = (order: IOrder): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const buffers: Uint8Array[] = [];

      const banglaFont = path.join(
        process.cwd(),
        "src",
        "app",
        "utils",
        "SolaimanLipi.ttf"
      );

      doc.on("data", (d) => buffers.push(d));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      /* ================= HEADER ================= */
      doc
        .font(banglaFont)
        .fontSize(22)
        .fillColor("#1A365D")
        .text("হাওলাদার প্রকাশনী", 40, 40);

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#4A5568")
        .text("Buy, Exchange, Sell Books Online", 40, 70)
        .text("Email: howladarprokasoni@gmail.com", 40, 85)
        .text("Phone: +880193658263", 40, 100)
        .text("Banglabazar, Dhaka - 1100", 40, 115);

      doc
        .font("Helvetica-Bold")
        .fontSize(20)
        .fillColor("#000")
        .text("INVOICE", 350, 60, { align: "right" });

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#FF7A00")
        .text(`Invoice No: #${order.orderId}`, 350, 90, { align: "right" });

      doc.moveTo(40, 140).lineTo(555, 140).strokeColor("#E2E8F0").stroke();

      /* ================= ORDER + DELIVERY INFO ================= */
      const infoTop = 155;

      // Order Info
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#2D3748")
        .text("Order Info:", 40, infoTop);

      doc
        .font("Helvetica")
        .fontSize(9)
        .text(
          `Placed At: ${new Date(
            order.createdAt || Date.now()
          ).toLocaleDateString()}`,
          40,
          infoTop + 18
        )
        .text(`Payment Method: ${order.paymentMethod}`, 40, infoTop + 33)
        .text(`Payment Status: ${order.paymentStatus}`, 40, infoTop + 48);

      // Delivery Info
      // Delivery Info
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("Delivery Info:", 300, infoTop);

      doc.fontSize(9);

      // Name
      doc.font("Helvetica").text("Name:", 300, infoTop + 18);
      doc.font(banglaFont).text(order.shippingInfo.name, 350, infoTop + 18);

      // Phone
      doc.font("Helvetica").text("Phone:", 300, infoTop + 33);
      doc.font("Helvetica").text(order.shippingInfo.phone, 350, infoTop + 33);

      // Email
      doc.font("Helvetica").text("Email:", 300, infoTop + 48);
      doc.font("Helvetica").text(order.shippingInfo.email, 350, infoTop + 48);

      // Address
      doc.font("Helvetica").text("Address:", 300, infoTop + 63);
      doc.font(banglaFont).text(order.shippingInfo.address, 350, infoTop + 63, {
        width: 190,
      });

      /* ================= TABLE HEADER ================= */
      const tableTop = 245;

      doc.rect(40, tableTop, 515, 25).fill("#F1F5F9");

      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor("#000")
        .text("Description", 45, tableTop + 8)
        .text("Condition", 230, tableTop + 8)
        .text("Unit Cost", 320, tableTop + 8, { width: 60, align: "right" })
        .text("Qty", 390, tableTop + 8, { width: 40, align: "center" })
        .text("Amount", 450, tableTop + 8, { width: 70, align: "right" });

      /* ================= ITEMS ================= */
      let y = tableTop + 30;

      order.items.forEach((item: any) => {
        const book = item.book as IBook;
        if (!book) return;

        doc
          .font(banglaFont)
          .fontSize(9)
          .fillColor("#2D3748")
          .text(book.title, 45, y, { width: 170 });

        doc
          .font("Helvetica")
          .text("New Book", 230, y)
          .text(`${book.price.toString()} Tk.`, 320, y, {
            width: 60,
            align: "right",
          })
          .text(`${item.quantity.toString()}`, 390, y, {
            width: 40,
            align: "center",
          })
          .text(`${book.price * item.quantity} Tk.`, 450, y, {
            width: 70,
            align: "right",
          });

        y += 22;
      });

      /* ================= TOTAL SECTION ================= */
      y += 20;

      const row = (label: string, value: number, offset: number) => {
        doc
          .font("Helvetica")
          .fontSize(9)
          .text(label, 350, y + offset)
          .text(`${value} Tk.`, 450, y + offset, {
            width: 70,
            align: "right",
          });
      };

      row("Sub Total", order.totalAmount - order.deliveryCharge, 0);
      row("Shipping cost", order.deliveryCharge, 15);
      row("Discount", order.totalDiscountedPrice || 0, 30);

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("Grand Total", 350, y + 50)
        .text(`${order.totalAmount} Tk.`, 450, y + 50, {
          width: 70,
          align: "right",
        });

      /* ================= FOOTER ================= */
      doc
        .moveDown(4)
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor("#1A365D")
        .text("Thanks For Shopping With Us!!", 40, 720, {
          align: "center",
          width: 515,
        });

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#718096")
        .text("https://howladarporkasoni.com.bd", 40, 745, {
          align: "center",
          width: 515,
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

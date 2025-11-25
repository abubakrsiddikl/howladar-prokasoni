import {type Request,type Response, Router } from "express";
import { Book } from "../book/book.model";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const books = await Book.find().select("slug updatedAt");

    let xml = `<?xml version="1.0" encoding="UTF-8"?> 
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <url>
    <loc>https://howladarporkasoni.com.bd/</loc>
    <priority>1.0</priority>
  </url>
`;

    books.forEach((b) => {
      xml += `
  <url>
    <loc>https://howladarporkasoni.com.bd/book-details/${b.slug}</loc>
    <lastmod>${new Date(b?.updatedAt as Date).toISOString()}</lastmod>
    <priority>0.80</priority>
  </url>
`;
    });

    xml += `</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error generating sitemap");
  }
});

export const SitemapRoutes = router;

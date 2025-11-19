import fs from "fs";

const baseUrl = "https://howladarporkasoni.com.bd";

const routes = [
  "/", 
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <priority>${route === "/" ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

fs.writeFileSync("./public/sitemap.xml", sitemap);
console.log("Sitemap generated!");

import fs from "fs";

const baseUrl = "https://howladarprokashoni.com";

const robotsTxt = `
User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

fs.writeFileSync("./public/robots.txt", robotsTxt.trim());
console.log(" robots.txt generated!");

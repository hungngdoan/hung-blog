const fs = require("node:fs");
const path = require("node:path");

const outputDir = path.join(__dirname, "..", "_site");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

if (!fs.existsSync(outputDir)) {
  console.error("_site does not exist. Run npm run build first.");
  process.exit(1);
}

const pages = walk(outputDir)
  .filter((file) => file.endsWith(".html"))
  .sort();

let totalBytes = 0;
let totalPoolBytes = 0;

const rows = pages.map((file) => {
  const html = fs.readFileSync(file, "utf8");
  const bytes = Buffer.byteLength(html);
  const pool = html.match(/<template id="rp-pool">[\s\S]*?<\/template>/);
  const poolBytes = pool ? Buffer.byteLength(pool[0]) : 0;
  const articleCount = (html.match(/<article class="blog-post/g) || []).length;

  totalBytes += bytes;
  totalPoolBytes += poolBytes;

  return {
    page: path.relative(outputDir, file).replaceAll("\\", "/"),
    kilobytes: (bytes / 1024).toFixed(1),
    poolKilobytes: (poolBytes / 1024).toFixed(1),
    articles: articleCount,
  };
});

console.table(rows);
console.log(`HTML pages: ${pages.length}`);
console.log(`Total HTML: ${(totalBytes / 1024).toFixed(1)} KB`);
console.log(`Embedded random pools: ${(totalPoolBytes / 1024).toFixed(1)} KB`);
console.log(
  `Pool share: ${totalBytes ? ((totalPoolBytes / totalBytes) * 100).toFixed(1) : "0.0"}%`,
);


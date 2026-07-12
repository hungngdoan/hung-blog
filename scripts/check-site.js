const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const outputDir = path.join(root, "_site");
const postsDir = path.join(root, "src", "posts");
const pathPrefix = "/hung-blog";
const errors = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function fail(message) {
  errors.push(message);
}

if (!fs.existsSync(outputDir)) {
  console.error("_site does not exist. Run npm run build first.");
  process.exit(1);
}

const postFiles = fs.readdirSync(postsDir).filter((file) => file.endsWith(".njk"));
const slugs = new Map();

for (const file of postFiles) {
  const source = fs.readFileSync(path.join(postsDir, file), "utf8");
  const frontMatter = source.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontMatter) {
    fail(`${file}: missing front matter`);
    continue;
  }

  for (const field of ["title", "date", "description", "titleHtml", "displayDate"]) {
    if (!new RegExp(`^${field}:\\s*"?[^"\\s]`, "m").test(frontMatter[1])) {
      fail(`${file}: missing or empty ${field}`);
    }
  }

  const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.njk$/, "");
  if (slugs.has(slug)) fail(`${file}: duplicate slug also used by ${slugs.get(slug)}`);
  else slugs.set(slug, file);

  const body = source.slice(frontMatter[0].length);
  if (/<script\b/i.test(body)) fail(`${file}: post bodies must not contain scripts`);
  if (/<article\b/i.test(body)) fail(`${file}: post bodies must not contain the article shell`);
}

function classifyUrl(value) {
  let parsed;
  try {
    parsed = new URL(value, "https://local.test/hung-blog/index.html");
  } catch {
    return { kind: "invalid" };
  }
  if (parsed.origin !== "https://local.test") return { kind: "external" };

  let pathname;
  try {
    pathname = decodeURIComponent(parsed.pathname);
  } catch {
    return { kind: "invalid" };
  }

  if (pathname === pathPrefix) pathname = "/";
  else if (pathname.startsWith(`${pathPrefix}/`)) pathname = pathname.slice(pathPrefix.length);
  else return { kind: "unprefixed" };

  if (pathname.endsWith("/")) pathname += "index.html";
  return { kind: "local", target: path.join(outputDir, pathname.replace(/^\//, "")) };
}

function isFile(target) {
  try {
    return fs.statSync(target).isFile();
  } catch {
    return false;
  }
}

const htmlFiles = walk(outputDir).filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(outputDir, file).replaceAll("\\", "/");

  if (relative !== "404.html") {
    if (!/<meta name="description" content="[^"]+"/i.test(html)) {
      fail(`${relative}: missing description metadata`);
    }
    if (!/<link rel="canonical" href="[^"]+"/i.test(html)) {
      fail(`${relative}: missing canonical URL`);
    }
  }

  if (html.includes('id="rp-pool"')) {
    fail(`${relative}: contains the embedded random pool`);
  }

  for (const match of html.matchAll(/(?:href|src)="([^"]*)"/gi)) {
    const value = match[1];
    if (!value || value.startsWith("#") || /^(?:data|mailto|tel|javascript):/i.test(value)) {
      continue;
    }
    const result = classifyUrl(value);
    if (result.kind === "external") continue;
    if (result.kind === "unprefixed") {
      fail(`${relative}: internal URL missing the ${pathPrefix} prefix: ${value}`);
    } else if (result.kind === "invalid") {
      fail(`${relative}: malformed URL: ${value}`);
    } else if (!isFile(result.target)) {
      fail(`${relative}: unresolved internal URL ${value}`);
    }
  }
}

const homePath = path.join(outputDir, "index.html");
const homeHtml = fs.readFileSync(homePath, "utf8");
const homeBytes = Buffer.byteLength(homeHtml);
const homePosts = (homeHtml.match(/<article class="blog-post/g) || []).length;
if (homeBytes > 150 * 1024) fail(`index.html exceeds 150 KB: ${homeBytes} bytes`);
if (homePosts !== Math.min(10, postFiles.length)) {
  fail(`index.html contains ${homePosts} post cards, expected ${Math.min(10, postFiles.length)}`);
}
const randomIndexPath = path.join(outputDir, "random-index.json");
let randomEntries = [];
try {
  randomEntries = JSON.parse(fs.readFileSync(randomIndexPath, "utf8"));
} catch (error) {
  fail(`random-index.json is invalid: ${error.message}`);
}
if (randomEntries.length !== postFiles.length) {
  fail(`random-index.json has ${randomEntries.length} entries, expected ${postFiles.length}`);
}
for (const entry of randomEntries) {
  const result =
    entry && typeof entry.url === "string" ? classifyUrl(entry.url) : { kind: "invalid" };
  if (result.kind !== "local" || !isFile(result.target)) {
    fail(`random-index.json has unresolved URL ${entry && entry.url}`);
  }
}

if (errors.length) {
  console.error(`Site integrity check failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Site integrity check passed: ${htmlFiles.length} pages, ${postFiles.length} posts, ` +
    `${(homeBytes / 1024).toFixed(1)} KB homepage.`,
);

const { HtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addFilter("isoDate", (value) => {
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.valueOf()) ? "" : date.toISOString().slice(0, 10);
  });
  eleventyConfig.addFilter("limit", (values, count) =>
    Array.isArray(values) ? values.slice(0, count) : [],
  );
  eleventyConfig.addFilter("groupPostsByMonth", (posts) => {
    const groups = [];
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });

    for (const post of posts || []) {
      const date = post.date instanceof Date ? post.date : new Date(post.data.date);
      const key = date.toISOString().slice(0, 7);
      let group = groups[groups.length - 1];
      if (!group || group.key !== key) {
        group = { key, label: formatter.format(date), posts: [] };
        groups.push(group);
      }
      group.posts.push(post);
    }
    return groups;
  });
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/music");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");

  return {
    pathPrefix: "/hung-blog/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};

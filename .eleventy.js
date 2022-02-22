require("dotenv").config();
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const SyntaxHighlightPlugin = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(SyntaxHighlightPlugin);

  // Passthrough Copy
  eleventyConfig.addPassthroughCopy("public");

  return {
    dir: {
      input: "src",
      data: "./_data",
      includes: "./_includes",
      layouts: "./_layouts",
    },
  };
};

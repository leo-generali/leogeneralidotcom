require("dotenv").config();
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const SyntaxHighlightPlugin = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(SyntaxHighlightPlugin);

  // Passthrough Copy
  eleventyConfig.addPassthroughCopy("public");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath.endsWith(".html")) {
      return htmlmin.minify(content, {
        collapseWhitespace: true,
        removeComments: true,
        useShortDoctype: true,
      });
    }

    return content;
  });


  return {
    dir: {
      input: "src",
      data: "./_data",
      includes: "./_includes",
      layouts: "./_layouts",
    },
  };
};

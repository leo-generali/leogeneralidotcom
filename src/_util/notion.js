const { AssetCache } = require("@11ty/eleventy-cache-assets");
const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const slugify = require("slugify");

const CACHE_TIME = "30m";

const notion = new Client({
  auth: process.env.NOTION_KEY,
});

const n2m = new NotionToMarkdown({
  notionClient: notion,
});

async function getTILData() {
  const tilDataCache = new AssetCache("TIL_DATA");

  if (tilDataCache.isCacheValid(CACHE_TIME)) {
    return tilDataCache.getCachedValue();
  }

  const tils = await notion.databases.query({
    database_id: process.env.NOTION_TILS,
  });

  await tilDataCache.save(tils, "json");

  return tils;
}

async function pageToMarkdown(id) {
  const pageDataCache = new AssetCache(id);

  if (pageDataCache.isCacheValid(CACHE_TIME)) {
    return pageDataCache.getCachedValue();
  }

  const page = await n2m.pageToMarkdown(id);

  await pageDataCache.save(page, "json");

  return page;
}

async function getTILs() {
  const tils = [];
  console.time("Time to get TIL Data");
  const rawTILs = await getTILData();
  console.timeLog("Time to get TIL Data");
  console.timeEnd("Time to get TIL Data");

  for (const rawTIL of rawTILs.results) {
    console.time("Time to get page data");
    const postMarkdownBlocks = await pageToMarkdown(rawTIL.id);
    console.timeLog("Time to get page data");
    console.timeEnd("Time to get page data");

    tils.push({
      title: rawTIL.properties.title.title[0].plain_text,
      slug: slugify(rawTIL.properties.title.title[0].plain_text, {
        lower: true,
        strict: true,
      }),
      markdown: n2m.toMarkdownString(postMarkdownBlocks),
    });
  }

  return tils;
}

async function getHomePage() {
  const homePageMarkdownBlocks = await pageToMarkdown(
    process.env.NOTION_HOME_PAGE
  );
  return n2m.toMarkdownString(homePageMarkdownBlocks);
}

module.exports = { getTILs, getHomePage };

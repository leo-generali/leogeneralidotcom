const { AssetCache } = require("@11ty/eleventy-cache-assets");
const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const slugify = require("slugify");
const { DateTime } = require("luxon");

const CACHE_TIME = "30m";

const notion = new Client({
  auth: process.env.NOTION_KEY,
});

const n2m = new NotionToMarkdown({
  notionClient: notion,
});

function parseChangelog(changelogString, date) {
  const changes = [{ date, text: "First published" }];

  if (!changelogString) return changes;
  for (const change of changelogString.split("; ")) {
    const [date, text] = change.split(": ");
    changes.push({
      date: DateTime.fromISO(date, {
        zone: "America/New_York",
      }).toFormat("LL/dd/yyyy"),
      text: text,
    });
  }

  return changes;
}

function slug(text) {
  return slugify(text, {
    lower: true,
    strict: true,
  });
}

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
  console.timeEnd("Time to get TIL Data");

  for (const rawTIL of rawTILs.results) {
    if (!rawTIL.properties.published.checkbox) {
      continue;
    }
    console.time(
      `Time to get "${rawTIL.properties.title.title[0].plain_text}"`
    );
    const postMarkdownBlocks = await pageToMarkdown(rawTIL.id);
    console.timeEnd(
      `Time to get "${rawTIL.properties.title.title[0].plain_text}"`
    );

    const date = DateTime.fromISO(rawTIL.properties.date.date.start, {
      zone: "America/New_York",
    });

    tils.push({
      changelog: parseChangelog(
        rawTIL?.properties?.changelog?.rich_text[0]?.plain_text || "",
        date.toFormat("LL/dd/yyyy")
      ),
      date: {
        datetime: date.toFormat("yyyy-LL-dd"),
        long: date.toFormat("LLLL d, yyyy"),
        med: date.toFormat("LLL. d, yyyy"),
        seconds: date.toSeconds(),
        short: date.toFormat("L/d/yyyy"),
      },
      markdown: n2m.toMarkdownString(postMarkdownBlocks),
      slug: slug(rawTIL.properties.title.title[0].plain_text),
      tag: rawTIL.properties.tag.select.name,
      title: rawTIL.properties.title.title[0].plain_text,
    });
  }

  return tils.sort((a, b) => b.date.seconds - a.date.seconds);
}

async function getHomePage() {
  const homePageMarkdownBlocks = await pageToMarkdown(
    process.env.NOTION_HOME_PAGE
  );
  return n2m.toMarkdownString(homePageMarkdownBlocks);
}

module.exports = { getTILs, getHomePage };

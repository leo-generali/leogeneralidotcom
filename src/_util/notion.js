const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const slugify = require("slugify");

const notion = new Client({
  auth: process.env.NOTION_KEY,
});

const n2m = new NotionToMarkdown({
  notionClient: notion,
});

async function getTILData() {
  return await notion.databases.query({
    database_id: process.env.NOTION_TILS,
  });
}

async function getTILs() {
  const tils = [];
  const rawTILs = await getTILData();

  for (const rawTIL of rawTILs.results) {
    const postMarkdownBlocks = await n2m.pageToMarkdown(rawTIL.id);

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
  const homePageMarkdownBlocks = await n2m.pageToMarkdown(
    process.env.NOTION_HOME_PAGE
  );
  return n2m.toMarkdownString(homePageMarkdownBlocks);
}

module.exports = { getTILs, getHomePage };

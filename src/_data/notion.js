const Notion = require("../_util/notion");

module.exports = async function () {
  const tils = await Notion.getTILs();
  const home = await Notion.getHomePage();

  return { tils, home };
};

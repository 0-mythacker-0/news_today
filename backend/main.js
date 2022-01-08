// Import
const axios = require("axios").default;
const cheerio = require("cheerio");
const express = require("express");


// Config
const URL = "https://www.prothomalo.com/collection/latest";
var news_data = [];

// Tasks
async function scrapeData() {
  return await axios.get(URL).then(({ data }) => {
    const $ = cheerio.load(data);
    const stories = $(".bn-story-card");

    const story_headlines = stories
      .find(".story-headline")
      .toArray()
      .map((el) => $(el).text());
    const sub_headlines = stories
      .find(".sub-headline")
      .toArray()
      .map((el) => $(el).text());
    const links_togo = stories
      .find("a")
      .toArray()
      .map((el) => $(el).attr("href"));
    const images = stories
      .find("img")
      .toArray()
      .map((el) => $(el).attr("src"));

    return story_headlines.map((headline, index) => {
      return { headline,
               short_description: sub_headlines[index],
               link: links_togo[index],
               image: images[index]
             };
    });
  });
}


const app = express();



app.get("/", async (req, res) => {
    res.json(await scrapeData());
})


app.listen(5000, ()=> console.log(`Server is listening to the PORT 5000`));
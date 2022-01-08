// Import
const axios = require("axios").default;
const cheerio = require("cheerio");
const express = require("express");
const cors = require("cors");

// Config
const elementConfig = (root, headline, summary, link, image) => {
  return {
    root,
    headline,
    summary,
    link: link || "a",
    image: image || "img",
  };
};


const newsDataDictionary = [
  {
    url: "https://www.prothomalo.com/collection/latest",
    element: elementConfig(
      ".bn-story-card",
      ".story-headline",
      ".sub-headline"
    ),
  },
  {
    url: "https://www.ittefaq.com.bd/topic/%E0%A6%AC%E0%A6%BF%E0%A6%B6%E0%A7%87%E0%A6%B7-%E0%A6%B8%E0%A6%82%E0%A6%AC%E0%A6%BE%E0%A6%A6",
    element: elementConfig(
      ".contents .col",
      ".title",
      ".summery"
    ),
  },
];

// Functions

async function getRawData(url) {
  return (
    await axios.get(url, {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "cors",
      Referer: url,
      Host: new URL(url).hostname,
    })
  ).data;
}

// Tasks
async function scrapeData({ url, element }) {
  const { root, headline, summary, link, image } = element;
  const html = await getRawData(url);
  const $ = cheerio.load(html);
  const text = (elem, target) => $(elem).find(target).text().trim();
  const attr = (elem, target, attribute) =>
    $(elem).find(target).attr(attribute);

  const rootEl = $(root);
  const data = [];

  rootEl.toArray().forEach((elem) => {
    const headlineData = text(elem, headline);
    const summaryData = text(elem, summary);
    const linkData = attr(elem, link, "href");
    const imgData = attr(elem, image, "src") || "https://dummyimage.com/200x200";

    data.push({
      headline: headlineData,
      summary: summaryData,
      link: linkData,
      img: imgData,
    });
  });

  return data;
}

(async () => {
  console.log(await scrapeData(newsDataDictionary[1]));
})();




// const app = express();

// app.get("/", async (req, res) => {
//     res.json(await scrapeData());
// })

// app.listen(5000, ()=> console.log(`Server is listening to the PORT 5000`));

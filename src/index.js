const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const PORT = 8000;

const app = express();

const url = "https://www.globo.com/";

app.use(function (err, req, res, next) {
  //do logging and user-friendly error message display
  res.send(500, { status: 500, message: "internal error", type: "internal" });
});

app.get("/GetAllNewsFromGlobo", async function (req, res) {
  const articles = [];

  await axios(url)
    .then((res) => {
      const html = res.data;
      const $ = cheerio.load(html);
      $(".post", html).each(function () {
        const title = $(this).text();
        const url = $(this).find("a").attr("href");
        articles.push({
          title,
          url,
        });
      });
    })
    .catch((error) => {
      console.log(error);
      res.send("An error has happened when fetching data");
    });

  res.json(articles);
});

app.listen(PORT, () => console.log("server running"));

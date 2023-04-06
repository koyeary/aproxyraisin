const express = require("express");
const axios = require("axios");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cheerio = require("cheerio");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get("/favicon.ico", (req, res, next) => {
  res.sendStatus(204);
});

app.get("/info", (req, res, next) => {
  res.send(`Scraping URL for analysis...`);
});

//const API_SERVICE_URL = "https://jsonplaceholder.typicode.com/users";

app.post("/analyze", async (req, res) => {
  const { url } = req.body;

  createProxyMiddleware({
    target: url,
    changeOrigin: true,
    pathRewrite: { [`^/analyze`]: "" },
    logger: console,
  });

  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);
  res.send($("main").text());
});
const PORT = 3001 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});

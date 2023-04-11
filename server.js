const express = require("express");
const session = require("express-session");
const path = require("path");
const axios = require("axios");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get("/favicon.ico", (req, res, next) => {
  res.sendStatus(204);
});

app.post("/showcase", async (req, res, next) => {
  const { url } = req.body;

  try {
    createProxyMiddleware({
      target: url,
      changeOrigin: true,
      pathRewrite: { [`^/showcase`]: "" },
      logger: console,
    });

    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const arrElements = [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "a",
      "li",
      "ul",
      "ol",
      "main",
    ];

    const elements = [];

    const getInnerText = () => {
      arrElements.map((el) => elements.push($(el).text()));
    };

    const setString = () => {
      getInnerText();
      const text = elements.join("");
      const title = $("title").text();
      res.status(200).send({ text, title });
    };

    setString();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.use(
  session({ secret: "testSession", resave: true, saveUninitialized: true })
);

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});

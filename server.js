const express = require("express");
const session = require("express-session");
const path = require("path");
const axios = require("axios");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cheerio = require("cheerio");
const cors = require("cors");
const e = require("express");

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get("/favicon.ico", (req, res, next) => {
  res.sendStatus(204);
});

app.post("/text", async (req, res, next) => {
  const { url } = req.body;
  // Validate URL presence
  if (!url) {
    return res.status(400).send({ message: "URL is required" });
  }
  // Validate URL format
  const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/;
  if (!urlPattern.test(url)) {
    return res.status(400).send({ message: "Invalid URL format" });
  }
  // Check if the URL is reachable
  try {
    await axios.get(url);
  } catch (error) {
    return res.status(400).send({ message: "URL is not reachable" });
  }
  // Create a proxy middleware to handle the request
  try {
    createProxyMiddleware({
      target: url,
      changeOrigin: true,
      logger: console,
    });

    const results = await axios.get(url);

    const html = results.data;
    const $ = cheerio.load(html, { scriptingEnabled: false });

    const arrElements = [
      "a",
      "abbr",
      "address",
      "area",
      "article",
      "aside",
      "audio",
      "b",
      "base",
      "bdi",
      "bdo",
      "blockquote",
      "body",
      "br",
      "button",
      "canvas",
      "caption",
      "cite",
      "code",
      "col",
      "colgroup",
      "data",
      "datalist",
      "dd",
      "del",
      "details",
      "dfn",
      "dialog",
      "div",
      "dl",
      "dt",
      "em",
      "embed",
      "fieldset",
      "figcaption",
      "figure",
      "footer",
      "form",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "head",
      "header",
      "hr",
      "html",
      "i",
      "iframe",
      "img",
      "input",
      "ins",
      "kbd",
      "label",
      "legend",
      "li",
      "link",
      "main",
      "map",
      "mark",
      "meta",
      "meter",
      "nav",
      "noscript",
      "object",
      "ol",
      "optgroup",
      "option",
      "output",
      "p",
      "param",
      "picture",
      "pre",
      "progress",
      "q",
      "rp",
      "rt",
      "ruby",
      "s",
      "samp",
      "script",
      "section",
      "select",
      "small",
      "source",
      "span",
      "strong",
      "style",
      "sub",
      "summary",
      "sup",
      "svg",
      "table",
      "tbody",
      "td",
      "template",
      "textarea",
      "tfoot",
      "th",
      "thead",
      "time",
      "title",
      "tr",
      "track",
      "u",
      "ul",
      "var",
      "video",
      "wbr",
    ];

    let arrText = [];

    const getInnerText = () => {
      arrElements.map((el) => {
        arrText.push($(el).text());
      });
    };

    const setString = () => {
      getInnerText();
      arrText = arrText.filter((text) => !text.includes("function"));
      const innerText = arrText.join("");
      // Check if any text was found
      if (!innerText) {
        return res.status(404).send({ message: "No text found" });
      }
      // Send the text as a response
      res.status(200).send(innerText);
    };

    setString();
  } catch (error) {
    console.log(error);
    res.status(500).send(`Error: ${error}`);
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

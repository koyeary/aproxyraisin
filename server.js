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

app.post("/text", async (req, res, next) => {
  const { url } = req.body;
  console.log(req);
  try {
    createProxyMiddleware({
      target: url,
      changeOrigin: true,
      pathRewrite: { [`^/text`]: "" },
      logger: console,
    });

    const res = await axios.get(url);
    res.sendStatus(200).send(res.data);

    const html = response.data;
    const $ = cheerio.load(html, { scriptingEnabled: false });

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
      "div",
    ];

    const elements = [];

    const getInnerText = () => {
      arrElements.map((el) => {
        elements.push($(el).text());
      });
    };

    const setString = () => {
      getInnerText();
      const text = elements.join("");
      res.status(200).send({ text });
    };

    setString();
  } catch (error) {
    console.log(error);
    res.sendStatus(500).statusMessage(`Error: ${error}`);
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

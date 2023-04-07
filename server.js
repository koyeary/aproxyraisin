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
app.get("/*", (req, res, next) => {
  res.send("Hello World");
});

app.post("/showcase", async (req, res) => {
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
    /* const elements = {
      title: [],
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],
      p: [],
      a: [],
      li: [],
      ul: [],
      ol: [],
      main: [],
    }; */

    const elements = [];

    $("title").each((i, el) => {
      elements.push($(el).text()); //elements.title.push($(el).text());
    });
    $("h1").each((i, el) => {
      elements.push($(el).text()); //elements.h1.push($(el).text());
    });
    $("h2").each((i, el) => {
      elements.push($(el).text()); //elements.h2.push($(el).text());
    });
    $("h3").each((i, el) => {
      elements.push($(el).text()); //elements.h3.push($(el).text());
    });
    $("h4").each((i, el) => {
      elements.push($(el).text()); //elements.h4.push($(el).text());
    });
    $("h5").each((i, el) => {
      elements.push($(el).text()); //elements.h5.push($(el).text());
    });
    $("h6").each((i, el) => {
      elements.push($(el).text()); //elements.h6.push($(el).text());
    });
    $("p").each((i, el) => {
      elements.push($(el).text()); //elements.p.push($(el).text());
    });
    $("a").each((i, el) => {
      elements.push($(el).text()); //elements.a.push($(el).text());
    });
    $("li").each((i, el) => {
      elements.push($(el).text()); //elements.li.push($(el).text());
    });
    $("ul").each((i, el) => {
      elements.push($(el).text()); //elements.ul.push($(el).text());
    });
    $("ol").each((i, el) => {
      elements.push($(el).text()); //elements.ol.push($(el).text());
    });
    $("main").each((i, el) => {
      elements.push($(el).text()); //elements.main.push($(el).text());
    });

    const string = elements.join("");
    res.send(string.replace("\n", ""));
  } catch (error) {
    console.log(error);
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

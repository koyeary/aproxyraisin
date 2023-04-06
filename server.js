const express = require("express");
const session = require("express-session");
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
app.get("/*", (req, res, next) => {
  res.send("Hello World");
});

app.post("/analyze", async (req, res) => {
  const { url } = req.body;

  try {
    createProxyMiddleware({
      target: url,
      changeOrigin: true,
      pathRewrite: { [`^/analyze`]: "" },
      logger: console,
    });

    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const elements = {
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
    };

    $("title").each((i, el) => {
      elements.title.push($(el).text());
    });
    $("h1").each((i, el) => {
      elements.h1.push($(el).text());
    });
    $("h2").each((i, el) => {
      elements.h2.push($(el).text());
    });
    $("h3").each((i, el) => {
      elements.h3.push($(el).text());
    });
    $("h4").each((i, el) => {
      elements.h4.push($(el).text());
    });
    $("h5").each((i, el) => {
      elements.h5.push($(el).text());
    });
    $("h6").each((i, el) => {
      elements.h6.push($(el).text());
    });
    $("p").each((i, el) => {
      elements.p.push($(el).text());
    });
    $("a").each((i, el) => {
      elements.a.push($(el).text());
    });
    $("li").each((i, el) => {
      elements.li.push($(el).text());
    });
    $("ul").each((i, el) => {
      elements.ul.push($(el).text());
    });
    $("ol").each((i, el) => {
      elements.ol.push($(el).text());
    });
    $("main").each((i, el) => {
      elements.main.push($(el).text());
    });

    res.send(elements);
  } catch (error) {
    console.log(error);
  }
});

app.use(
  session({ secret: "testSession", resave: true, saveUninitialized: true })
);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = 3001 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});

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

app.use("/", express.static("public"));
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
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
    const dir = {
      title: $("title").text(),
      h1: $("h1").text(),
      h2: $("h2").text(),
      h3: $("h3").text(),
      h4: $("h4").text(),
      h5: $("h5").text(),
      h6: $("h6").text(),
      p: $("p").text(),
      a: $("a").text(),
      img: $("img").text(),
      li: $("li").text(),
      ul: $("ul").text(),
      ol: $("ol").text(),
      main: $("main").text(),
    };
    res.send(dir);
  } catch (error) {
    console.log(error);
  }
  /*   fs.writeFile("text.txt", dir, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("File has been created"); 
    //res.sendFile(__dirname + "/text.txt");
  });*/
});

app.use(
  session({ secret: "testSession", resave: true, saveUninitialized: true })
);
const PORT = 3001 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});

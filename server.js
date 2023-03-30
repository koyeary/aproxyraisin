const express = require("express");
const axios = require("request");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/parser", (req, res) => {
  axios(
    {
      url: "https://www.findlaw.com/legalblogs/legally-weird/diner-sues-saying-boneless-chicken-wings-arent-really-wings/",
    },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: "error", message: err.message });
      }

      res.json(JSON.parse(body));
    }
  );
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`listening on ${PORT}`));

console.log("Hola mundo");

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());


app.get("/", (req, res) => {
  res.send("Bienvenido a beeAnalizer.com");
});

app.listen(4000, () => {
  console.log("App listening at port", 4000);
});
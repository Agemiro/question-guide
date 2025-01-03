const express = require("express");
const app = express();

//I'm telling express to use EJS as a View engine
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/ask", (req, res) => {
  res.render("ask");
});

app.listen(8080, () => {
  console.log("App is running!");
});

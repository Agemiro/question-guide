const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Question = require("./database/Question");

connection
  .authenticate()
  .then(() => {
    console.log("Connection to the database!");
  })
  .catch((err) => {
    console.log("There was an error: ", err);
  });

//I'm telling express to use EJS as a View engine
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/ask", (req, res) => {
  res.render("ask");
});

app.post("/savequestion", (req, res) => {
  var title = req.body.title;
  var description = req.body.description;

  Question.create({
    title: title,
    description: description,
  }).then(() => {
    res.redirect("/");
  });
});

app.listen(8080, () => {
  console.log("App is running!");
});

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Question = require("./database/Question");
const Answer = require("./database/Answer");
const { where } = require("sequelize");

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
  Question.findAll({ raw: true, order: [["id", "DESC"]] }).then((questions) => {
    res.render("index", {
      questions: questions,
    });
  });
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

app.get("/question/:id", (req, res) => {
  var id = req.params.id;

  Question.findOne({
    where: {
      id: id,
    },
  }).then((question) => {
    if (question != undefined) {
      Answer.findAll({
        where: { questionId: question.id },
        order: [["id", "DESC"]],
      }).then((answers) => {
        res.render("question", {
          question: question,
          answers: answers,
        });
      });
    } else {
      res.redirect("/");
    }
  });
});

app.post("/answer", (req, res) => {
  var body = req.body.body;
  var questionId = req.body.question;

  Answer.create({
    body: body,
    questionId: questionId,
  }).then(() => {
    res.redirect("/question/" + questionId);
  });
});

app.listen(8080, () => {
  console.log("App is running!");
});

const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());

/////////////////////////
// include and initialize the rollbar library with your access token
var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: "f667307596a44f48a0995540917d63f4",
  captureUncaught: true,
  captureUnhandledRejections: true,
});

// record a generic message and send it to Rollbar
rollbar.log("Hello world!");
/////////////////

const students = ["Jimmy", "Timothy", "Jimothy"];

//this is how we're able to see index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

// this is how we're able to see all the students (coming from server)
app.get("/api/students", (req, res) => {
  rollbar.info("Someone requested to see all students");
  res.status(200).send(students);
});

app.post("/api/students", (req, res) => {
  rollbar.info("Someone requested to add a new student");
  let { name } = req.body;

  const index = students.findIndex((student) => {
    return student === name;
  });

  try {
    if (index === -1 && name !== "") {
      students.push(name);
      res.status(200).send(students);
    } else if (name === "") {
      rollbar.log("Someone tried to add a a student with an empty string");
      res.status(400).send("You must enter a name.");
    } else {
      rollbar.log("Someone tried to add a student that already exists.");
      res.status(400).send("That student already exists.");
    }
  } catch (err) {
    console.log(err);
  }
});

app.delete("/api/students/:index", (req, res) => {
  rollbar.info("Someone requested to delete a student");
  const targetIndex = +req.params.index;

  students.splice(targetIndex, 1);
  res.status(200).send(students);
});

const port = process.env.PORT || 5050;

app.listen(port, () => console.log(`Server listening on ${port}`));

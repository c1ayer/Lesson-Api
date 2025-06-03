import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { Lesson } from "./lessons";

const app = express();
const port = 3000;
const filePath = path.join(__dirname, "lessons.json");

app.use(cors());
app.use(express.json());

let lessonList: Lesson[] = [];

// Read file and parse JSON
fs.readFile(filePath, "utf-8", (err, data) => {
  if (err) {
    console.error("Failed to load file:", err.message);
  } else {
    try {
      lessonList = JSON.parse(data);
    } catch (e) {
      console.error("Invalid JSON format:");
    }
  }
});

app.get("/", (req, res) => {
  res.status(200).json(lessonList);
});

app.get("/:name", (req, res) => {
  const lesson = lessonList.find((l) => l.studentname === req.params.name);
  if (lesson) {
    res.status(200).json(lesson);
  } else {
    res.status(404).json({ error: "Lesson not found" });
  }
});

app.post("/", (req, res) => {
  const { studentname, studentid, lessontime, lessondate, lessonid } = req.body;
  if (studentname && studentid && lessontime && lessondate && lessonid) {
    const newLesson: Lesson = { studentname, studentid, lessontime, lessondate, lessonid };
    lessonList.push(newLesson);
    res.status(201).json(newLesson);
  } else {
    res.status(400).json({ error: "Missing required fields" });
  }
});

app.put("/:name", (req, res) => {
  const lesson = lessonList.find((l) => l.studentname === req.params.name);
  if (lesson) {
    Object.assign(lesson, req.body);
    res.status(200).json(lesson);
  } else {
    res.status(404).json({ error: "Lesson not found" });
  }
});

app.delete("/:name", (req, res) => {
  const index = lessonList.findIndex((l) => l.studentname === req.params.name);
  if (index !== -1) {
    const deleted = lessonList.splice(index, 1);
    res.status(200).json(deleted);
  } else {
    res.status(404).json({ error: "Lesson not found" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

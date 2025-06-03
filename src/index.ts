import express, { Request, Response } from "express";
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

// Load lessons from JSON file
fs.readFile(filePath, "utf-8", (err, data) => {
  if (err) {
    console.error("Unable to read file:", filePath);
  } else {
    try {
      lessonList = JSON.parse(data);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
    }
  }
});

// GET all lessons
app.get("/", (_req: Request, res: Response): Response => {
  return res.status(200).json(lessonList);
});

// GET lesson by name
app.get("/:name", (req: Request, res: Response): Response => {
  const lesson = lessonList.find((c) => c.studentname === req.params.name);
  if (lesson) {
    return res.status(200).json(lesson);
  }
  return res.status(404).json({ error: `Lesson: ${req.params.name} not found.` });
});

// POST a new lesson
app.post("/", (req: Request, res: Response): Response => {
  const { studentname, studentid, lessontime, lessondate, lessonid } = req.body;
  if (studentname && studentid && lessontime && lessondate && lessonid) {
    const newLesson: Lesson = { studentname, studentid, lessontime, lessondate, lessonid };
    lessonList.push(newLesson);
    return res.status(201).json(newLesson);
  }
  return res.status(400).json({ error: "Missing fields in request body." });
});

// PUT to update a lesson by name
app.put("/:name", (req: Request, res: Response): Response => {
  const lesson = lessonList.find((c) => c.studentname === req.params.name);
  if (lesson) {
    const { studentname, studentid, lessontime, lessondate, lessonid } = req.body;
    lesson.studentname = studentname;
    lesson.studentid = studentid;
    lesson.lessontime = lessontime;
    lesson.lessondate = lessondate;
    lesson.lessonid = lessonid;
    return res.status(200).json(lesson);
  }
  return res.status(404).json({ error: `Lesson: ${req.params.name} not found.` });
});

// DELETE lesson by name
app.delete("/:name", (req: Request, res: Response): Response => {
  const index = lessonList.findIndex((c) => c.studentname === req.params.name);
  if (index !== -1) {
    const deleted = lessonList.splice(index, 1);
    return res.status(200).json(deleted);
  }
  return res.status(404).json({ error: `Lesson: ${req.params.name} not found.` });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

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
  const {
    is_parent_scheduling_allowed,
    lesson_time,
    replaced_student_program_id,
    instructor_id,
    room_id,
    lesson_id,
    teacher_report_time,
    did_student_attend,
    is_payable_prep,
    student_program_id,
    studio_id,
    lesson_status,
    did_teacher_attend,
    studentname,
    studentid,
    lessontime_display,
    lessondate_display,
  } = req.body;

  // Simple validation: require these critical fields
  if (
    typeof is_parent_scheduling_allowed === "boolean" &&
    typeof lesson_time === "string" &&
    typeof instructor_id === "number" &&
    typeof room_id === "number" &&
    typeof lesson_id === "number" &&
    typeof studio_id === "number" &&
    typeof studentname === "string" &&
    typeof studentid === "string" &&
    typeof lessontime_display === "string" &&
    typeof lessondate_display === "string"
  ) {
    const newLesson: Lesson = {
      is_parent_scheduling_allowed,
      lesson_time,
      replaced_student_program_id: replaced_student_program_id ?? null,
      instructor_id,
      room_id,
      lesson_id,
      teacher_report_time: teacher_report_time ?? null,
      did_student_attend: did_student_attend ?? null,
      is_payable_prep: is_payable_prep ?? null,
      student_program_id: student_program_id ?? null,
      studio_id,
      lesson_status: lesson_status ?? null,
      did_teacher_attend: did_teacher_attend ?? null,
      studentname,
      studentid,
      lessontime_display,
      lessondate_display,
    };

    lessonList.push(newLesson);
    res.status(201).json(newLesson);
  } else {
    res.status(400).json({ error: "Missing or invalid required fields" });
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

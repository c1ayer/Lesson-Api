const express = require("express");
const cors=require("cors");
const port = 3000;

const app = express();
const path = require("path");
const fs = require("fs");

const filePath = path.join(__dirname, "rx.json");

app.use(cors());
// const corsOptions={
//     origin:['http://localhost:4200']
// }
const bodyParser = require("body-parser");

app.use(bodyParser.json());

import { lessons } from './lessons';

let rxList: lessons[] = [];

fs.readFile(filePath, (err: any, data: any) => {
    if (err) {
        console.error("Unable to read file: " + filePath);
    } else {
        rxList = JSON.parse(data)
    }
});

app.get("/", (req, resp) => {    
    resp.status(200);
    return resp.json(rxList);       
});

app.get("/:name", (req, resp) => {
    const prescription = rxList.find(c => c.name == req.params.name);
    
    if (prescription) {
        resp.status(200);
        return resp.json(prescription);
    }

    resp.status(404);
    return resp.json({error: `Prescription: ${req.params.name} not found.`});
});

app.post("/", (req, resp) => {
    // console.log(`body is ${JSON.stringify(req.body)}`);
    // return resp.sendStatus(200);
    const {name, dose,unit,frequency}=req.body;
    if (name && dose && unit && frequency) {
        const newEntry={name, dose,unit,frequency }
        rxList.push(newEntry);
        resp.status(200);
        return resp.json(newEntry);
    }

    resp.status(404);
    return resp.json({error: `Prescription with name: ${req.params.name} not found.`});
});

app.put("/:name",(req,resp)=>{
    const prescription = rxList.find(c => c.name == req.params.name);
    
    if (prescription) {
        const {name, dose, unit, frequency}=req.body;
        prescription.name=name;
        prescription.dose=dose;
        prescription.unit=unit;
        prescription.frequency=frequency;
        resp.status(200);
        return resp.json(prescription);
    }

    resp.status(404);
    return resp.json({error: `Prescription with name: ${req.params.name} not found.`});
});

app.delete("/:name",(req,resp)=>{
    const rxIndex = rxList.findIndex(c => c.name == req.params.name);
    
    if (rxIndex) {
        const deleteIndex=rxList.splice(rxIndex,1);
        resp.status(200);
        return resp.json(deleteIndex);
    }

    resp.status(404);
    return resp.json({error: `Prescription with name: ${req.params.name} not found.`});
});
app.listen(port, () => {
    console.log(`Example express file server listening on port ${port}`);
});
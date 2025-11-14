import express from "express";
import cors from "cors";
import { PythonShell } from "python-shell";
import { getHikingInfo } from "./controllers/planController.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.post("/hiking_plan_info", getHikingInfo);

app.post("/api/recommendations", (req, res) => {
  const options = {
    mode: "text",
    pythonPath: "python3",
    scriptPath: "./python",
    args: [JSON.stringify(req.body)],
  };

  let pyshell = new PythonShell("wrapper.py", options);
  let output = "";

  pyshell.on("message", (message) => {
    output += message;
  });

  pyshell.end((err) => {
    if (err) {
      console.error("Python Error:", err);
      return res.status(500).json({ error: err.message });
    }
    try {
      const result = JSON.parse(output);
      res.json(result);
    } catch (parseErr) {
      console.error("JSON Parse Error:", parseErr);
      res.status(500).json({ error: "Failed to parse Python output" });
    }
  });
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});

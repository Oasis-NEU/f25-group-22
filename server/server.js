import express from "express";
import cors from "cors";
import { getHikingInfo } from "./controllers/planController";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.post("/hiking_plan_info", getHikingInfo);
app.post("/plan_hike");

app.listen(8080, () => {
  console.log("Server running on port 8080");
});

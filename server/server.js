import express from "express";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.listen(8080, () => {
  console.log("Server running on port 8080");
});

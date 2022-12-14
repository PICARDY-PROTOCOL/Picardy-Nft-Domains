import express from "express";
import cors from "cors";
import zkRouter from "./routes/zkProof.js";
const app = express();
const port = process.env.PORT || 8080;
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use(`/zk`, zkRouter);

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "You are connected to picardy zk-Proof adapter" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

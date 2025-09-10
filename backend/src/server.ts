import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { z } from "zod";
import { answer } from "./chain";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

const PORT = Number(process.env.PORT || 3001);
const CSV_PATH = process.env.CSV_PATH || "./data/ctg-studies.csv";

const Body = z.object({ question: z.string().min(1) });

app.get("/health", (_req, res) =>
  res.json({ healthy: true, test: "health check..." }),
);

app.post("/chat", async (req, res) => {
  try {
    const { question } = Body.parse(req.body);
    const ans = await answer(CSV_PATH, question);
    res.json({ response: ans });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err?.message ?? "Bad request" });
  }
});

app.listen(PORT, () => {
  console.log(`CSV chat API listening on http://localhost:${PORT}`);
  console.log(`Using CSV at: ${CSV_PATH}`);
});

import express, { Request, Response } from "express";
import cors from "cors";
import { PORT } from "./config/index.js";
import { heliusRouter } from "./routes/helius.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req: Request, res: Response): any => {
  return res.status(200).json({
    success: true,
    data: "",
    message: "Server is running fine",
  });
});

app.use("/helius", heliusRouter);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

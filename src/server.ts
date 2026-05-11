import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import express, { type Request, type Response } from "express";
import { auth } from "./lib/auth";
import { authMiddleware } from "./middlewares/auth.middleware";

const app = express();
const PORT = 8000;

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/protected", authMiddleware, (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Protected route",
    data: req.auth?.user
  })
})

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

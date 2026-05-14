import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./lib/auth";
import { errorHandler } from "./middlewares/error-handler";
import { env } from "./config/env";
import apiRoute from "./routes";

const app = express();
const PORT = env.PORT;

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api", apiRoute);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

export default app;

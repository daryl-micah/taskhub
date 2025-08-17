import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authRoutes } from "./routes/auth.js";
import { taskRoutes } from "./routes/tasks.js";
import { groupRoutes } from "./routes/groups.js";

const app = new Hono();

app.route("/auth", authRoutes);
app.route("/tasks", taskRoutes);
app.route("/groups", groupRoutes);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";
import type { Variables } from "../types/api.js";
import { requireRole } from "../middleware/requireRole.js";
import z from "zod";

const taskAssignment = new Hono<{ Variables: Variables }>();
taskAssignment.use("*", authMiddleware);

const taskAssignmentSchema = z.object({
  userIds: z.array(z.uuid()).min(1, "At least one user ID is required"),
});

// 1. Assign one or more users to a task
taskAssignment.post(
  "/tasks/:id/assign",
  requireRole("id", ["owner", "admin"]),
  async (c) => {
    const taskId = c.req.param("id");
    const body = await c.req.json();
    const res = taskAssignmentSchema.safeParse(body);
    if (!res.success) return c.json({ error: res.error }, 400);

    const { userIds } = res.data;

    // Insert task assignees
    const assignments = userIds.map((userId) => ({
      taskId,
      userId,
    }));
  }
);

import type { MiddlewareHandler } from "hono";
import { db } from "../db/client.js";
import { tasks } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { requireRole } from "./requireRole.js";

export const requireTaskRole = (allowedRoles: string[]): MiddlewareHandler => {
  return async (c, next) => {
    const taskId = c.req.param("id");

    if (!taskId) {
      return c.json({ error: "Task id is required" }, 400);
    }

    const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId));

    if (!task || task.ownerType !== "group") {
      return c.json({ error: "Task not found or not a group task" }, 404);
    }

    // Add groupId to params for requireRole
    const groupId = task.ownerId;
    c.set("groupId", { groupId });

    // give to requireRole middleware
    return requireRole("groupId", allowedRoles)(c, next);
  };
};

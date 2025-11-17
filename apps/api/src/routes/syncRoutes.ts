import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";
import type { Variables } from "../types/api.ts";
import { db } from "../db/client.js";
import { memberships, tasks } from "../db/schema.js";
import { and, eq, inArray, or, gt } from "drizzle-orm";

const sync = new Hono<{ Variables: Variables }>();
sync.use("*", authMiddleware);

// 1. Get sync since=timestamp
sync.get("/", async (c) => {
  const userId = c.get("userId") as string;
  const since = c.req.query("since");

  if (!since) return c.json({ error: "Since parameter is required" }, 400);

  const sinceDate = new Date(since);
  if (isNaN(sinceDate.getTime())) {
    return c.json({ error: "Invalid since parameter" }, 400);
  }

  // Get groups the user is a member of
  const groupRows = await db
    .select({ groupId: memberships.groupId })
    .from(memberships)
    .where(eq(memberships.userId, userId));
  const groupIds = groupRows.map((row) => row.groupId);

  // Fetch updated tasks: where = for this user AND updated since last sync
  const updatedTasks = await db
    .select()
    .from(tasks)
    .where(
      and(
        or(
          and(eq(tasks.ownerType, "user"), eq(tasks.ownerId, userId)),
          and(eq(tasks.ownerType, "group"), inArray(tasks.ownerId, groupIds))
        ),
        or(gt(tasks.deletedAt, sinceDate), gt(tasks.updatedAt, sinceDate))
      )
    );

  return c.json({ tasks: updatedTasks });
});

// 2. Post sync - upload client changes
sync.post("/", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json<{ tasks: any[]; memberships: any[] }>();

  const now = new Date();

  // 1. Upsert tasks
  for (const task of body.tasks) {
    const [existing] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, task.id));

    if (!existing) {
      await db.insert(tasks).values(task);
    } else if (new Date(task.updatedAt) > new Date(existing.updatedAt)) {
      await db.update(tasks).set(task).where(eq(tasks.id, task.id));
    }
  }

  // 2. Upsert memberships
  for (const m of body.memberships) {
    const [existing] = await db
      .select()
      .from(memberships)
      .where(
        and(
          eq(memberships.groupId, m.groupId),
          eq(memberships.userId, m.userId)
        )
      );
    if (!existing) {
      await db.insert(memberships).values(m);
    } else if (new Date(m.updatedAt) > new Date(existing.updatedAt)) {
      await db
        .update(memberships)
        .set({ ...m, updatedAt: now })
        .where(
          and(
            eq(memberships.groupId, m.groupId),
            eq(memberships.userId, m.userId)
          )
        );
    }
  }
  return c.json({ success: true }, 200);
});

export { sync as syncRoutes };

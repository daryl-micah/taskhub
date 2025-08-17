import { Hono } from "hono";
import type { Variables } from "../types/api.js";
import { db } from "../db/client.js";
import { groups, memberships, tasks } from "../db/schema.js";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const groupRoutes = new Hono<{ Variables: Variables }>();

// Create Group
groupRoutes.post("/", async (c) => {
  const userId = c.get("userId");
  const { name } = await c.req.json<{ name: string }>();

  const newGroupId = uuidv4();

  await db.insert(groups).values({
    id: newGroupId,
    name,
  });

  await db.insert(memberships).values({
    userId,
    groupId: newGroupId,
    role: "owner",
  });

  return c.json({ groupId: newGroupId, name }, 201);
});

// Join an existing group
groupRoutes.post("/:id/join", async (c) => {
  const userId = c.get("userId");
  const groupId = c.req.param("id");

  // Avoid duplicate memberships
  const existing = await db
    .select()
    .from(memberships)
    .where(
      and(eq(memberships.userId, userId), eq(memberships.groupId, groupId))
    );

  if (existing.length > 0) {
    return c.json({ error: "Already a member" }, 400);
  }

  await db.insert(memberships).values({
    userId,
    groupId,
    role: "member",
  });

  return c.json({ success: true });
});

// Get user groups
groupRoutes.get("/", async (c) => {
  const userId = c.get("userId");

  const userGroups = await db
    .select({
      groupId: memberships.groupId,
      groupName: groups.name,
      role: memberships.role,
    })
    .from(memberships)
    .innerJoin(groups, eq(memberships.groupId, groups.id))
    .where(eq(memberships.userId, userId));

  return c.json(userGroups, 200);
});

// Get group tasks
groupRoutes.get("/:id/tasks", async (c) => {
  const userId = c.get("userId");
  const groupId = c.req.param("id");

  // Check membership
  const membership = await db
    .select()
    .from(memberships)
    .where(
      and(eq(memberships.userId, userId), eq(memberships.groupId, groupId))
    );

  if (membership.length === 0) {
    return c.json({ error: "Not a group member" }, 403);
  }

  const groupTasks = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.ownerType, "group"), eq(tasks.ownerId, groupId)));

  return c.json(groupTasks, 200);
});

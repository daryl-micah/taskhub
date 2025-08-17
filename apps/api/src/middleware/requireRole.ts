import type { MiddlewareHandler } from "hono";
import { db } from "../db/client.js";
import { memberships } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

export const requireRole = (
  groupIdParam: string,
  allowedRoles: string[]
): MiddlewareHandler => {
  return async (c, next) => {
    const userId = c.get("userId");
    const groupId = c.req.param(groupIdParam);

    if (!groupId) {
      return c.json({ error: "Group ID is required" }, 400);
    }

    const [membership] = await db
      .select()
      .from(memberships)
      .where(
        and(eq(memberships.groupId, groupId), eq(memberships.userId, userId))
      );

    if (!membership || !allowedRoles.includes(membership.role)) {
      return c.json({ error: "Forbidden" }, 403);
    }

    await next();
  };
};

import { Hono } from "hono";
import type { Variables } from "hono/types";
import { authMiddleware } from "../middleware/auth.js";
import z from "zod";
import { requireRole } from "../middleware/requireRole.js";
import { db } from "../db/client.js";
import { memberships } from "../db/schema.js";
import { and, eq } from "drizzle-orm";

const groupMembership = new Hono<{ Variables: Variables }>();
groupMembership.use("*", authMiddleware);

const userIdSchema = z.object({
    userId: z.uuid(),
})
const roleSchema = z.object({
    role: z.enum(["owner", "admin", "member"]),
});

// 1. Invite a user to a group
groupMembership.post("/:groupId/member/invite", requireRole("groupId", ["owner", "admin"]), async (c) => {
    const groupId = c.req.param("groupId");
    const body = await c.req.json();
    const res = userIdSchema.safeParse(body);
    if (!res.success) return c.json({ error: res.error }, 400);

    const { userId } = res.data;

    const [newMember] = await db.insert(memberships).values({
        groupId,
        userId,
        role: "member",
        createdAt: new Date(),
    }).returning();

    return c.json({ membership: newMember }, 201);
});

// 2. Change a member's role in a group
groupMembership.patch("/:groupId/member/:userId", requireRole("groupId", ["owner", "admin"]), async (c) => {
    const groupId = c.req.param("groupId");
    const userId = c.req.param("userId");
    const body = await c.req.json();
    const res = roleSchema.safeParse(body);
    if (!res.success) return c.json({ error: res.error }, 400);

    const { role } = res.data;

    const [updatedMember] = await db.update(memberships).set({
        role,
    }).where(
        and(
            eq(memberships.groupId, groupId),
            eq(memberships.userId, userId)
        )
    ).returning();

    if (!updatedMember) {
        return c.json({ error: "Membership not found" }, 404);
    }
    
    return c.json({ membership: updatedMember  }, 200);
})

// 3. Remove a user from a group
groupMembership.delete("/:groupId/member/:userId", requireRole("groupId", ["owner", "admin"]), async (c) => {
    
}

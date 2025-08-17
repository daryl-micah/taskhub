import "dotenv/config";
import { db } from "../client.js";
import { users, groups, memberships, tasks, taskAssignees } from "../schema.js";
import { v4 as uuidv4 } from "uuid";

async function seed() {
  const userAId = uuidv4();
  const userBId = uuidv4();
  const groupId = uuidv4();
  const task1Id = uuidv4();
  const task2Id = uuidv4();

  await db.insert(users).values([
    {
      id: userAId,
      email: "alice@example.com",
      password: "hashedpass",
    },
    {
      id: userBId,
      email: "bob@example.com",
      password: "hashedpass",
    },
  ]);

  await db.insert(groups).values([{ id: groupId, name: "Roommates" }]);

  await db.insert(memberships).values([
    { userId: userAId, groupId, role: "owner" },
    { userId: userBId, groupId, role: "member" },
  ]);

  await db.insert(tasks).values([
    {
      id: task1Id,
      ownerType: "user",
      ownerId: userAId,
      title: "Buy groceries",
      description: "Milk, eggs, bread",
      status: "open",
    },
    {
      id: task2Id,
      ownerType: "group",
      ownerId: groupId,
      title: "Clean kitchen",
      description: "Assign to someone",
      status: "open",
    },
  ]);

  await db.insert(taskAssignees).values([{ taskId: task2Id, userId: userBId }]);

  console.log("✅ Seed complete");
}

seed().catch((err) => {
  console.error("❌ Seed failed", err);
});

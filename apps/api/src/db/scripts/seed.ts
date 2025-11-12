import "dotenv/config";
import { db } from "../client.js";
import { users, groups, memberships, tasks, taskAssignees } from "../schema.js";
import { v4 as uuidv4 } from "uuid";

async function seed() {
  console.log("🌱 Starting database seed...");

  // Create user IDs
  const userAId = uuidv4();
  const userBId = uuidv4();
  const userCId = uuidv4();

  // Create group IDs
  const group1Id = uuidv4();
  const group2Id = uuidv4();

  // Create task IDs
  const task1Id = uuidv4();
  const task2Id = uuidv4();
  const task3Id = uuidv4();
  const task4Id = uuidv4();

  // Insert users
  console.log("👤 Creating users...");
  await db.insert(users).values([
    {
      id: userAId,
      email: "alice@example.com",
      firstName: "Alice",
      lastName: "Johnson",
      password: "hashedpass",
    },
    {
      id: userBId,
      email: "bob@example.com",
      firstName: "Bob",
      lastName: "Smith",
      password: "hashedpass",
    },
    {
      id: userCId,
      email: "charlie@example.com",
      firstName: "Charlie",
      lastName: "Brown",
      password: "hashedpass",
    },
  ]);

  // Insert groups
  console.log("👥 Creating groups...");
  await db.insert(groups).values([
    {
      id: group1Id,
      name: "Roommates",
      description: "Shared living space task management",
    },
    {
      id: group2Id,
      name: "Work Team",
      description: "Office collaboration tasks",
    },
  ]);

  // Insert memberships
  console.log("🔗 Creating group memberships...");
  await db.insert(memberships).values([
    { userId: userAId, groupId: group1Id, role: "owner" },
    { userId: userBId, groupId: group1Id, role: "member" },
    { userId: userCId, groupId: group1Id, role: "member" },
    { userId: userAId, groupId: group2Id, role: "member" },
    { userId: userBId, groupId: group2Id, role: "owner" },
  ]);

  // // Insert tasks
  // console.log("📋 Creating tasks...");
  // await db.insert(tasks).values([
  //   {
  //     id: task1Id,
  //     ownerType: "user",
  //     ownerId: userAId,
  //     title: "Buy groceries",
  //     description: "Milk, eggs, bread, and fresh vegetables",
  //     status: "open",
  //     dueAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  //   },
  //   {
  //     id: task2Id,
  //     ownerType: "group",
  //     ownerId: group1Id,
  //     title: "Clean kitchen",
  //     description: "Deep clean including appliances and counters",
  //     status: "open",
  //     dueAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
  //   },
  //   {
  //     id: task3Id,
  //     ownerType: "user",
  //     ownerId: userBId,
  //     title: "Prepare presentation",
  //     description: "Q4 sales review presentation for Monday meeting",
  //     status: "in_progress",
  //     dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  //   },
  //   {
  //     id: task4Id,
  //     ownerType: "group",
  //     ownerId: group2Id,
  //     title: "Update project documentation",
  //     description: "Review and update API documentation for v2.0",
  //     status: "completed",
  //   },
  // ]);

  // // Insert task assignees
  // console.log("👤 Assigning tasks...");
  // await db.insert(taskAssignees).values([
  //   { taskId: task2Id, userId: userBId }, // Bob assigned to clean kitchen
  //   { taskId: task2Id, userId: userCId }, // Charlie also assigned to clean kitchen
  //   { taskId: task4Id, userId: userAId }, // Alice assigned to documentation task
  // ]);

  console.log("✅ Seed complete!");
  console.log("📊 Created:");
  console.log("  • 3 users");
  console.log("  • 2 groups");
  console.log("  • 5 memberships");
  // console.log("  • 4 tasks");
  // console.log("  • 3 task assignments");
}

seed().catch((err) => {
  console.error("❌ Seed failed", err);
});

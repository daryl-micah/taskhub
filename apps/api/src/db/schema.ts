import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";
import z from "zod";

//users table
export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  avatar: text("avatar"),
  password: text("password").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false })
    .defaultNow()
    .notNull(),
});

//Groups/teams
export const groups = pgTable("groups", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: false })
    .defaultNow()
    .notNull(),
});

//memberships - users -> groups
export const memberships = pgTable("memberships", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  groupId: uuid("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"),
  createdAt: timestamp("created_at", { withTimezone: false })
    .defaultNow()
    .notNull(),
});

//tasks table
export const tasks = pgTable("tasks", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  ownerType: text("owner_type").notNull(),
  ownerId: uuid("owner_id").notNull(),
  title: text("title").notNull(),
  description: text("description").default("").notNull(),
  status: text("status").notNull().default("open"),
  dueAt: timestamp("due_at", { withTimezone: false }),
  createdAt: timestamp("created_at", { withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: false }),
});

//task assignees
export const taskAssignees = pgTable("task_assignees", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  taskId: uuid("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: false })
    .defaultNow()
    .notNull(),
});

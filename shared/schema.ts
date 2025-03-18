import { pgTable, text, serial, timestamp, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  accountName: text("account_name").notNull(),
  dealName: text("deal_name").notNull(),
  quarter: text("quarter").notNull(),
  status: text("status").notNull(),
  priority: text("priority").notNull(),
  area: text("area").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull(),
  priority: text("priority").notNull(),
  dueDate: timestamp("due_date"),
  projectId: integer("project_id"), // Removed references since projects table is gone.
  assignedTo: integer("assigned_to").references(() => users.id),
  attachments: json("attachments").default([]),
  activities: json("activities").default([]),
});

export const insertUserSchema = createInsertSchema(users);
export const insertDealSchema = createInsertSchema(deals);
export const insertTaskSchema = createInsertSchema(tasks);

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Deal = typeof deals.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
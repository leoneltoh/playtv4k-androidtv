import { pgTable, text, serial, integer, boolean, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
});

export const channels = pgTable("channels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  logo: text("logo"),
  group: text("group"),
  ownerId: integer("owner_id").references(() => users.id),
});

export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  category: text("category"),
  thumbnail: text("thumbnail"),
  channelId: integer("channel_id").references(() => channels.id).notNull(),
});

export const channelsRelations = relations(channels, ({ one, many }) => ({
  owner: one(users, {
    fields: [channels.ownerId],
    references: [users.id],
  }),
  programs: many(programs),
}));

export const programsRelations = relations(programs, ({ one }) => ({
  channel: one(channels, {
    fields: [programs.channelId],
    references: [channels.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  ownedChannels: many(channels),
}));

// Schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertChannelSchema = createInsertSchema(channels);
export const selectChannelSchema = createSelectSchema(channels);
export const insertProgramSchema = createInsertSchema(programs);
export const selectProgramSchema = createSelectSchema(programs);

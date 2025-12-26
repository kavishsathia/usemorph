import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  pgEnum,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const participantRoleEnum = pgEnum("participant_role", [
  "owner",
  "member",
]);
export const eventTypeEnum = pgEnum("event_type", [
  "user_input",
  "model_response",
  "tool_call",
  "tool_result",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const modules = pgTable("modules", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const participants = pgTable("participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  moduleId: uuid("module_id")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  role: participantRoleEnum("role").notNull().default("member"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chats = pgTable("chats", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  moduleId: uuid("module_id").references(() => modules.id, {
    onDelete: "cascade",
  }),
  settings: jsonb("settings"),
  summary: text("summary"),
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
  eventType: eventTypeEnum("event_type").notNull(),
  content: text("content"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const windows = pgTable("windows", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
  eventId: uuid("event_id").references(() => events.id, {
    onDelete: "set null",
  }),
  windowTag: text("window_tag").notNull(),
  srcdoc: text("srcdoc").notNull(),
  title: text("title"),
  posX: integer("pos_x").notNull().default(50),
  posY: integer("pos_y").notNull().default(50),
  width: integer("width").notNull().default(500),
  height: integer("height").notNull().default(400),
  isMinimised: boolean("is_minimised").notNull().default(false),
  isClosed: boolean("is_closed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  participants: many(participants),
  chats: many(chats),
}));

export const modulesRelations = relations(modules, ({ many }) => ({
  participants: many(participants),
  chats: many(chats),
}));

export const participantsRelations = relations(participants, ({ one }) => ({
  user: one(users, {
    fields: [participants.userId],
    references: [users.id],
  }),
  module: one(modules, {
    fields: [participants.moduleId],
    references: [modules.id],
  }),
}));

export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
  module: one(modules, {
    fields: [chats.moduleId],
    references: [modules.id],
  }),
  events: many(events),
  windows: many(windows),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  chat: one(chats, {
    fields: [events.chatId],
    references: [chats.id],
  }),
  windows: many(windows),
}));

export const windowsRelations = relations(windows, ({ one }) => ({
  chat: one(chats, {
    fields: [windows.chatId],
    references: [chats.id],
  }),
  event: one(events, {
    fields: [windows.eventId],
    references: [events.id],
  }),
}));

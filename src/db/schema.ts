import { pgTable, json, varchar, timestamp } from "drizzle-orm/pg-core";

export interface ChatMessage {
  text: string;
  timestamp: string; // ISO string, e.g., new Date().toISOString()
}

export const messages = pgTable("messages", {
  id: varchar("id", { length: 256 }).primaryKey(),

  fromId: varchar("from_id", { length: 256 }),

  toId: varchar("to_id", { length: 256 }),

  date: timestamp("date", { withTimezone: true }),

  chatData: json("chat_data").$type<ChatMessage[]>(),
});

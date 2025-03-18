import { pgTable, text, serial, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const disasters = pgTable("disasters", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // cyclone, earthquake, flood, etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: json("location").notNull(), // {lat: number, lng: number}
  severity: integer("severity").notNull(), // 1-5 scale
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  affectedAreas: text("affected_areas").array().notNull(),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  disasterId: integer("disaster_id").references(() => disasters.id).notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  status: text("status").notNull(), // active, resolved
});

export const insertDisasterSchema = createInsertSchema(disasters).omit({ id: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true });

export type Disaster = typeof disasters.$inferSelect;
export type Alert = typeof alerts.$inferSelect;
export type InsertDisaster = z.infer<typeof insertDisasterSchema>;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export const LocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export type Location = z.infer<typeof LocationSchema>;

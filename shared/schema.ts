import { pgTable, text, serial, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define Location schema first since it's used in disasters
export const LocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export type Location = z.infer<typeof LocationSchema>;

export const disasters = pgTable("disasters", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // cyclone, earthquake, flood, etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: json("location").$type<Location>().notNull(), // {lat: number, lng: number}
  severity: integer("severity").notNull(), // 1-5 scale
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  affectedAreas: text("affected_areas").array().notNull(),
  windSpeed: integer("wind_speed"), // For cyclones (km/h)
  movement: text("movement"), // Direction and speed of movement
  depth: integer("depth"), // For earthquakes (km)
  magnitude: integer("magnitude"), // For earthquakes (Richter scale)
  rainfall: integer("rainfall"), // For floods and storms (in mm)
  waterLevel: integer("water_level"), // For floods (in cm)
  impactRadius: integer("impact_radius"), // Affected radius in km
  evacuationZone: json("evacuation_zone").$type<Location[]>().array(), // Array of coordinate pairs
  alerts: integer("active_alerts").default(0),
  lastUpdate: timestamp("last_update").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  disasterId: integer("disaster_id").references(() => disasters.id).notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  status: text("status").notNull(), // active, resolved
  priority: integer("priority").default(1), // 1-3 (low to high)
  affectedPopulation: integer("affected_population"),
  evacuationRequired: boolean("evacuation_required").default(false),
  safetyInstructions: text("safety_instructions"),
});

// Create insert schemas
export const insertDisasterSchema = createInsertSchema(disasters, {
  location: LocationSchema,
  evacuationZone: z.array(LocationSchema).optional(),
}).omit({ id: true, lastUpdate: true });

export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true });

// Export types
export type Disaster = typeof disasters.$inferSelect;
export type Alert = typeof alerts.$inferSelect;
export type InsertDisaster = z.infer<typeof insertDisasterSchema>;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
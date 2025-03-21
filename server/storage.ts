import { type Disaster, type Alert, type InsertDisaster, type InsertAlert } from "@shared/schema";
import { disasters, alerts } from "@shared/schema"; // Assuming schema exports are correctly structured. Adjust if necessary.
import { db } from "./db";
import { eq, and, gte } from "drizzle-orm";

export interface IStorage {
  // Disasters
  getDisasters(): Promise<Disaster[]>;
  getDisasterById(id: number): Promise<Disaster | undefined>;
  getDisastersByType(type: string): Promise<Disaster[]>;
  getDisastersByLocation(lat: number, lng: number, radius: number): Promise<Disaster[]>;
  createDisaster(disaster: InsertDisaster): Promise<Disaster>;

  // Alerts
  getAlerts(): Promise<Alert[]>;
  getActiveAlerts(): Promise<Alert[]>;
  get72HourAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlertStatus(id: number, status: string): Promise<Alert | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getDisasters(): Promise<Disaster[]> {
    return await db.select().from(disasters);
  }

  async getDisasterById(id: number): Promise<Disaster | undefined> {
    const [disaster] = await db.select().from(disasters).where(eq(disasters.id, id));
    return disaster;
  }

  async getDisastersByType(type: string): Promise<Disaster[]> {
    return await db.select().from(disasters).where(eq(disasters.type, type));
  }

  async getDisastersByLocation(lat: number, lng: number, radius: number): Promise<Disaster[]> {
    // Basic implementation - can be enhanced with proper geospatial queries
    const allDisasters = await this.getDisasters();
    return allDisasters.filter(disaster => {
      const dlat = disaster.location.lat;
      const dlng = disaster.location.lng;
      const distance = Math.sqrt(Math.pow(dlat - lat, 2) + Math.pow(dlng - lng, 2)) * 111; // rough km conversion
      return distance <= radius;
    });
  }

  async createDisaster(disaster: InsertDisaster): Promise<Disaster> {
    const [newDisaster] = await db.insert(disasters).values(disaster).returning();
    return newDisaster;
  }

  async getAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts);
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).where(eq(alerts.status, 'active'));
  }

  async get72HourAlerts(): Promise<Alert[]> {
    const threeDaysAgo = new Date();
    threeDaysAgo.setHours(threeDaysAgo.getHours() - 72);

    return await db
      .select()
      .from(alerts)
      .where(
        and(
          eq(alerts.status, 'active'),
          gte(alerts.timestamp, threeDaysAgo)
        )
      );
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db.insert(alerts).values(alert).returning();
    return newAlert;
  }

  async updateAlertStatus(id: number, status: string): Promise<Alert | undefined> {
    const [updatedAlert] = await db
      .update(alerts)
      .set({ status })
      .where(eq(alerts.id, id))
      .returning();
    return updatedAlert;
  }
}

export const storage = new DatabaseStorage();
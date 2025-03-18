import { type Disaster, type Alert, type InsertDisaster, type InsertAlert } from "@shared/schema";

export interface IStorage {
  // Disasters
  getDisasters(): Promise<Disaster[]>;
  getDisasterById(id: number): Promise<Disaster | undefined>;
  getDisastersByType(type: string): Promise<Disaster[]>;
  createDisaster(disaster: InsertDisaster): Promise<Disaster>;
  
  // Alerts
  getAlerts(): Promise<Alert[]>;
  getActiveAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlertStatus(id: number, status: string): Promise<Alert | undefined>;
}

export class MemStorage implements IStorage {
  private disasters: Map<number, Disaster>;
  private alerts: Map<number, Alert>;
  private disasterId: number;
  private alertId: number;

  constructor() {
    this.disasters = new Map();
    this.alerts = new Map();
    this.disasterId = 1;
    this.alertId = 1;
  }

  async getDisasters(): Promise<Disaster[]> {
    return Array.from(this.disasters.values());
  }

  async getDisasterById(id: number): Promise<Disaster | undefined> {
    return this.disasters.get(id);
  }

  async getDisastersByType(type: string): Promise<Disaster[]> {
    return Array.from(this.disasters.values()).filter(d => d.type === type);
  }

  async createDisaster(disaster: InsertDisaster): Promise<Disaster> {
    const id = this.disasterId++;
    const newDisaster = { ...disaster, id } as Disaster;
    this.disasters.set(id, newDisaster);
    return newDisaster;
  }

  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values());
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(a => a.status === 'active');
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const id = this.alertId++;
    const newAlert = { ...alert, id } as Alert;
    this.alerts.set(id, newAlert);
    return newAlert;
  }

  async updateAlertStatus(id: number, status: string): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    
    const updatedAlert = { ...alert, status };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }
}

export const storage = new MemStorage();

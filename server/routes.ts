import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertDisasterSchema, insertAlertSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Broadcast to all connected clients
  function broadcast(data: any) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  // WebSocket connection handling
  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      const data = JSON.parse(message.toString());
      if (data.type === 'subscribe') {
        // Handle subscription logic
      }
    });
  });

  // Disaster routes
  app.get('/api/disasters', async (_req, res) => {
    const disasters = await storage.getDisasters();
    res.json(disasters);
  });

  app.get('/api/disasters/:id', async (req, res) => {
    const disaster = await storage.getDisasterById(Number(req.params.id));
    if (!disaster) {
      return res.status(404).json({ message: 'Disaster not found' });
    }
    res.json(disaster);
  });

  app.get('/api/disasters/type/:type', async (req, res) => {
    const disasters = await storage.getDisastersByType(req.params.type);
    res.json(disasters);
  });

  app.get('/api/disasters/location/:lat/:lng/:radius', async (req, res) => {
    const lat = parseFloat(req.params.lat);
    const lng = parseFloat(req.params.lng);
    const radius = parseFloat(req.params.radius);

    if (isNaN(lat) || isNaN(lng) || isNaN(radius)) {
      return res.status(400).json({ message: 'Invalid coordinates or radius' });
    }

    const disasters = await storage.getDisastersByLocation(lat, lng, radius);
    res.json(disasters);
  });

  app.post('/api/disasters', async (req, res) => {
    const result = insertDisasterSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: 'Invalid disaster data' });
    }

    const disaster = await storage.createDisaster(result.data);
    broadcast({ type: 'new_disaster', data: disaster });
    res.status(201).json(disaster);
  });

  // Alert routes
  app.get('/api/alerts', async (_req, res) => {
    const alerts = await storage.getAlerts();
    res.json(alerts);
  });

  app.get('/api/alerts/active', async (_req, res) => {
    const alerts = await storage.getActiveAlerts();
    res.json(alerts);
  });

  app.get('/api/alerts/72h', async (_req, res) => {
    const alerts = await storage.get72HourAlerts();
    res.json(alerts);
  });

  app.post('/api/alerts', async (req, res) => {
    const result = insertAlertSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: 'Invalid alert data' });
    }

    const alert = await storage.createAlert(result.data);
    broadcast({ type: 'new_alert', data: alert });
    res.status(201).json(alert);
  });

  app.patch('/api/alerts/:id/status', async (req, res) => {
    const { status } = req.body;
    if (!status || typeof status !== 'string') {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const alert = await storage.updateAlertStatus(Number(req.params.id), status);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    broadcast({ type: 'alert_updated', data: alert });
    res.json(alert);
  });

  return httpServer;
}
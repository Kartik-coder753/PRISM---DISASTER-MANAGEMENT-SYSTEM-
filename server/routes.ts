import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertDisasterSchema, insertAlertSchema } from "@shared/schema";
import { notificationService } from "./services/notifications";
import { weatherService } from "./services/weather";
import { predictionService } from "./services/prediction";

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

  // Add this to the routes file, before other endpoints
  app.get('/api/notifications/validate', async (_req, res) => {
    try {
      const validationResult = await notificationService.validateSetup();
      res.json(validationResult);
    } catch (error) {
      console.error('Validation endpoint error:', error);
      res.status(500).json({ 
        isValid: false, 
        message: 'Failed to validate notification setup' 
      });
    }
  });

  // Update the test endpoint to support both SMS and WhatsApp
  app.post('/api/notifications/test', async (req, res) => {
    try {
      const { phoneNumber, type = 'sms' } = req.body;
      if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
      }

      // Validate setup first
      const validationResult = await notificationService.validateSetup();
      if (!validationResult.isValid) {
        return res.status(500).json({ 
          message: `Cannot send test notification: ${validationResult.message}` 
        });
      }

      const testMessage = "🔔 This is a test alert from PRISM Disaster Management System";
      const success = type === 'sms' 
        ? await notificationService.sendSMS(phoneNumber, testMessage)
        : await notificationService.sendWhatsAppAlert(phoneNumber, testMessage);

      if (success) {
        res.json({ message: `Test ${type} sent successfully` });
      } else {
        res.status(500).json({ message: `Failed to send test ${type}` });
      }
    } catch (error) {
      console.error('Test notification error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  // Test endpoint for WhatsApp notifications
  //This section is kept as is for now, and could be removed or refactored later if needed.

  // Weather and prediction routes
  app.get('/api/weather/:lat/:lng', async (req, res) => {
    try {
      const { lat, lng } = req.params;
      const weather = await weatherService.getCurrentWeather(parseFloat(lat), parseFloat(lng));
      res.json(weather);
    } catch (error) {
      console.error('Weather API error:', error);
      res.status(500).json({ message: 'Failed to fetch weather data' });
    }
  });

  app.get('/api/weather/forecast/:lat/:lng', async (req, res) => {
    try {
      const { lat, lng } = req.params;
      const forecast = await weatherService.getForecast(parseFloat(lat), parseFloat(lng));
      res.json(forecast);
    } catch (error) {
      console.error('Forecast API error:', error);
      res.status(500).json({ message: 'Failed to fetch forecast data' });
    }
  });

  app.get('/api/predictions', async (_req, res) => {
    try {
      const predictions = await predictionService.predictDisasters();
      res.json(predictions);
    } catch (error) {
      console.error('Prediction API error:', error);
      res.status(500).json({ message: 'Failed to generate predictions' });
    }
  });

  // Disaster routes
  app.get('/api/disasters', async (_req, res) => {
    try {
      const disasters = await storage.getDisasters();
      res.json(disasters);
    } catch (error) {
      console.error('Disasters API error:', error);
      res.status(500).json({ message: 'Failed to fetch disasters' });
    }
  });

  app.get('/api/disasters/:id', async (req, res) => {
    try {
      const disaster = await storage.getDisasterById(Number(req.params.id));
      if (!disaster) {
        return res.status(404).json({ message: 'Disaster not found' });
      }
      res.json(disaster);
    } catch (error) {
      console.error('Disaster API error:', error);
      res.status(500).json({ message: 'Failed to fetch disaster' });
    }
  });

  app.get('/api/disasters/type/:type', async (req, res) => {
    try {
      const disasters = await storage.getDisastersByType(req.params.type);
      res.json(disasters);
    } catch (error) {
      console.error('Disasters API error:', error);
      res.status(500).json({ message: 'Failed to fetch disasters by type' });
    }
  });

  app.get('/api/disasters/location/:lat/:lng/:radius', async (req, res) => {
    try {
      const lat = parseFloat(req.params.lat);
      const lng = parseFloat(req.params.lng);
      const radius = parseFloat(req.params.radius);

      if (isNaN(lat) || isNaN(lng) || isNaN(radius)) {
        return res.status(400).json({ message: 'Invalid coordinates or radius' });
      }

      const disasters = await storage.getDisastersByLocation(lat, lng, radius);
      res.json(disasters);
    } catch (error) {
      console.error('Disasters API error:', error);
      res.status(500).json({ message: 'Failed to fetch disasters by location' });
    }
  });

  app.post('/api/disasters', async (req, res) => {
    try {
      const result = insertDisasterSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid disaster data' });
      }

      const disaster = await storage.createDisaster(result.data);
      broadcast({ type: 'new_disaster', data: disaster });
      res.status(201).json(disaster);
    } catch (error) {
      console.error('Disasters API error:', error);
      res.status(500).json({ message: 'Failed to create disaster' });
    }
  });

  // Alert routes
  app.get('/api/alerts', async (_req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      console.error('Alerts API error:', error);
      res.status(500).json({ message: 'Failed to fetch alerts' });
    }
  });

  app.get('/api/alerts/active', async (_req, res) => {
    try {
      const alerts = await storage.getActiveAlerts();
      res.json(alerts);
    } catch (error) {
      console.error('Alerts API error:', error);
      res.status(500).json({ message: 'Failed to fetch active alerts' });
    }
  });

  app.get('/api/alerts/72h', async (_req, res) => {
    try {
      const alerts = await storage.get72HourAlerts();
      res.json(alerts);
    } catch (error) {
      console.error('Alerts API error:', error);
      res.status(500).json({ message: 'Failed to fetch 72h alerts' });
    }
  });

  app.post('/api/alerts', async (req, res) => {
    try {
      const result = insertAlertSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid alert data' });
      }

      const alert = await storage.createAlert(result.data);

      // Send WhatsApp notification for new alerts
      if (req.body.phoneNumbers && Array.isArray(req.body.phoneNumbers)) {
        const message = notificationService.generateAlertMessage(alert);
        await notificationService.sendBulkAlert(req.body.phoneNumbers, message);
      }

      broadcast({ type: 'new_alert', data: alert });
      res.status(201).json(alert);
    } catch (error) {
      console.error('Alerts API error:', error);
      res.status(500).json({ message: 'Failed to create alert' });
    }
  });

  app.patch('/api/alerts/:id/status', async (req, res) => {
    try {
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
    } catch (error) {
      console.error('Alerts API error:', error);
      res.status(500).json({ message: 'Failed to update alert status' });
    }
  });

  // Setup periodic prediction checks
  setInterval(async () => {
    try {
      const predictions = await predictionService.predictDisasters();
      for (const prediction of predictions) {
        const disaster = await predictionService.generateAlert(prediction);
        if (disaster) {
          broadcast({ type: 'new_disaster', data: disaster });
        }
      }
    } catch (error) {
      console.error('Prediction check error:', error);
    }
  }, 15 * 60 * 1000); // Check every 15 minutes

  return httpServer;
}
import { weatherService } from './weather';
import { storage } from '../storage';
import type { Disaster } from '@shared/schema';

export class DisasterPredictionService {
  async predictDisasters() {
    try {
      const highRiskAreas = await this.getHighRiskAreas();
      const predictions: any[] = [];

      console.log('Starting disaster predictions for high risk areas:', highRiskAreas.length);

      for (const area of highRiskAreas) {
        console.log(`Analyzing area: ${area.name} (${area.lat}, ${area.lng})`);
        const weatherData = await weatherService.getCurrentWeather(area.lat, area.lng);
        const forecast = await weatherService.getForecast(area.lat, area.lng);

        if (weatherData && forecast) {
          const analysis = weatherService.analyzeSeverity(weatherData);
          console.log(`Weather analysis for ${area.name}:`, {
            severity: analysis.severity,
            conditions: analysis.conditions,
            warnings: analysis.warnings
          });

          if (analysis.severity >= 3) {
            predictions.push({
              location: { lat: area.lat, lng: area.lng },
              type: this.getPredictedDisasterType(weatherData, forecast),
              severity: analysis.severity,
              warnings: analysis.warnings,
              conditions: analysis.conditions,
              area: area.name
            });
          }
        }
      }

      console.log(`Generated ${predictions.length} disaster predictions`);
      return predictions;
    } catch (error) {
      console.error('Error in predictDisasters:', error);
      throw error;
    }
  }

  private async getHighRiskAreas() {
    // Return major cities and known high-risk areas in India
    return [
      { lat: 19.0760, lng: 72.8777, name: "Mumbai" }, // Mumbai - cyclones, floods
      { lat: 22.5726, lng: 88.3639, name: "Kolkata" }, // Kolkata - cyclones, floods
      { lat: 13.0827, lng: 80.2707, name: "Chennai" }, // Chennai - cyclones, floods
      { lat: 17.3850, lng: 78.4867, name: "Hyderabad" }, // Hyderabad - heat waves
      { lat: 23.8315, lng: 91.2868, name: "Agartala" }, // Agartala - earthquakes
      { lat: 20.2961, lng: 85.8245, name: "Bhubaneswar" }, // Bhubaneswar - cyclones
      { lat: 26.1445, lng: 91.7362, name: "Guwahati" }, // Guwahati - floods
      { lat: 34.0837, lng: 74.7973, name: "Srinagar" }, // Srinagar - earthquakes
      { lat: 25.5941, lng: 85.1376, name: "Patna" }, // Patna - floods
      { lat: 27.1767, lng: 78.0081, name: "Agra" } // Agra - heat waves
    ];
  }

  private getPredictedDisasterType(weatherData: any, forecast: any) {
    try {
      const conditions = {
        wind_speed: weatherData.wind?.speed || 0,
        rainfall: weatherData.rain?.['3h'] || 0,
        pressure: weatherData.main?.pressure || 1013,
        temperature: weatherData.main?.temp || 25
      };

      console.log('Analyzing conditions for disaster prediction:', conditions);

      // Cyclone indicators
      if (conditions.wind_speed > 118 || conditions.pressure < 970) {
        return 'cyclone';
      }

      // Flood indicators
      if (conditions.rainfall > 50 || 
          (conditions.rainfall > 30 && forecast.list?.[0]?.rain?.['3h'] > 30)) {
        return 'flood';
      }

      // Heat wave
      if (conditions.temperature > 40) {
        return 'heatwave';
      }

      // Default to storm for other severe weather
      return 'storm';
    } catch (error) {
      console.error('Error in getPredictedDisasterType:', error);
      return 'storm'; // Default fallback
    }
  }

  async generateAlert(prediction: any): Promise<Disaster | null> {
    try {
      console.log('Generating alert for prediction:', prediction);

      const disaster = await storage.createDisaster({
        type: prediction.type,
        title: `${prediction.type.charAt(0).toUpperCase() + prediction.type.slice(1)} Warning for ${prediction.area}`,
        description: `Predicted ${prediction.type} with severity level ${prediction.severity}. ${prediction.warnings.join('. ')}`,
        location: prediction.location,
        severity: prediction.severity,
        affectedAreas: [prediction.area],
        timestamp: new Date(),
        windSpeed: prediction.conditions.wind_speed,
        movement: 'Monitoring',
        impactRadius: prediction.severity * 20, // Radius increases with severity
        evacuationZone: null,
        alerts: 0,
        lastUpdate: new Date()
      });

      console.log('Created disaster alert:', disaster);
      return disaster;
    } catch (error) {
      console.error('Error generating alert:', error);
      return null;
    }
  }
}

export const predictionService = new DisasterPredictionService();
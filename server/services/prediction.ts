import { weatherService } from './weather';
import { storage } from '../storage';
import type { Disaster } from '@shared/schema';

export class DisasterPredictionService {
  async predictDisasters() {
    const highRiskAreas = await this.getHighRiskAreas();
    const predictions: any[] = [];

    for (const area of highRiskAreas) {
      const weatherData = await weatherService.getCurrentWeather(area.lat, area.lng);
      const forecast = await weatherService.getForecast(area.lat, area.lng);
      
      if (weatherData && forecast) {
        const analysis = weatherService.analyzeSeverity(weatherData);
        
        if (analysis.severity >= 3) {
          predictions.push({
            location: { lat: area.lat, lng: area.lng },
            type: this.getPredictedDisasterType(weatherData, forecast),
            severity: analysis.severity,
            warnings: analysis.warnings,
            conditions: analysis.conditions
          });
        }
      }
    }

    return predictions;
  }

  private async getHighRiskAreas() {
    // This would typically come from a database of known high-risk areas
    // For now, returning major cities in India
    return [
      { lat: 19.0760, lng: 72.8777, name: "Mumbai" }, // Mumbai
      { lat: 22.5726, lng: 88.3639, name: "Kolkata" }, // Kolkata
      { lat: 13.0827, lng: 80.2707, name: "Chennai" }, // Chennai
      { lat: 17.3850, lng: 78.4867, name: "Hyderabad" }, // Hyderabad
      { lat: 23.8315, lng: 91.2868, name: "Agartala" }, // Agartala
      { lat: 20.2961, lng: 85.8245, name: "Bhubaneswar" }, // Bhubaneswar
    ];
  }

  private getPredictedDisasterType(weatherData: any, forecast: any) {
    const conditions = {
      wind_speed: weatherData.wind?.speed || 0,
      rainfall: weatherData.rain?.['3h'] || 0,
      pressure: weatherData.main?.pressure || 1013
    };

    if (conditions.wind_speed > 118) return 'cyclone';
    if (conditions.rainfall > 50) return 'flood';
    if (conditions.pressure < 970) return 'storm';
    
    return 'storm'; // Default to storm for high-severity weather
  }

  async generateAlert(prediction: any): Promise<Disaster | null> {
    try {
      const disaster = await storage.createDisaster({
        type: prediction.type,
        title: `${prediction.type.charAt(0).toUpperCase() + prediction.type.slice(1)} Warning`,
        description: `Predicted ${prediction.type} with severity level ${prediction.severity}. ${prediction.warnings.join('. ')}`,
        location: prediction.location,
        severity: prediction.severity,
        affectedAreas: [prediction.location.name || 'Affected Area'],
        timestamp: new Date(),
        windSpeed: prediction.conditions.wind_speed,
        movement: 'Monitoring',
        impactRadius: 50
      });

      return disaster;
    } catch (error) {
      console.error('Error generating alert:', error);
      return null;
    }
  }
}

export const predictionService = new DisasterPredictionService();

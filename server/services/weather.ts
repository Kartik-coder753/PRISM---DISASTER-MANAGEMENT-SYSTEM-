import axios from 'axios';

export class WeatherService {
  private readonly apiKey = process.env.OPENWEATHERMAP_API_KEY;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  async getCurrentWeather(lat: number, lon: number) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );
      return response.data;
    } catch (error) {
      console.error('Weather API error:', error);
      return null;
    }
  }

  async getForecast(lat: number, lon: number) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );
      return response.data;
    } catch (error) {
      console.error('Forecast API error:', error);
      return null;
    }
  }

  async getWeatherAlerts(lat: number, lon: number) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/onecall?lat=${lat}&lon=${lon}&appid=${this.apiKey}&exclude=minutely,hourly&units=metric`
      );
      return response.data.alerts || [];
    } catch (error) {
      console.error('Weather alerts API error:', error);
      return [];
    }
  }

  analyzeSeverity(weatherData: any) {
    const conditions = {
      wind_speed: weatherData.wind?.speed || 0,
      rainfall: weatherData.rain?.['3h'] || 0,
      temperature: weatherData.main?.temp || 0,
      humidity: weatherData.main?.humidity || 0
    };

    let severity = 1;
    
    // Wind speed severity (km/h)
    if (conditions.wind_speed > 118) severity = 5; // Hurricane force
    else if (conditions.wind_speed > 89) severity = 4; // Storm force
    else if (conditions.wind_speed > 62) severity = 3; // Gale force
    else if (conditions.wind_speed > 39) severity = 2; // High wind

    // Rainfall severity (mm/3h)
    if (conditions.rainfall > 100) severity = Math.max(severity, 5);
    else if (conditions.rainfall > 50) severity = Math.max(severity, 4);
    else if (conditions.rainfall > 30) severity = Math.max(severity, 3);
    else if (conditions.rainfall > 15) severity = Math.max(severity, 2);

    return {
      severity,
      conditions,
      warnings: this.getWarnings(conditions)
    };
  }

  private getWarnings(conditions: any) {
    const warnings = [];
    if (conditions.wind_speed > 62) warnings.push('Dangerous wind conditions');
    if (conditions.rainfall > 30) warnings.push('Heavy rainfall alert');
    if (conditions.temperature > 40) warnings.push('Extreme heat warning');
    if (conditions.humidity > 90) warnings.push('High humidity alert');
    return warnings;
  }
}

export const weatherService = new WeatherService();

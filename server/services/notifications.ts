import twilio from 'twilio';

let client: any = null;

// Initialize Twilio client with better error handling
try {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw new Error('Missing Twilio credentials');
  }

  if (!process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
    throw new Error('Invalid Twilio Account SID format - must start with AC');
  }

  if (!process.env.TWILIO_PHONE_NUMBER) {
    throw new Error('Missing Twilio phone number');
  }

  client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  console.log('Twilio client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Twilio client:', error);
}

export class NotificationService {
  async validateSetup(): Promise<{ isValid: boolean; message: string }> {
    try {
      if (!client) {
        return { isValid: false, message: 'Twilio client not initialized' };
      }

      // Test if we can access the Twilio API
      const account = await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
      console.log('Successfully connected to Twilio account:', account.friendlyName);

      return { isValid: true, message: 'Twilio setup is valid' };
    } catch (error) {
      console.error('Twilio validation error:', error);
      return { 
        isValid: false, 
        message: `Twilio setup validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  validatePhoneNumber(phoneNumber: string): boolean {
    // Basic phone number validation for Indian numbers
    const phoneRegex = /^\+91[1-9]\d{9}$/;
    return phoneRegex.test(phoneNumber);
  }

  async sendSMS(to: string, message: string) {
    try {
      if (!client) {
        throw new Error('Twilio client not initialized');
      }

      if (!this.validatePhoneNumber(to)) {
        throw new Error('Invalid phone number format. Must be +91 followed by 10 digits');
      }

      console.log('Sending SMS to:', to);
      const response = await client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to,
        body: message,
      });

      console.log('SMS sent successfully:', response.sid);
      return true;
    } catch (error) {
      console.error('SMS notification error:', error);
      return false;
    }
  }

  async sendWhatsAppAlert(to: string, message: string) {
    try {
      if (!client) {
        throw new Error('Twilio client not initialized');
      }

      if (!this.validatePhoneNumber(to)) {
        throw new Error('Invalid phone number format. Must be +91 followed by 10 digits');
      }

      console.log('Sending WhatsApp message to:', to);
      const response = await client.messages.create({
        from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
        to: `whatsapp:${to}`,
        body: message,
      });

      console.log('WhatsApp notification sent successfully:', response.sid);
      return true;
    } catch (error) {
      console.error('WhatsApp notification error:', error);
      return false;
    }
  }

  async sendBulkAlert(numbers: string[], message: string, type: 'sms' | 'whatsapp' = 'whatsapp') {
    console.log(`Sending bulk ${type} to ${numbers.length} recipients`);

    // Filter out invalid numbers
    const validNumbers = numbers.filter(num => this.validatePhoneNumber(num));
    if (validNumbers.length === 0) {
      console.error('No valid phone numbers provided');
      return 0;
    }

    const sendMethod = type === 'sms' ? this.sendSMS.bind(this) : this.sendWhatsAppAlert.bind(this);
    const results = await Promise.allSettled(
      validNumbers.map(number => sendMethod(number, message))
    );

    const successCount = results.filter(r => r.status === 'fulfilled').length;
    console.log(`Successfully sent ${successCount} out of ${validNumbers.length} ${type} alerts`);
    return successCount;
  }

  generateAlertMessage(disaster: any) {
    const message = `🚨 URGENT: ${disaster.type.toUpperCase()} ALERT 🚨
Location: ${disaster.affectedAreas.join(', ')}
Severity: Level ${disaster.severity}
${disaster.description}

Safety Instructions:
${this.getSafetyInstructions(disaster.type)}

Stay tuned for updates and follow official instructions.
Track live updates: ${process.env.APP_URL || 'https://prism-disaster-management.repl.co'}/dashboard/${disaster.type}`;

    console.log('Generated alert message:', message);
    return message;
  }

  private getSafetyInstructions(disasterType: string): string {
    const instructions: Record<string, string> = {
      cyclone: "- Stay indoors and away from windows\n- Keep emergency kit ready\n- Follow evacuation orders",
      flood: "- Move to higher ground\n- Avoid walking through water\n- Listen to local authorities",
      earthquake: "- Drop, Cover, and Hold On\n- Stay away from windows\n- Be prepared for aftershocks",
      storm: "- Seek sturdy shelter\n- Stay away from trees and power lines\n- Keep emergency supplies handy"
    };
    return instructions[disasterType] || "Follow local authority instructions and stay safe.";
  }
}

export const notificationService = new NotificationService();
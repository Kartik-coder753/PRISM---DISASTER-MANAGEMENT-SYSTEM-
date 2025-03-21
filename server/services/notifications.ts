import twilio from 'twilio';

let client: any = null;

try {
  client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  console.log('Twilio client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Twilio client:', error);
}

export class NotificationService {
  async sendWhatsAppAlert(to: string, message: string) {
    try {
      if (!client) {
        throw new Error('Twilio client not initialized');
      }

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

  async sendBulkAlert(numbers: string[], message: string) {
    console.log(`Sending bulk alert to ${numbers.length} recipients`);
    const results = await Promise.allSettled(
      numbers.map(number => this.sendWhatsAppAlert(number, message))
    );
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    console.log(`Successfully sent ${successCount} out of ${numbers.length} alerts`);
    return successCount;
  }

  generateAlertMessage(disaster: any) {
    const message = `🚨 URGENT: ${disaster.type.toUpperCase()} ALERT 🚨
Location: ${disaster.affectedAreas.join(', ')}
Severity: Level ${disaster.severity}
${disaster.description}

Safety Instructions:
${this.getSafetyInstructions(disaster.type)}

Stay tuned for updates and follow official instructions.`;

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
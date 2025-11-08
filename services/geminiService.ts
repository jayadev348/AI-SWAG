
import { GoogleGenAI } from "@google/genai";
import { CarDetails, DriverDetails } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using fallback messages.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

interface MessageDetails {
    car: CarDetails;
    driver: DriverDetails;
    eta?: string;
}

export const generateStatusMessage = async (
    type: 'registration' | 'in_transit' | 'ready',
    details: MessageDetails
): Promise<string> => {
    if (!API_KEY) {
      if (type === 'registration') {
        return `Welcome! Your ${details.car.make} ${details.car.model} is registered. Our driver, ${details.driver.name}, will take good care of it.`;
      }
      if (type === 'in_transit') {
        return `Great news! ${details.driver.name} is bringing your ${details.car.make} ${details.car.model}. It will be ready in about ${details.eta} minutes.`;
      }
      return `Your ${details.car.make} ${details.car.model} is ready for pickup!`;
    }

    let prompt = '';
    if (type === 'registration') {
        prompt = `You are a friendly valet parking assistant. Write a short, welcoming confirmation message (1-2 sentences) for a customer who just registered their ${details.car.make} ${details.car.model}. Mention that their driver, ${details.driver.name}, is assigned to them. Be warm and reassuring.`;
    } else if (type === 'in_transit') {
        prompt = `You are a friendly valet parking assistant. Write a short, exciting update message (1-2 sentences) for a customer. Their driver, ${details.driver.name}, is retrieving their ${details.car.make} ${details.car.model} and the estimated time is ${details.eta} minutes. Sound helpful and efficient.`;
    } else { // type === 'ready'
        prompt = `You are a friendly valet parking assistant. Write a short, clear message (1-2 sentences) for a customer informing them their ${details.car.make} ${details.car.model} is now ready for pickup. Mention the driver, ${details.driver.name}, has delivered it. Be concise and positive.`;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error('Error generating message with Gemini:', error);
        // Fallback message in case of API error
        if (type === 'registration') {
             return `Your ${details.car.make} ${details.car.model} is now registered with us. ${details.driver.name} is at your service. Enjoy your time!`;
        }
        if (type === 'in_transit') {
            return `Your ${details.car.make} ${details.car.model} is on its way! Expect it in approximately ${details.eta} minutes.`;
        }
        return `Your ${details.car.make} ${details.car.model} is ready for pickup. Please meet ${details.driver.name} at the exit.`;
    }
};

// services/authService.js
import axios from "axios";

const webhookServiceUrl = "http://localhost:8000"; // Replace with your actual webhook service URL

// This is your login function that you'd like to run every minute
export async function loginFunction() {
  try {
    console.log("Running login function...");

    // Make a POST request to the webhook service
    const response = await axios.get(webhookServiceUrl);

    console.log("Webhook response:", response.data);
  } catch (error) {
    console.error("Error in login function:", error);
  }
}

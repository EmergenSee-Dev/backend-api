import axios from "axios";

export const sendSms = async ({ to, code }) => {
  try {
    const apiUrl = "https://v3.api.termii.com/api/sms/send"; // Termii API URL
    const apiKey = process.env.SMS_KEY
    const requestBody = {
      to: to,
      sms: `Hello there, this is your OTP code from Emergensee ${code}`,
      api_key: apiKey,
      from: "Emergensee",
      channel: "generic",
      type: "plain"
    };

    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response from Termii:", response.data);
  } catch (error) {
    console.error("Error sending SMS:", error.response?.data || error.message);
  }
};

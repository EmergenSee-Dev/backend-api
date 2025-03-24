// import axios from "axios";

// export const sendSms = async ({ to, code }) => {
//   try {
//     const apiUrl = `https://jj2mvv.api.infobip.com/sms/2/text/advanced`; // Infobip API URL
//     const apiKey = process.env.INFOBIP_KEY;

//     if (!apiKey) {
//       throw new Error("Infobip API key is missing. Check your .env file.");
//     }

//     const requestBody = {
//       messages: [
//         {
//           destinations: [{ to: to }],
//           from: "ServiceSMS",
//           text: `Hello there, this is your OTP code from Emergensee: ${code}`,
//         },
//       ],
//     };

//     const response = await axios.post(apiUrl, requestBody, {
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `App ${apiKey}`,
//         'Accept': 'application/json'
//       },
//     });

//     console.log("Response from Infobip:", response.data);
//   } catch (error) {
//     // console.log(error)
//     console.error("Error sending SMS:", error.response?.data || error.message);
//   }
// };


import axios from "axios";

export const sendSms = async ({ to, code }) => {
  try {
    const apiUrl = "https://v3.api.termii.com/api/sms/send"; // Termii API URL
    const apiKey = process.env.SMS_KEY

    if (!apiKey) {
      throw new Error("API key is missing. Check your .env file.");
    }
    console.log(to)
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
        "Content-Type": "application/json"
      },
    });

    console.log("Response from Termii:", response.data);
  } catch (error) {
    console.error("Error sending SMS:", error.response?.data || error.message);
  }
};
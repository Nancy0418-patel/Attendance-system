// // utils/notificationService.js

// const axios = require("axios");

// async function sendPushNotification({ title, message, player_ids }) {
//   try {
//     const notificationData = {
//       app_id: "93d8ad7c-13ee-4c91-aa2c-fa97fc2e3c10",
//       headings: { en: title },
//       contents: { en: message },
//     };

//     if (player_ids && player_ids.length > 0) {
//       notificationData.include_player_ids = player_ids;
//     } else {
//       notificationData.included_segments = ["All"]; // Fallback to all if no specific players are provided
//     }

//     const response = await axios.post(
//       'https://onesignal.com/api/v1/notifications',
//       notificationData,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`
//         },
//       }
//     );
//     console.log('OneSignal API Response:', response.data);
//     return { success: true, result: response.data };
//   } catch (err) {
//     console.error('Error sending push notification to OneSignal:', err.response ? err.response.data : err.message);
//     throw new Error(err.message);
//   }
// }

// module.exports = sendPushNotification;
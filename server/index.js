const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();
const PORT = process.env.PORT || 5000;

// Twilio credentials
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const sendMessage = async (message, phoneNumber) => {
  const result = await client.messages.create({
    from: "whatsapp:+14155238886", // Twilio WhatsApp sandbox number
    body: message,
    to: `whatsapp:${phoneNumber}`,
  });

  return result;
};

// Endpoint to send WhatsApp message
app.post("/send-whatsapp", async (req, res) => {
  const { phoneNumbers, message } = req.body;
  console.log(req.body);

  const sendMessagePromises = phoneNumbers.map((phoneNumber) => {
    sendMessage(message, phoneNumber);
  });

  await Promise.all(sendMessagePromises);

  res.status(200).send("Message sent successfully");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

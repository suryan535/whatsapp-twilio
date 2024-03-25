const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const ElevenLabs = require("elevenlabs-node");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 5000;

// Twilio credentials
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
const ELEVEN_LABS_VOICE_ID = process.env.ELEVEN_LABS_VOICE_ID;

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const client = new twilio(accountSid, authToken);
const voice = new ElevenLabs({
  apiKey: ELEVEN_LABS_API_KEY, // Your API key from Elevenlabs
  voiceId: ELEVEN_LABS_VOICE_ID, // A Voice ID from Elevenlabs
});
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const sendMessage = async (message, phoneNumber, mediaUrl) => {
  console.log(phoneNumber);

  const result = await client.messages.create({
    from: "whatsapp:+14155238886", // Twilio WhatsApp sandbox number
    body: message,
    mediaUrl: [mediaUrl],
    to: `whatsapp:${phoneNumber}`,
  });

  console.log(result);

  return result;
};

async function uploadAudioFile(filePath, fileName) {
  try {
    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from("audio")
      .upload(fileName, filePath);

    if (error) {
      throw error;
    }

    console.log(data);
    // Get the media URL
    const mediaUrl = data.fullPath;
    return mediaUrl;
  } catch (error) {
    console.error("Error uploading file:", error.message);
    throw error;
  }
}

async function getPublicUrl(fileName) {
  try {
    const { data, error } = await supabase.storage
      .from("audio")
      .getPublicUrl(fileName);

    if (error) {
      throw error;
    }

    return data.publicUrl;
  } catch (error) {
    console.error("Error getting public URL:", error.message);
    throw error;
  }
}

// Endpoint to send WhatsApp message
app.post("/send-whatsapp", async (req, res) => {
  const { phoneNumbers, message } = req.body;

  console.log(phoneNumbers, message);
  const voicePromise = await voice
    .textToSpeech({
      // Required Parameters
      fileName: "audio.mp3", // The name of your audio file
      textInput: message, // The text you wish to convert to speech
    })
    .then((res) => {
      console.log(res);
    });

  const filePath = "./audio.mp3"; // Path to your audio file
  const fileName = "audio.mp3"; // Name of the file

  const mediaUrl = await uploadAudioFile(filePath, fileName);

  // const completeUrl = `https://pkiytlzyhnmbbaoybwsd.supabase.co/storage/v1/object/public/${mediaUrl}/`;
  // console.log(mediaUrl);

  const completeUrl = await getPublicUrl(fileName);

  console.log(completeUrl);
  const sendMessagePromises = phoneNumbers.map((phoneNumber) => {
    sendMessage(message, phoneNumber, completeUrl);
  });

  await Promise.all(sendMessagePromises);

  res.status(200).send("Message sent successfully");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import { post } from "../utils/request";
import { API_DOMAIN } from "../constants/variables";

export const changeVoiceWithSelectedModel = async ({ options }) => {
  const formData = new FormData();
  console.log("options", options);

  // Append the audio file and model_id to the form data
  formData.append("file", options.audio); // Ensure "file" is the correct field name
  formData.append("model_id", options.modelId);

  console.log("formData", formData);

  try {
    // Fetch request to API
    const response = await fetch(API_DOMAIN + "infer-audio", {
      method: "POST",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
      body: formData,
    });

    // Handle errors in the response
    if (!response.ok) {
      const errorDetails = await response.text(); // Get the error details
      console.error("Error:", errorDetails);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Process the response as a blob since it's an audio file
    const audioBlob = await response.blob();

    // Create a URL from the blob
    const audioUrl = URL.createObjectURL(audioBlob);

    // Return the audio URL so it can be used to play the audio
    return audioUrl;
  } catch (error) {
    console.error("Failed to process the audio:", error);
    throw error;
  }
};

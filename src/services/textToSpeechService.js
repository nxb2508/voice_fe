import { API_DOMAIN } from "../constants/variables";

export const textToSpeechWithTextPlainInput = async (datas) => {
  try {
    console.log(datas);
    // Fetch request to API
    const response = await fetch(API_DOMAIN + "text-to-speech-and-infer/", {
      method: "POST",
      body: JSON.stringify(datas),
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

export const textToSpeechWithFileInput = async (formData) => {

  try {
    // Fetch request to API
    const response = await fetch(API_DOMAIN + "text-file-to-speech-and-infer/", {
      method: "POST",
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

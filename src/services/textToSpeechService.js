import { BE_DOMAIN } from "../constants/variables";
import { getCookie } from "../helper/cookie";

export const textToSpeechWithTextPlainInput = async (datas) => {
  try {
    console.log(datas);
    // Fetch request to API
    const response = await fetch(
      BE_DOMAIN + "api/models/text-to-speech-and-infer/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify(datas),
      }
    );

    // Handle errors in the response
    if (!response.ok) {
      const errorDetails = await response.text(); // Get the error details
      console.error("Error:", errorDetails);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result.url);
    return result.url;
  } catch (error) {
    console.error("Failed to process the audio:", error);
    throw error;
  }
};

export const textToSpeechWithFileInput = async (formData) => {
  try {
    // Fetch request to API
    const response = await fetch(
      BE_DOMAIN + "api/models/text-file-to-speech-and-infer/",
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      }
    );

    // Handle errors in the response
    if (!response.ok) {
      const errorDetails = await response.text(); // Get the error details
      console.error("Error:", errorDetails);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result.url);
    return result.url;
  } catch (error) {
    console.error("Failed to process the audio:", error);
    throw error;
  }
};

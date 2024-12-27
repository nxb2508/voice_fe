import { BE_DOMAIN } from "../constants/variables";
import { getCookie } from "../helper/cookie";

export const changeVoiceWithSelectedModel = async ({ options }) => {
  console.log(BE_DOMAIN);

  const formData = new FormData();
  console.log("options", options);

  // Append the audio file and model_id to the form data
  formData.append("file", options.audio, "input.wav"); // Ensure "file" is the correct field name
  formData.append("model_id", options.modelId);

  console.log("formData", formData);

  try {
    // Fetch request to API
    const response = await fetch(BE_DOMAIN + "api/models/infer-audio/", {
      method: "POST",
      body: formData,
      headers: new Headers({
        Authorization: `Bearer ${getCookie("token")}`,
      }),
    });

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

import { API_DOMAIN } from "../constants/variables";

export const trainModel = async ({ options }) => {

  console.log(API_DOMAIN);

  const formData = new FormData();
  console.log("options", options);

  // Append the audio file and model_id to the form data
  formData.append("file", options.file, 'input.wav'); // Ensure "file" is the correct field name
  formData.append("name", options.name);
  formData.append("f0_method", "dio");

  console.log("formData", formData);

  try {
    // Fetch request to API
    const response = await fetch(API_DOMAIN + "train-model/", {
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

    const data = await response.json(); // Parse the JSON response

    return data;
  } catch (error) {
    console.error("Failed to process the audio:", error);
    throw error;
  }
};

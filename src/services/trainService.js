import { BE_DOMAIN } from "../constants/variables";
import { getCookie } from "../helper/cookie";

export const trainModel = async ({ options }) => {

  console.log(BE_DOMAIN);

  const formData = new FormData();
  console.log("options", options);

  // Append the audio file and model_id to the form data
  formData.append("file", options.file, 'input.wav'); // Ensure "file" is the correct field name
  formData.append("name", options.name);
  formData.append("epochs", options.epochs);
  formData.append("f0_method", "dio");

  console.log("formData", formData);

  try {
    // Fetch request to API
    const response = await fetch(BE_DOMAIN + "api/models/train", {
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

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to process the audio:", error);
    throw error;
  }
};

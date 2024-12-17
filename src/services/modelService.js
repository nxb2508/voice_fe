import { getCookie } from "../helper/cookie";
import { get } from "../utils/request";

export const getListModel = async () => {
  const response = await fetch("https://voice-be-amber.vercel.app/api/models", {
    method: "get"
  });
  const result = await response.json();
  return result
};

export const getMyModels = async () => {
  const response = await fetch("https://voice-be-amber.vercel.app/api/models/me", {
    method: "get",
    headers: new Headers({
      Authorization: `Bearer ${getCookie("token")}`,
    }),
  });
  const result = await response.json();
  return result
};
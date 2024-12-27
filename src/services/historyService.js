import { getCookie } from "../helper/cookie";
import { BE_DOMAIN } from "../constants/variables";

export const getMyHistories = async () => {
  const response = await fetch(BE_DOMAIN + "api/history/me", {
    method: "get",
    headers: new Headers({
      Authorization: `Bearer ${getCookie("token")}`,
    }),
  });
  const result = await response.json();
  return result
};

export const updateHistory = async (id, options) => {
  const response = await fetch(`${BE_DOMAIN}api/history/edit/${id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    body: JSON.stringify(options),
  });
  const result = await response.json();
  return result;
};

export const deleteHistory = async (id) => {
  const response = await fetch(`${BE_DOMAIN}api/history/delete/${id}`, {
    method: "DELETE",
    headers: new Headers({
      Authorization: `Bearer ${getCookie("token")}`,
    }),
  });
  const result = await response.json();
  return result
};

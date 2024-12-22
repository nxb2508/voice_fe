import { getCookie } from "../helper/cookie";
import { BE_DOMAIN } from "../constants/variables";


export const getListModel = async () => {
  const response = await fetch(BE_DOMAIN + "api/models", {
    method: "get"
  });
  const result = await response.json();
  return result
};

export const getMyModels = async () => {
  const response = await fetch(BE_DOMAIN + "api/models/me", {
    method: "get",
    headers: new Headers({
      Authorization: `Bearer ${getCookie("token")}`,
    }),
  });
  const result = await response.json();
  return result
};

export const getMyModelsIsTrainning = async () => {
  const response = await fetch(BE_DOMAIN + "api/models/training", {
    method: "get",
    headers: new Headers({
      Authorization: `Bearer ${getCookie("token")}`,
    }),
  });
  const result = await response.json();
  return result
};

export const deleteModel = async (idModel) => {
  const response = await fetch(`${BE_DOMAIN}api/models/delete/${idModel}`, {
    method: "DELETE",
    headers: new Headers({
      Authorization: `Bearer ${getCookie("token")}`,
    }),
  });
  const result = await response.json();
  return result
};


export const updateModel = async (idModel, options) => {
  const response = await fetch(`${BE_DOMAIN}api/models/edit/${idModel}`, {
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
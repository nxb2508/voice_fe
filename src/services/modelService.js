import { getCookie } from "../helper/cookie";

export const getListModel = async () => {
  const response = await fetch("https://be.dinhmanhhung.net/api/models", {
    method: "get"
  });
  const result = await response.json();
  return result
};

export const getMyModels = async () => {
  const response = await fetch("https://be.dinhmanhhung.net/api/models/me", {
    method: "get",
    headers: new Headers({
      Authorization: `Bearer ${getCookie("token")}`,
    }),
  });
  const result = await response.json();
  return result
};

import { get } from "../utils/request";

export const getListModel = async () => {
  const result = await get(`models`);
  return result;
};
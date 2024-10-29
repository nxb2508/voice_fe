let API_DOMAIN = localStorage.getItem("API_DOMAIN") || "http://localhost:8000/";

export const getApiDomain = () => API_DOMAIN;

export const setApiDomain = (newDomain) => {
  API_DOMAIN = newDomain;
  localStorage.setItem("API_DOMAIN", newDomain);
};

export { API_DOMAIN };
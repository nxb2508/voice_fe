let API_DOMAIN = localStorage.getItem("API_DOMAIN") || "http://14.224.131.219:8400/";

export const getApiDomain = () => API_DOMAIN;

export const setApiDomain = (newDomain) => {
  API_DOMAIN = newDomain;
  localStorage.setItem("API_DOMAIN", newDomain);
};

export { API_DOMAIN };
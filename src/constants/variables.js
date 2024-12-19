let API_DOMAIN = "https://voice.dinhmanhhung.net/";

export const getApiDomain = () => API_DOMAIN;

export const setApiDomain = (newDomain) => {
  API_DOMAIN = newDomain;
  localStorage.setItem("API_DOMAIN", newDomain);
};

export { API_DOMAIN };

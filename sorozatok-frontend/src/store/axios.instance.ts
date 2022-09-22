import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://sorozatok.herokuapp.com/";

export const $axios = axios.create({
  baseURL,
  withCredentials: true,
});

// export default $axios;

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getAllProduct = async () => {
  const { data } = await api.get("/singara-somucha");
  return data;
};

import axios from "axios";
import { ENV } from "../config/env";

const request = axios.create({
  baseURL: ENV.HOST,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const fetcher = async (
  data:
    | string
    | {
        url: string;
        params?: Record<string, unknown>;
        auth?: string | null;
        headers?: Record<string, unknown>;
        withCredentials?: boolean;
      },
) => {
  const url = typeof data === "string" ? data : data.url;
  const token = typeof data === "string" ? undefined : data.auth;
  const params = typeof data === "string" ? undefined : data.params;
  const headers = typeof data === "string" ? undefined : data.headers;
  return await request
    .get(url, {
      params,
      headers: {
        ...(token && { Authorization: token }),
        ...headers,
      },
    })
    .then((res) => res.data);
};

export { fetcher, request };

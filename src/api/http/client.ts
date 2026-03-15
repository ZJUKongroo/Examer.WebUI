import axios from "axios";
import { setupAuthInterceptor } from "~/api/http/interceptors/auth";
import { setupErrorInterceptor } from "~/api/http/interceptors/error";

const client = axios.create({
  baseURL: "/api",
});

setupAuthInterceptor(client);
setupErrorInterceptor(client);

export default client;

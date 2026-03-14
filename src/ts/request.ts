import client from "~/api/http/client";

declare module "vue" {
  interface ComponentCustomProperties {
    $axios: typeof client;
  }
}

export default client;

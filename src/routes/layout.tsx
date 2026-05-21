import { component$, Slot } from "@builder.io/qwik";
import { RequestHandler } from "@builder.io/qwik-city";

export { RouterHead as routerHead } from "~/components/router-head/router-head";

export const onRequest: RequestHandler = ({ headers }) => {
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
};

export default component$(() => {
  return (
    <>
      <Slot />
    </>
  );
});

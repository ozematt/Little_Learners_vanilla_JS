import { Router } from "./core/Router.js";
import { navLinks } from "./data/navLinks.js";

document.addEventListener("DOMContentLoaded", function () {
  const router = new Router(navLinks, document.getElementById("app")!);

  router.render();
});

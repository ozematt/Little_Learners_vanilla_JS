import { Router } from "./core/Router.js";
import { navLinks, benefits } from "./data";
import { Benefit } from "./home/Benefit";

document.addEventListener("DOMContentLoaded", async function () {
  // router
  const router = new Router(navLinks, document.getElementById("app")!);
  await router.render();

  // render benefit items
  const benefitsContainer = document.getElementById(
    "benefitsId"
  ) as HTMLElement;

  if (benefitsContainer) {
    const benefitItems = new Benefit(benefits, benefitsContainer);

    benefitItems.render();
  }
});

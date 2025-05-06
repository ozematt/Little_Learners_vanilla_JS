import { Router } from "./core/Router.js";
import { navLinks, benefitsData, testimonialsData } from "./data";
import { Benefit, Testimonials } from "./home";

document.addEventListener("DOMContentLoaded", async function () {
  // router
  const router = new Router(navLinks, document.getElementById("app")!);
  await router.render();

  // render benefit items
  const benefitsContainer = document.getElementById(
    "benefitsId"
  ) as HTMLElement;

  if (benefitsContainer) {
    const benefitItems = new Benefit(benefitsData, benefitsContainer);

    benefitItems.render();
  }

  // render testimonials
  const testimonialsContainer = document.getElementById(
    "testimonials"
  ) as HTMLElement;

  if (testimonialsContainer) {
    const testimonials = new Testimonials(
      testimonialsData,
      testimonialsContainer
    );

    testimonials.render();
  }
});

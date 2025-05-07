import { Router } from "./core/Router.js";
import { navLinks, benefitsData, testimonialsData } from "./data";
import { Benefit, Testimonials } from "./home";

document.addEventListener("DOMContentLoaded", async function () {
  const rootElement = document.getElementById("app")!;
  // const navUl = document.getElementById("nav-bar__links")!;
  const router = new Router(navLinks, rootElement);

  // Dodaj metodę do ponownej inicjalizacji komponentów
  router.onRender(() => {
    initializePageComponents();
  });

  router.render();

  // Przenieś inicjalizację komponentów do osobnej funkcji
  function initializePageComponents() {
    const currentPath = window.location.pathname;

    if (currentPath === "/") {
      initBenefits();
      initTestimonials();
    }

    // Dodaj inicjalizację dla innych ścieżek
    // if (currentPath === "/about") {
    //   initAboutPageComponents();
    // }
  }

  ////HOME PAGE - RENDERING
  function initBenefits() {
    const benefitsContainer = document.getElementById("benefitsId");
    if (benefitsContainer) {
      new Benefit(benefitsData, benefitsContainer);
    }
  }

  function initTestimonials() {
    //// ładowanie kodu gdy jest potrzebne
    // const { Testimonials } = await import("./components/Testimonials");
    const testimonialsContainer = document.getElementById("testimonials");
    const previousButton = document.getElementById("previous-comment");
    const nextButton = document.getElementById("next-comment");
    if (testimonialsContainer && previousButton && nextButton) {
      new Testimonials(
        testimonialsData,
        testimonialsContainer,
        previousButton,
        nextButton
      );
    }
  }
});

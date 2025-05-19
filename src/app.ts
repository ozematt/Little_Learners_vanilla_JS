import { Router } from "./core/Router.js";
import { navLinks, testimonialsData, faqData } from "./data";
import { Testimonials, FAQ } from "./home";

document.addEventListener("DOMContentLoaded", async function () {
  const rootElement = document.getElementById("app")!;

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
      initTestimonials();
      initFAQ();
      // initNavigation();
    }

    // Dodaj inicjalizację dla innych ścieżek
    // if (currentPath === "/about") {
    //   initAboutPageComponents();
    // }
  }

  ////HOME PAGE - RENDERING
  function initTestimonials() {
    //// ładowanie kodu gdy jest potrzebne
    // const { Testimonials } = await import("./components/Testimonials");
    const testimonialsContainer = document.getElementById(
      "testimonials-container"
    );

    if (testimonialsContainer) {
      new Testimonials(testimonialsData, testimonialsContainer);
    }
  }

  function initFAQ() {
    const faqContainer = document.getElementById("faq-container");
    if (faqContainer) {
      new FAQ(faqData, faqContainer);
    }
  }
});

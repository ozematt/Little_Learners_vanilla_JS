import { Router } from "./core/Router.js";
import { navLinks, testimonialsData, faqData, navigationData } from "./data";
import { Testimonials, FAQ, Navigation } from "./home";

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
      // initBenefits();
      initTestimonials();
      initFAQ();
      initNavigation();
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

  function initFAQ() {
    const faqContainer = document.getElementById("faq-container");
    if (faqContainer) {
      new FAQ(faqData, faqContainer);
    }
  }

  function initNavigation() {
    const navigationContainer = document.getElementById("navigation-container");
    if (navigationContainer) {
      new Navigation(
        navLinks,
        rootElement,
        navigationContainer,
        navigationData
      );
    }
  }
});

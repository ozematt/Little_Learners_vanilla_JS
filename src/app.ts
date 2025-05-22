import { Loader, Router, Nav } from "./core";
import { navLinks, testimonialsData, faqData } from "./data";
import { Testimonials, FAQ } from "./home";

document.addEventListener("DOMContentLoaded", async function () {
  const rootElement = document.getElementById("app")!;

  const router = new Router(navLinks, rootElement);
  const loader = new Loader();
  const nav = new Nav();

  loader.handleDisplayLoader();

  // Dodaj metodę do ponownej inicjalizacji komponentów
  router.onRender(() => {
    initializePageComponents();
    loader.handleHiddenLoader();
  });

  router.render();

  //HANDLE ROUTES
  function initializePageComponents() {
    const currentPath = window.location.pathname;

    if (currentPath === "/") {
      nav.handleNavLinkBG(currentPath); // nav button bg change
      initTestimonials();
      initFAQ();
    }

    if (currentPath === "/about-us") {
      nav.handleNavLinkBG(currentPath);
    }
  }

  ////HOME PAGE - RENDERING
  function initTestimonials() {
    const config = {
      data: testimonialsData,
    };
    Testimonials.create(config);
  }

  function initFAQ() {
    const faqContainer = document.getElementById("faq-container");
    if (faqContainer) {
      new FAQ(faqData, faqContainer);
    }
  }
});

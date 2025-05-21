import { Loader, Router, Nav } from "./core/index";
// import { Router } from "./core/Router.js";
import { navLinks, testimonialsData, faqData } from "./data";
import { Testimonials, FAQ } from "./home";

document.addEventListener("DOMContentLoaded", async function () {
  function handleButtonBgChange(path: string) {
    const navButtons = Array.from(
      document.querySelectorAll("[data-link-name]")
    ) as HTMLElement[];

    const currentButton = document.querySelector(
      `[data-link-name="${path}"]`
    )! as HTMLElement;

    navButtons
      .filter((item: HTMLElement) => item.innerText !== "Contact")
      .forEach((link) => {
        link.style.backgroundColor = "white";
      });

    currentButton.style.backgroundColor = "#ffefe5";
  }
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

  //
  function initializePageComponents() {
    const currentPath = window.location.pathname;

    if (currentPath === "/") {
      handleButtonBgChange(currentPath); // nav button bg change
      initTestimonials();
      initFAQ();
    }

    if (currentPath === "/about-us") {
      handleButtonBgChange(currentPath);
    }
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

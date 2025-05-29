import { Loader, Router, Nav, Component } from './core';
import { navLinks, testimonialsData, faqData } from './data';
import { Testimonials, FAQ } from './home';

document.addEventListener('DOMContentLoaded', async function () {
  const rootElement = document.getElementById('app')!;

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
  let activeComponents: Component[] = [];

  function cleanupComponents() {
    activeComponents.forEach((component) => component.destroy());
    activeComponents = [];
  }

  function initializePageComponents() {
    const currentPath = window.location.pathname;

    cleanupComponents();

    if (currentPath === '/') {
      nav.handleNavLinkBG(currentPath); // nav button bg change

      const testimonials = initTestimonials();
      const faq = initFAQ();

      activeComponents.push(testimonials, faq);
    }

    if (currentPath === '/about-us') {
      nav.handleNavLinkBG(currentPath);
    }

    if (currentPath === '/academics') {
      nav.handleNavLinkBG(currentPath);
    }
    if (currentPath === '/admissions') {
      nav.handleNavLinkBG(currentPath);
    }
    if (currentPath === '/student-life') {
      nav.handleNavLinkBG(currentPath);
    }
    if (currentPath === '/contact') {
      nav.handleNavLinkBG(currentPath);
    }
  }

  ////HOME PAGE - RENDERING
  function initTestimonials() {
    const config = {
      data: testimonialsData,
    };
    return Testimonials.create(config);
  }

  function initFAQ() {
    const config = {
      data: faqData,
    };

    return FAQ.create(config);
  }
});

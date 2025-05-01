import { navLinks } from "./data/navLinks.js";

document.addEventListener("DOMContentLoaded", function () {
  const NavLinks = {
    routes: navLinks,
    rootElement: document.getElementById("app"),

    render: async function () {
      const path = window.location.hash.slice(1) || "/";
      const template = this.routes[path].html || "/";
      const html = await this.fetch(template);
      console.log("HTML:", html);

      this.rootElement.innerHTML = html;
    },

    fetch: async function (url) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Błąd URL");
        }

        return await response.text();
      } catch (error) {
        console.error("Error fetching HTML:", error);
      }
    },
    init: function () {
      window.addEventListener("hashchange", () => {
        this.render();
      });
      this.render;
    },
  };

  NavLinks.init();
});

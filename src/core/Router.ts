import { RouteConfig } from "./types";

export class Router {
  private routes: RouteConfig;
  private rootElement: HTMLElement;

  constructor(routes: RouteConfig, rootElement: HTMLElement) {
    this.routes = routes;
    this.rootElement = rootElement;
    this.prefetchTemplates(); // prefetch templates for faster navigation
    this.handleLinkClick = this.handleLinkClick.bind(this); // bind the method to the class instance
    this.renderNavLinks(); // render navigation links on initialization
    this.setupEventListeners(); // setup event listeners for navigation
  }

  private setupEventListeners() {
    window.addEventListener("popstate", () => {
      this.render();
    });
    document.addEventListener("click", this.handleLinkClick);
  }

  private handleLinkClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.matches("[data-link]")) {
      e.preventDefault();
      const path = target.getAttribute("href");
      if (path) this.navigate(path);
    }
  }

  public async render() {
    try {
      this.rootElement.classList.add("fade-out"); // Add fade-out class
      await new Promise((resolve) => {
        setTimeout(resolve, 300);
      }); // Wait for fade-out animation
      const path = window.location.pathname;
      const route = this.routes[path] || this.routes["/404"];
      const template = route.html;

      const html = await this.fetchTemplate(template);

      this.rootElement.innerHTML = html;
      this.rootElement.classList.remove("fade-out");
    } catch (error) {
      this.rootElement.innerHTML = this.routes["/404"].html;
      console.error("Render error:", error);
    }
  }

  public renderNavLinks() {
    const container = document.getElementById("nav-bar__links");
    if (!container) return;

    const links = Object.keys(this.routes)
      .filter((path) => path !== "/404")
      .map(
        (path) => `
        <li>
          <a href="${path}" data-link>
            ${this.routes[path].text || path}
          </a>
        </li>
      `
      );

    container.innerHTML = links.join("");
  }

  public navigate(path: string) {
    window.history.pushState({}, "", path);
    this.render();
  }

  private async fetchTemplate(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      return "<h1>Network Error</h1>";
    }
  }

  private async prefetchTemplates() {
    const urls = Object.values(this.routes).map((route) => route.html);
    await Promise.all(urls.map((url) => this.fetchTemplate(url)));
  }
}

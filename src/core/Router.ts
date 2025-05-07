import { RouteConfig } from "./types";

export class Router {
  private routes: RouteConfig;
  private rootElement: HTMLElement;
  private onRenderCallbacks: (() => void)[] = [];

  constructor(routes: RouteConfig, rootElement: HTMLElement) {
    this.routes = routes;
    this.rootElement = rootElement;
    this.prefetchTemplates();
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.renderNavLinks();
    this.setupEventListeners();
  }
  public onRender(callback: () => void) {
    this.onRenderCallbacks.push(callback);
  }

  private setupEventListeners() {
    window.addEventListener("popstate", () => {
      this.render();
    });

    const navbar = document.getElementById("nav-bar__links");
    if (navbar) {
      navbar.addEventListener("click", this.handleLinkClick);
    }
  }

  private handleLinkClick(e: MouseEvent) {
    const target = e.target as HTMLElement;

    const navbar = document.getElementById("nav-bar__links");
    if (!navbar?.contains(target)) return;

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
      this.onRenderCallbacks.forEach((callback) => callback()); // Call all registered render callbacks
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
        ${this.routes[path].text || path}
          <a href="${path}"  data-link>
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

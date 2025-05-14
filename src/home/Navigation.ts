import { Router } from "../core/Router";
import { RouteConfig } from "../core/types";

export class Navigation extends Router {
  private container: HTMLElement;

  constructor(
    routes: RouteConfig,
    rootElement: HTMLElement,
    container: HTMLElement
  ) {
    super(routes, rootElement);
    this.container = container;
    this.navItemsRender();
    this.setEventListeners();
  }
  public setEventListeners() {
    if (!this.container) return;
    this.container.addEventListener("click", (e) => {
      const item = e.target as HTMLElement;
      console.log("działa");

      if (item.matches("[data-nav-link]")) {
        const href = item.getAttribute("href") as string;
        this.navigate(href);
      }
    });
  }

  public navigate(path: string) {
    super.navigate(path);
  }
  public navItemsRender(): void {
    if (!this.routes) return;
    const routesData = Object.entries(this.routes).slice(1, 5);
    const html = routesData.map((item) => this.setTemplate(item)).join("");
    this.container.innerHTML = html;
  }
  private setTemplate(item): string {
    const template = `
     <article class="navigation__item">
        <div class="navigation__item__content">
          <h4 class="navigation__item__title">${item[1].title}</h4>
          <div class="decoration__container">
            <img
              src="pages/home_assets/navigate-border.svg"
              alt="decoration element"
            />
          </div>
          <p class="navigation__item__description">
          ${item[1].description}
          </p>
        </div>

        <button class="navigation__item__btn">
          <a href="${item[0]}" class="navigation__link" data-nav-link></a>Learn More<img src="arrow.svg" alt="arrow" />
        </button>
      </article>
    `;
    return template;
  }
}

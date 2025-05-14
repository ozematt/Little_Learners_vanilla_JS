import { Router } from "../core/Router";
import { RouteConfig } from "../core/types";

type RenderItem = [
  string,
  {
    title: string;
    html: string;
    description?: string;
  }
];

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
    const routesData: RenderItem[] = Object.entries(this.routes).slice(1, 5);
    console.log(routesData);

    const html = routesData
      .map((item: RenderItem) => this.setTemplate(item))
      .join("");
    this.container.innerHTML = html;
  }
  private setTemplate([path, routeConfig]: RenderItem): string {
    const template = `
     <article class="navigation__item">
        <div class="navigation__item__content">
          <h4 class="navigation__item__title">${routeConfig.title}</h4>
          <div class="decoration__container">
            <img
              src="pages/home_assets/navigate-border.svg"
              alt="decoration element"
            />
          </div>
          <p class="navigation__item__description">
          ${routeConfig.description}
          </p>
        </div>

        <button class="navigation__item__btn">
          <a href="${path}" class="navigation__link" data-nav-link></a>Learn More<img src="arrow.svg" alt="arrow" />
        </button>
      </article>
    `;
    return template;
  }
}

import { Router } from "../core/Router";
import { RouteConfig } from "../core/types";

type NavigateDataT = {
  title: string;
  description: string;
  href: string;
};

export class Navigation extends Router {
  private container: HTMLElement;
  private navigateData: NavigateDataT[];

  constructor(
    routes: RouteConfig,
    rootElement: HTMLElement,
    container: HTMLElement,
    navigateData: NavigateDataT[]
  ) {
    super(routes, rootElement);
    this.container = container;
    this.navigateData = navigateData;
    this.setEventListeners();
    this.navItemsRender();
  }
  public setEventListeners() {
    this.container.addEventListener("click", (e) => {
      const item = e.target as HTMLElement;
      if (item.matches("[data-nav-link]")) {
        const href = item.getAttribute("href") as string;
        this.navigate(href);
      }
    });
  }
  // public render(){}
  public navigate(path: string) {
    super.navigate(path);
  }
  public navItemsRender() {
    if (!this.navigateData || this.navigateData.length === 0) return;
    const html = this.navigateData
      .map((item) => this.setTemplate(item))
      .join("");
    this.container.innerHTML = html;
  }
  private setTemplate(item: NavigateDataT): string {
    const template = `
     <article class="navigation__item">
        <div class="navigation__item__content">
          <h4 class="navigation__item__title">${item.title}</h4>
          <div class="decoration__container">
            <img
              src="pages/home_assets/navigate-border.svg"
              alt="decoration element"
            />
          </div>
          <p class="navigation__item__description">
          ${item.description}
          </p>
        </div>

        <button class="navigation__item__btn">
          <a href="${item.href}" data-nav-link>Learn More </a><img src="arrow.svg" alt="arrow" />
        </button>
      </article>
    `;
    return template;
  }
}

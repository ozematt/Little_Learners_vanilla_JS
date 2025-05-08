export class FAQ {
  //   private questions: string[];
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    // this.questions = questions;
    this.container = container;
    this.setupEventListeners();
    // this.render();
  }

  private setTemplate(item: string): string {
    const template = `
      
        `;
    return template;
  }

  //   public render(): void {
  //     if (!this.questions || this.questions.length === 0) return;
  //     const html = this.questions.map((item) => this.setTemplate(item)).join("");
  //     this.container.innerHTML = html;
  //   }
  private setupEventListeners() {
    this.container.addEventListener("click", (e) => {
      const target = (e.target as HTMLElement).closest(
        "details"
      ) as HTMLDetailsElement;
      if (!target) return;

      const icon = target.querySelector(".faq__icon img") as HTMLImageElement;

      if (!target.hasAttribute("open")) {
        target.style.backgroundColor = "white";
        icon.src = "pages/home_assets/minus-icon.svg";
      } else {
        target.style.backgroundColor = "var(--color-secondary-accent)";
        icon.src = "pages/home_assets/plus-icon.svg";
      }
    });
  }
}

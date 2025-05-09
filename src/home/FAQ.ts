type FAQdata = {
  question: string;
  answer: string;
};

export class FAQ {
  private questions: FAQdata[];
  private container: HTMLElement;

  constructor(questions: FAQdata[], container: HTMLElement) {
    this.questions = questions;
    this.container = container;
    this.setupEventListeners();
    this.render();
  }

  private setTemplate(item: FAQdata): string {
    const template = `
       <details class="faq__item">
          <summary class="faq__item__question">
            <span class="faq__item__question__q">${item.question}</span>
            <span class="faq__icon">
              <img src="pages/home_assets/plus-icon.svg" alt="plus icon"/>
            </span>
          </summary>
          <p class="faq__item__answer">${item.answer}</p>
        </details>
        `;
    return template;
  }

  public render(): void {
    if (!this.questions || this.questions.length === 0) return;
    const html = this.questions.map((item) => this.setTemplate(item)).join("");
    this.container.innerHTML = html;
  }
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

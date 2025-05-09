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
    const firstColumn = this.questions.slice(0, 3);
    const secondColumn = this.questions.slice(3, 6);

    const firstColumnHtml = firstColumn
      .map((item) => this.setTemplate(item))
      .join("");

    const secondColumnHtml = secondColumn
      .map((item) => this.setTemplate(item))
      .join("");

    this.container.innerHTML = `
      <div class="faq__column">
        ${firstColumnHtml}
      </div>
      <div class="faq__column">
        ${secondColumnHtml}
      </div>
    `;
  }
  private setupEventListeners() {
    this.container.addEventListener("click", (e) => {
      const target = (e.target as HTMLElement).closest(
        "summary"
      ) as HTMLDetailsElement;
      if (!target) return;

      const details = target.parentNode as HTMLDetailsElement;
      const icon = details.querySelector(".faq__icon img") as HTMLImageElement;
      if (!details.hasAttribute("open")) {
        details.classList.add("faq__item--open");
        details.classList.remove("faq__item--closed");
        icon.src = "pages/home_assets/minus-icon.svg";
      } else {
        details.classList.add("faq__item--closed");
        details.classList.remove("faq__item--open");
        icon.src = "pages/home_assets/plus-icon.svg";
      }
    });
  }
}

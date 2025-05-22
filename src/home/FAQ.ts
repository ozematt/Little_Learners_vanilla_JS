import { BaseComponent } from "../core";

interface FAQConfig {
  data: FAQdata[];
}

type FAQdata = {
  question: string;
  answer: string;
};

export class FAQ extends BaseComponent {
  private readonly questions: FAQdata[];
  private container: HTMLElement;

  public static create(config: FAQConfig): FAQ {
    if (!config.data) {
      throw new Error("Data not found");
    }
    const instance = new FAQ(config);
    return instance;
  }

  private constructor(config: FAQConfig) {
    super();
    this.listeners;
    this.questions = config.data;

    this.initializeElements();
    this.addEventListeners();
  }

  protected cleanup(): void {
    if (this.container) {
      this.container.innerHTML = "";
    }

    Object.keys(this).forEach((key) => {
      (this as any)[key] = null;
    });
    console.log("FAQ cleanup!");
  }

  private initializeElements() {
    const container = document.getElementById("faq-container");
    if (!container) {
      throw new Error("Container element not found");
    }
    this.container = container as HTMLElement;

    this.render();
  }

  private setTemplate(item: FAQdata): string {
    const template = `
       <details class="faq__item">
          <summary class="faq__item__question">
            <span class="faq__item__question__q">${item.question}</span>
            <div class="question-underline"></div> 
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
    const firstColumn = this.questions.slice(0, 4);
    const secondColumn = this.questions.slice(4, 8);

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

  private addEventListeners() {
    super.addListeners(this.container, "click", this.handleQuestionDisplay);
  }

  private handleQuestionDisplay = (e: Event) => {
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
  };
}

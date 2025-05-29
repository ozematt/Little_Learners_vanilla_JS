import { BaseComponent } from "../core";

interface TestimonialsConfig {
  data: TestimonialsData[];
}

type TestimonialsData = {
  avatar: string;
  name: string;
  rating: number;
  comment: string;
};

export class Testimonials extends BaseComponent {
  // Data
  private readonly testimonialsData: TestimonialsData[];

  // DOM elements
  private container: HTMLElement | null;
  private slider: HTMLElement | null;
  private commentCards: HTMLCollectionOf<Element> | null;
  private previousButton: HTMLElement | null;
  private nextButton: HTMLElement | null;
  private previousButtonMobile: HTMLElement | null;
  private nextButtonMobile: HTMLElement | null;

  // consts
  private commentsGap: number = 50;

  // State
  private maxComment: boolean = false;
  private _currentIndex: number = 0;
  private _commentCardWidth: number = 0;

  public static create(config: TestimonialsConfig): Testimonials {
    if (!config.data) {
      throw new Error("Data not found");
    }

    const instance = new Testimonials(config);
    return instance;
  }

  private constructor(config: TestimonialsConfig) {
    super();
    this.listeners;
    this.testimonialsData = config.data;

    this.initializeElements();
    this.addEventListeners();
    this.handleResize();
    this.lastCommentDisplay();
  }

  get currentIndex(): number {
    return this._currentIndex;
  }
  set currentIndex(value: number) {
    if (value < 0) return;
    this._currentIndex = value;
    this.updateSliderPosition(); //
  }

  get commentCardWidth(): number {
    return this._commentCardWidth;
  }

  set commentCardWidth(value: number) {
    if (value < 0) return;
    this._commentCardWidth = value;
  }

  protected cleanup(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = undefined;
    }

    if (this.container) {
      this.container.innerHTML = "";
    }

    this.container = null;
    this.slider = null;
    this.previousButton = null;
    this.nextButton = null;
    this.previousButtonMobile = null;
    this.nextButtonMobile = null;
    this.commentCards = null;

    this._currentIndex = 0;
    this._commentCardWidth = 0;
    this.maxComment = false;

    console.log("Testimonials cleanup!");
  }

  private initializeElements(): void {
    // Najpierw inicjalizujemy główny kontener
    const container = document.getElementById("testimonials-container");
    if (!container) {
      throw new Error("Container element not found");
    }
    this.container = container as HTMLElement;

    // Renderujemy zawartość kontenera
    this.render();

    // Inicjalizujemy przyciski po renderowaniu
    const elements = {
      previousButton: document.getElementById("previous-comment"),
      nextButton: document.getElementById("next-comment"),
      previousButtonMobile: document.getElementById("previous-comment-mobile"),
      nextButtonMobile: document.getElementById("next-comment-mobile"),
    };

    const missingElements = Object.entries(elements)
      .filter(([_, element]) => !element)
      .map(([name]) => name);

    if (missingElements.length > 0) {
      throw new Error(`Missing button elements: ${missingElements.join(", ")}`);
    }

    // Przypisujemy przyciski
    this.previousButton = elements.previousButton as HTMLElement;
    this.nextButton = elements.nextButton as HTMLElement;
    this.previousButtonMobile = elements.previousButtonMobile as HTMLElement;
    this.nextButtonMobile = elements.nextButtonMobile as HTMLElement;

    // Inicjalizujemy slider po renderowaniu
    const slider = document.getElementById("testimonials-slider-id");
    if (!slider) {
      throw new Error("Slider element not found");
    }
    this.slider = slider as HTMLElement;

    const commentCards = document.getElementsByClassName(
      "testimonials-container__card"
    );
    if (!commentCards) {
      throw new Error("Comment card not found");
    }
    this.commentCards = commentCards as HTMLCollectionOf<Element>;
  }

  private setTemplate(item: TestimonialsData): string {
    const template = `
        <article class="testimonials-container__card">
          <div class="avatar-container">
            <img src="${item.avatar}" alt="avatar icon" />
          </div>
          <p class="card-user-name">${item.name}</p>
          <div id="rating-container" class="rating__container">
            <div class="rating-container__fill" style="width: ${item.rating * 28}px">
              <img src="pages/home_assets/rating-full-stars.svg" alt="rating stars"/>
            </div>
            <img src="pages/home_assets/rating-empty-stars.svg" alt="rating stars"/>
          </div>
          <p class="card-comment">
            ${item.comment}
          </p>
        </article>`;
    return template;
  }
  private render(): void {
    if (
      (!this.testimonialsData || this.testimonialsData.length === 0,
      !this.container)
    ) {
      throw new Error("Testimonials not found");
    }

    const carouselContainer = `
      <div id="testimonials-slider-id" class="testimonials-container__slider" >
        ${this.testimonialsData.map((item) => this.setTemplate(item)).join("")}
      </div>
      `;
    this.container.innerHTML = carouselContainer;
  }

  private addEventListeners(): void {
    if (
      !this.previousButton ||
      !this.previousButtonMobile ||
      !this.nextButton ||
      !this.nextButtonMobile
    )
      return;

    super.addListeners(this.previousButton, "click", this.handlePreviousButton);
    super.addListeners(
      this.previousButtonMobile,
      "click",
      this.handlePreviousButton
    );
    super.addListeners(this.nextButton, "click", this.handleNextButton);
    super.addListeners(this.nextButtonMobile, "click", this.handleNextButton);
  }

  private handlePreviousButton = (): void => {
    if (this.currentIndex === 0) return;
    this.currentIndex -= 1;
  };

  private handleNextButton = (): void => {
    if (this.maxComment) {
      this.currentIndex = 0;
      return;
    }
    this.currentIndex += 1;
  };

  private updateSliderPosition(): void {
    if (!this.slider) return;
    this.slider.style.transform = `translateX(-${this.currentIndex * (this.commentCardWidth + this.commentsGap)}px)`;
  }

  private lastCommentDisplay() {
    if (!this.commentCards) return;
    const lastItem = this.commentCards[
      this.commentCards.length - 1
    ] as HTMLElement;

    this.intersectedLastElement(lastItem, (isIntersecting) => {
      this.maxComment = isIntersecting;
    });
  }

  private handleResize() {
    if (!this.commentCards) return;
    const item = this.commentCards[0] as HTMLElement;

    this.observeElementWidth(item, (width) => {
      this.commentCardWidth = width;
    });
  }
}

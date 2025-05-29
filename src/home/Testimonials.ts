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

type MediaQuery = {
  laptop: MediaQueryList;
  mobile: MediaQueryList;
};

export class Testimonials extends BaseComponent {
  // Data
  private readonly testimonialsData: TestimonialsData[];

  //Magic numbers
  private readonly SLIDE_WIDTHS = {
    mobile: 400,
    laptop: 380,
    desktop: 470,
  };
  private readonly BREAKPOINT = {
    mobile: 1020,
    laptop: 1700,
  };

  // DOM elements
  private container: HTMLElement;
  private slider: HTMLElement;
  private previousButton: HTMLElement;
  private nextButton: HTMLElement;
  private previousButtonMobile: HTMLElement;
  private nextButtonMobile: HTMLElement;

  // State
  private _currentIndex: number = 0;

  public static create(config: TestimonialsConfig): Testimonials {
    if (!config.data) {
      throw new Error("Data not found");
    }

    // Mozliwa dodatkowa inicjalizacja

    const instance = new Testimonials(config);
    return instance;
  }

  private constructor(config: TestimonialsConfig) {
    super();
    this.listeners;
    this.testimonialsData = config.data;

    this.initializeElements();
    this.addEventListeners();
  }

  get currentIndex(): number {
    return this._currentIndex;
  }
  set currentIndex(value: number) {
    if (value < 0) return;
    this._currentIndex = value;
    this.updateSliderPosition(); //
  }

  protected cleanup(): void {
    if (this.container) {
      this.container.innerHTML = "";
    }

    Object.keys(this).forEach((key) => {
      (this as any)[key] = null;
    });

    this._currentIndex = 0;
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
    if (!this.testimonialsData || this.testimonialsData.length === 0) {
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
    const commentNumber = this.updateCommentsDisplay() as number;
    const maxIndex = this.testimonialsData.length - commentNumber;

    if (this.currentIndex >= maxIndex) {
      this.currentIndex = 0;
    } else {
      this.currentIndex += 1;
    }
  };

  private updateSliderPosition(): void {
    if (!this.slider) return;
    const { laptop, mobile } = this.mediaBreakpoints();

    let slideWidth = this.SLIDE_WIDTHS.desktop;

    if (mobile.matches) {
      slideWidth = this.SLIDE_WIDTHS.mobile;
    } else if (laptop.matches) {
      slideWidth = this.SLIDE_WIDTHS.laptop;
    }

    this.slider.style.transform = `translateX(-${this._currentIndex * slideWidth}px)`;
  }

  private updateCommentsDisplay(): number {
    const { laptop, mobile } = this.mediaBreakpoints();

    if (mobile.matches) {
      return 1;
    }
    if (laptop.matches) {
      return 2;
    }

    return 3;
  }

  private mediaBreakpoints(): MediaQuery {
    const laptop = window.matchMedia(
      `(max-width: ${this.BREAKPOINT.laptop}px)`
    );
    const mobile = window.matchMedia(
      `(max-width: ${this.BREAKPOINT.mobile}px)`
    );

    return {
      laptop,
      mobile,
    };
  }
}

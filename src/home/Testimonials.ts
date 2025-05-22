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

type Buttons = {
  previous: HTMLElement;
  next: HTMLElement;
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
        <article class="testimonials__container__card" 
          >
          <div class="avatar__container"><img src="${
            item.avatar
          }" alt="avatar icon" /></div>

          <p class="testimonials__user-name">${item.name}</p>

          <div id="rating__container" class="rating__container">
          <div class="rating__container__full" style="width: ${
            item.rating * 28
          }px">
           <img
              src="pages/home_assets/rating-full-stars.svg"
              alt="rating stars"
            />
          </div>
           
            <img
              src="pages/home_assets/rating-empty-stars.svg"
              alt="rating stars"
            />
          </div>
          
          <p class="testimonials__comment">
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
      <div id="testimonials-slider-id" class="testimonials__container__slider" >
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
    if (this._currentIndex === 0) return;

    this._currentIndex -= 1;
    this.updateSliderPosition();
  };

  private handleNextButton = (): void => {
    const commentNumber = this.updateCommentsDisplay() as number;

    if (this._currentIndex === this.testimonialsData.length - commentNumber) {
      this._currentIndex = 0;
    } else {
      this._currentIndex += 1;
    }
    this.updateSliderPosition();
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

    this.slider.style.transform = `translateX(-${
      this._currentIndex * slideWidth
    }px)`;
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

    return { laptop, mobile };
  }
}

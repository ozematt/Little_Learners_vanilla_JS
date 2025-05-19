type TestimonialT = {
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

export class Testimonials {
  private testimonials: TestimonialT[];
  private container: HTMLElement;

  // comments nav buttons
  private previousButton: HTMLElement;
  private nextButton: HTMLElement;
  private previousButtonMobile: HTMLElement;
  private nextButtonMobile: HTMLElement;
  private currentIndex: number = 0;

  // Breakpoints
  private laptopBreakpoint: number = 1700;
  private mobileBreakpoint: number = 1020;

  constructor(testimonials: TestimonialT[], container: HTMLElement) {
    this.testimonials = testimonials;
    this.container = container;
    this.previousButton = document.getElementById(
      "previous-comment"
    ) as HTMLElement;
    this.nextButton = document.getElementById("next-comment") as HTMLElement;
    this.previousButtonMobile = document.getElementById(
      "previous-comment-mobile"
    ) as HTMLElement;
    this.nextButtonMobile = document.getElementById(
      "next-comment-mobile"
    ) as HTMLElement;
    this.laptopBreakpoint;
    this.mobileBreakpoint;
    this.render();
    this.setupEventListeners();
  }

  private setTemplate(item: TestimonialT): string {
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
  public render(): void {
    const { testimonials, container } = this;

    if (!testimonials || testimonials.length === 0) return;

    const carouselContainer = `
      <div id="testimonials-slider-id" class="testimonials__container__slider" >
        ${testimonials.map((item) => this.setTemplate(item)).join("")}
      </div>
      `;
    container.innerHTML = carouselContainer;
  }

  private setupEventListeners(): void {
    const { previous, next } = this.updateButtons() as Buttons;
    const commentNumber = this.updateCommentsDisplay() as number;

    previous.addEventListener("click", () => {
      if (this.currentIndex === 0) return;

      this.currentIndex -= 1;
      this.updateSliderPosition();
    });

    next.addEventListener("click", () => {
      if (this.currentIndex === this.testimonials.length - commentNumber) {
        this.currentIndex = 0;
      } else {
        this.currentIndex += 1;
      }
      this.updateSliderPosition();
    });
  }
  private updateSliderPosition(): void {
    const slider = document.getElementById("testimonials-slider-id");
    if (!slider) return;

    const { laptop, mobile } = this.mediaBreakpoints();

    if (mobile.matches) {
      slider.style.transform = `translateX(-${this.currentIndex * 400}px)`;
      return;
    }
    if (laptop.matches) {
      slider.style.transform = `translateX(-${this.currentIndex * 380}px)`;
      return;
    }
    slider.style.transform = `translateX(-${this.currentIndex * 470}px)`;
  }
  private updateButtons(): void | Buttons {
    const {
      previousButton,
      nextButton,
      previousButtonMobile,
      nextButtonMobile,
    } = this;

    if (
      !previousButton ||
      !nextButton ||
      !previousButtonMobile ||
      !nextButtonMobile
    ) {
      console.error("Buttons not found");
      return;
    }

    const { mobile } = this.mediaBreakpoints();

    const previous = mobile.matches ? previousButtonMobile : previousButton;
    const next = mobile.matches ? nextButtonMobile : nextButton;

    return { previous, next };
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
    const laptop = window.matchMedia(`(max-width: ${this.laptopBreakpoint}px)`);
    const mobile = window.matchMedia(`(max-width: ${this.mobileBreakpoint}px)`);

    return { laptop, mobile };
  }
}

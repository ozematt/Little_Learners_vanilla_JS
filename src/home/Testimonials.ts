type TestimonialT = {
  avatar: string;
  name: string;
  rating: number;
  comment: string;
};

export class Testimonials {
  private testimonials: TestimonialT[];
  private container: HTMLElement;
  private previousButton: HTMLElement;
  private nextButton: HTMLElement;
  private currentIndex: number = 0;

  constructor(
    testimonials: TestimonialT[],
    container: HTMLElement,
    previousButton: HTMLElement,
    nextButton: HTMLElement
  ) {
    this.testimonials = testimonials;
    this.container = container;
    this.previousButton = previousButton;
    this.nextButton = nextButton;
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
    if (!this.testimonials || this.testimonials.length === 0) return;

    const carouselContainer = `
      <div id="testimonials-slider-id" class="testimonials__container__slider" >
        ${this.testimonials.map((item) => this.setTemplate(item)).join("")}
      </div>
`;

    this.container.innerHTML = carouselContainer;
  }
  private setupEventListeners() {
    this.previousButton.addEventListener("click", () => {
      if (this.currentIndex === 0) return;
      this.currentIndex -= 1;
      this.updateSliderPosition();
    });

    this.nextButton.addEventListener("click", () => {
      if (this.currentIndex === this.testimonials.length - 3) {
        this.currentIndex = 0;
      } else {
        this.currentIndex += 1;
      }
      this.updateSliderPosition();
    });
  }
  private updateSliderPosition() {
    const slider = document.getElementById("testimonials-slider-id");
    if (!slider) return;
    slider.style.transform = `translateX(-${this.currentIndex * 470}px)`;
  }
}

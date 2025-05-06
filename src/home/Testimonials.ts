type TestimonialT = {
  avatar: string;
  name: string;
  rating: number;
  comment: string;
};

export class Testimonials {
  private testimonials: TestimonialT[];
  private container: HTMLElement;

  constructor(testimonials: TestimonialT[], container: HTMLElement) {
    this.testimonials = testimonials;
    this.container = container;
  }

  private setTemplate(item: TestimonialT): string {
    const template = `
        <article class="testimonials__container__card">
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
    const html = this.testimonials
      .map((item) => this.setTemplate(item))
      .join("");
    this.container.innerHTML = html;
  }
}

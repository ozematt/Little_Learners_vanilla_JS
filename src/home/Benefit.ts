type BenefitT = {
  icon: string;
  title: string;
  description: string;
};

export class Benefit {
  private benefits: BenefitT[];
  private container: HTMLElement;

  constructor(benefits: BenefitT[], container: HTMLElement) {
    this.benefits = benefits;
    this.container = container;
  }
  private setTemplate(item: BenefitT): string {
    const template = `
      <article class="benefit">
        <div class="benefit__icon-container"><img src="${item.icon}" alt="icon"></div>
        <h3 class="benefit__title">${item.title}</h3>
        <p class="benefit__description">${item.description}</p>
      </article>
    `;
    return template;
  }
  public render(): void {
    if (!this.benefits || this.benefits.length === 0) return;
    const html = this.benefits.map((item) => this.setTemplate(item)).join("");
    this.container.innerHTML = html;
  }
}

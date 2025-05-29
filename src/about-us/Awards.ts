import { BaseComponent } from "../core";

export class Awards extends BaseComponent {
  // private resizeObserver?: ResizeObserver;
  // private intersectionObserver?: IntersectionObserver;

  // Elements
  private previousButton: HTMLElement | null;
  private nextButton: HTMLElement | null;
  private slider: HTMLElement | null;
  private awards: HTMLCollectionOf<Element> | null;
  private awardItem: HTMLElement | null;

  // consts
  private awardsGap: number = 40;

  // State
  private maxAwards: boolean = false;
  private _currentIndex: number = 0;
  private _awardItemWidth: number = 0;

  public static create(): Awards {
    // if(!config)
    const instance = new Awards();
    return instance;
  }

  private constructor() {
    super();
    this.listeners;
    this.resizeObserver;

    this.initializeElements();
    this.addEventListeners();
    this.lastAwardDisplay();
    this.handleResize();
  }

  get currentIndex(): number {
    return this._currentIndex;
  }
  set currentIndex(value: number) {
    if (value < 0) return;
    this._currentIndex = value;
    this.updateSliderPosition();
  }

  get awardItemWidth(): number {
    return this._awardItemWidth;
  }

  set awardItemWidth(value: number) {
    if (value < 0) return;
    this._awardItemWidth = value;
  }

  protected cleanup(): void {
    // Cleanup ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
    // Cleanup IntersectionObserver
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = undefined;
    }
    // Cleaning up DOM element references
    this.previousButton = null;
    this.nextButton = null;
    this.slider = null;
    this.awards = null;
    this.awardItem = null;

    // Reset state
    this._currentIndex = 0;
    this._awardItemWidth = 0;
    this.maxAwards = false;

    console.log("Awards cleanup!");
  }

  private initializeElements(): void {
    const elements = {
      previousButton: document.getElementById("previous-award"),
      nextButton: document.getElementById("next-award"),
      slider: document.getElementById("awards-slider"),
      awards: document.getElementsByClassName("awards-slider__item"),
      awardItem: document.getElementById("awards-item"),
    };
    const missingElements = Object.entries(elements)
      .filter(([_, element]) => !element)
      .map(([name]) => name);

    if (missingElements.length > 0) {
      throw new Error(`Missing elements: ${missingElements.join(", ")}`);
    }

    this.previousButton = elements.previousButton as HTMLElement;
    this.nextButton = elements.nextButton as HTMLElement;
    this.slider = elements.slider as HTMLElement;
    this.awards = elements.awards as HTMLCollectionOf<Element>;
    this.awardItem = elements.awardItem as HTMLElement;
  }

  private addEventListeners(): void {
    if (!this.nextButton || !this.previousButton) return;
    super.addListeners(this.nextButton, "click", this.handleNextButton);
    super.addListeners(this.previousButton, "click", this.handlePreviousButton);
  }

  private handleNextButton = (): void => {
    if (this.maxAwards) return;
    this.currentIndex += 1;
  };
  private handlePreviousButton = (): void => {
    if (this.currentIndex === 0) return;
    this.currentIndex -= 1;
  };
  private updateSliderPosition() {
    if (!this.slider) return;
    this.slider.style.transform = `translateX(-${this.currentIndex * (this.awardItemWidth + this.awardsGap)}px)`;
  }

  private lastAwardDisplay() {
    if (!this.awards) return;
    const lastItem = this.awards[this.awards.length - 1];
    if (!lastItem) return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.maxAwards = entry.isIntersecting;
        });
      },
      { root: null, threshold: 0.5, rootMargin: "0px" }
    );
    this.intersectionObserver.observe(lastItem as Element);
  }

  private handleResize() {
    if (!this.awardItem) return;
    this.observeElementWidth(this.awardItem, (width) => {
      this.awardItemWidth = width;
    });
  }
}

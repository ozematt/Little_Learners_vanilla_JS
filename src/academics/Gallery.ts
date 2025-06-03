import { BaseComponent } from "../core";

type Image = {
  author: string;
  src_big: string;
  src_small: string;
  alt: string;
};

interface SliderConfig {
  id: string;
  imageContainer: string;
  prevButton: string;
  nextButton: string;
  currentIndex: number;
}

export class Gallery extends BaseComponent {
  //consts
  private accentColor: string = "#ffefe5";

  // gallery display
  private galleryBtnsContainer: HTMLElement | null;
  private galleryBtns: NodeListOf<Element> | null;
  private galleries: NodeListOf<Element> | null;

  //gallery images load
  private galleryContainers: NodeListOf<Element> | null;
  private imageCard: HTMLElement | null;

  //state
  private imageCardWidth: number = 0;

  //consts
  private imageCardsGap: number = 40;

  //galleries config
  private sliderConfig: SliderConfig[] = [
    {
      id: "classroom",
      imageContainer: '[data-gallery-container="classroom"]',
      prevButton: '[data-gallery-nav="classroom-prev"]',
      nextButton: '[data-gallery-nav="classroom-next"]',
      currentIndex: 0,
    },
    {
      id: "library",
      imageContainer: '[data-gallery-container="library"]',
      prevButton: '[data-gallery-nav="library-prev"]',
      nextButton: '[data-gallery-nav="library-next"]',
      currentIndex: 0,
    },
    {
      id: "science-lab",
      imageContainer: '[data-gallery-container="science-lab"]',
      prevButton: '[data-gallery-nav="science-lab-prev"]',
      nextButton: '[data-gallery-nav="science-lab-next"]',
      currentIndex: 0,
    },
    {
      id: "computer-lab",
      imageContainer: '[data-gallery-container="computer-lab"]',
      prevButton: '[data-gallery-nav="computer-lab-prev"]',
      nextButton: '[data-gallery-nav="computer-lab-next"]',
      currentIndex: 0,
    },
    {
      id: "nature-area",
      imageContainer: '[data-gallery-container="nature-area"]',
      prevButton: '[data-gallery-nav="nature-area-prev"]',
      nextButton: '[data-gallery-nav="nature-area-next"]',
      currentIndex: 0,
    },
  ];

  public static create(): Gallery {
    const instance = new Gallery();
    return instance;
  }

  private constructor() {
    super();

    this.initializeElements();
    this.initializeGalleries();
    this.addEventListeners();
    // this.handleResize();
  }

  protected cleanup() {
    // this.galleryBtnsContainer = null;
    // this.galleries = null;
    // this.galleryBtns = null;

    console.log("Gallery cleanup!");
  }

  private async initializeElements() {
    const elements = {
      // gallery display
      galleryBtnsContainer: document.getElementById("gallery-buttons-container"),
      galleries: document.querySelectorAll(".gallery"),
      galleryBtns: document.querySelectorAll(".gallery-btn"),

      //gallery images
      galleryContainers: document.querySelectorAll("[data-gallery-container]"),
    };
    const missingElements = Object.entries(elements)
      .filter(([_, element]) => !element)
      .map(([name]) => name);

    if (missingElements.length > 0) {
      throw new Error(`Missing elements: ${missingElements.join(", ")}`);
    }

    this.galleryBtnsContainer = elements.galleryBtnsContainer as HTMLElement;
    this.galleries = elements.galleries as NodeListOf<Element>;
    this.galleryBtns = elements.galleryBtns as NodeListOf<Element>;
    this.galleryContainers = elements.galleryContainers as NodeListOf<Element>;

    await this.uploadImages(); //galleries image upload => image card

    const imageCard = document.querySelector(".image-container");
    if (!imageCard) {
      throw new Error("Image card not found");
    }
    this.imageCard = imageCard as HTMLElement;

    this.handleResize(); // handle resize image card
  }

  private addEventListeners(): void {
    if (!this.galleryBtnsContainer) return;

    super.addListeners(this.galleryBtnsContainer, "click", this.handleGalleryButton as EventListener);
  }

  private initializeGalleries(): void {
    this.sliderConfig.forEach((gallery) => {
      const container = document.querySelector(gallery.imageContainer) as HTMLElement;
      const prevButton = document.querySelector(gallery.prevButton) as HTMLElement;
      const nextButton = document.querySelector(gallery.nextButton) as HTMLElement;

      if (!container || !prevButton || !nextButton) {
        console.warn(`Brakujące elementy dla galerii ${gallery.id}`);
        return;
      }

      super.addListeners(prevButton, "click", () => this.handlePrevSlide(gallery));
      super.addListeners(nextButton, "click", () => this.handleNextSlide(gallery));
    });
  }

  private handlePrevSlide(gallery: SliderConfig): void {
    if (gallery.currentIndex === 0) return;
    gallery.currentIndex -= 1;
    this.updateGalleryPosition(gallery);
  }
  private handleNextSlide(gallery: SliderConfig) {
    console.log(gallery);

    const maxIndex = 4;
    if (gallery.currentIndex >= maxIndex) {
      gallery.currentIndex = 0;
    } else {
      gallery.currentIndex += 1;
    }
    this.updateGalleryPosition(gallery);
  }

  private updateGalleryPosition(gallery: SliderConfig) {
    const container = document.querySelector(gallery.imageContainer) as HTMLElement;
    if (!container) return;

    const imageCardWidth = Math.floor(this.imageCardWidth);
    const offset = gallery.currentIndex * (imageCardWidth + this.imageCardsGap);

    container.style.transform = `translateX(-${offset}px)`;
  }

  private handleGalleryDisplay(galleryButtonName: string) {
    if (!this.galleries) return;

    this.galleries.forEach((gallery) => {
      if (galleryButtonName === "all") {
        gallery.classList.remove("hidden");
        return;
      }

      const selectedGallery = galleryButtonName + "-gallery";
      const galleryId = gallery.getAttribute("id");

      if (selectedGallery !== galleryId) {
        gallery.classList.add("hidden");
      } else {
        gallery.classList.remove("hidden");
      }
    });
  }

  private changeButton(button: HTMLElement) {
    if (!this.galleryBtns) return;

    this.galleryBtns.forEach((btn) => {
      (btn as HTMLElement).style.backgroundColor = "white";
    });

    if (button) {
      button.style.background = this.accentColor;
      const galleryName = button.getAttribute("id") as string;
      this.handleGalleryDisplay(galleryName);
    }
  }

  private handleGalleryButton = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const galleryBtn = target.closest(".gallery-btn") as HTMLElement;
    if (!galleryBtn) return;

    this.changeButton(galleryBtn);
  };

  private loadImages(container: HTMLElement, images: Image[]) {
    const html = images
      .map((image: any) => {
        return this.createImageCard(image);
      })
      .join("");

    container.innerHTML = html;
  }

  private async uploadImages() {
    if (!this.galleryContainers) return;

    for (const container of this.galleryContainers) {
      const galleryType = container.getAttribute("data-gallery-container") as string;
      if (!galleryType) continue;

      try {
        const images = await this.fetchImages(galleryType);
        this.loadImages(container as HTMLElement, images);
      } catch (error) {
        console.error("Gallery load error:", error);
      }
    }
  }

  private createImageCard(image: Image) {
    return `
    <div class="image-container">
      <img src=${image.src_big} alt=${image.alt}/>
    </div>
    `;
  }

  private async fetchImages(query: string) {
    const url = `https://api.pexels.com/v1/search?query=${query}&orientation=square&size=small&page=1&per_page=5`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: import.meta.env.VITE_PEXELS_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error("Błąd pobierania");
      }
      const data = await response.json();

      const newData = data.photos.map((photo: any) => ({
        author: photo.photographer,
        src_big: photo.src.portrait,
        src_small: photo.src.small,
        alt: photo.alt,
      }));

      return newData;
    } catch (error) {
      console.error(error.message);
    }
  }
  private handleResize() {
    if (!this.imageCard) return;
    this.observeElementWidth(this.imageCard, (width) => {
      this.imageCardWidth = width;
    });
  }
}

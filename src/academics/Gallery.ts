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
  private readonly ACCENT_COLOR: string = "#ffefe5";
  private readonly IMAGE_CARD_GAP: number = 40;
  private readonly MAX_IMAGE_INDEX: number = 4;

  // gallery display
  private galleryBtnsContainer: HTMLElement | null;
  private galleryBtns: NodeListOf<Element> | null;
  private galleries: NodeListOf<Element> | null;

  //gallery images load
  private galleryContainers: NodeListOf<Element> | null;
  private imageCards: NodeListOf<Element> | null;

  private popup: HTMLElement | null;
  private popupImageContainer: HTMLElement | null;

  //state
  private imageCardWidth: number = 0;
  private maxImage: boolean = false;

  //galleries config
  private sliderConfig: SliderConfig[] | null = [
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
  }

  protected cleanup() {
    this.galleryBtnsContainer = null;
    this.galleryBtns = null;
    this.galleries = null;
    this.galleryContainers = null;
    this.imageCards = null;

    this.popup = null;
    this.popupImageContainer = null;

    this.imageCardWidth = 0;
    this.sliderConfig = null;

    console.log("Gallery cleanup!");
  }

  private async initializeElements() {
    const elements = {
      galleryBtnsContainer: document.getElementById("gallery-buttons-container"),
      galleries: document.querySelectorAll(".gallery"),
      galleryBtns: document.querySelectorAll(".gallery-btn"),
      popup: document.querySelector(".popup"),
      popupImageContainer: document.querySelector("#popup-container"),
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
    this.popup = elements.popup as HTMLElement;
    this.popupImageContainer = elements.popupImageContainer as HTMLElement;

    await this.uploadImages(); //galleries image upload => image card

    const imageCards = document.querySelectorAll(".image-container");
    if (!imageCards) {
      throw new Error("Image cards not found");
    }
    this.imageCards = imageCards as NodeListOf<Element>;

    this.handleResize(); // handle resize image card
    // this.handlePopupDisplay();
  }

  private addEventListeners(): void {
    if (!this.galleryBtnsContainer || !this.popup) return;

    super.addListeners(this.galleryBtnsContainer, "click", this.handleGalleryButton as EventListener);
    super.addListeners(this.galleryBtnsContainer, "click", this.handleGalleryButton as EventListener);
    super.addListeners(this.popup, "click", this.handlePopupClose as EventListener);
    super.addListeners(document.body, "click", this.handlePopupDisplay as EventListener);
    super.addListeners(document.body, "click", this.handleCurrentGallery as EventListener);
  }

  private initializeGalleries(): void {
    if (!this.sliderConfig) return;
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
    if (this.maxImage) return;

    if (gallery.currentIndex >= this.MAX_IMAGE_INDEX) {
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
    const offset = gallery.currentIndex * (imageCardWidth + this.IMAGE_CARD_GAP);

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
      button.style.background = this.ACCENT_COLOR;
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
    // console.log(image);

    return `
    <div class="image-container">
      <img 
        src="${image.src_small}"
        alt="${image.alt}"
        data-image-big="${image.src_big}" 
        data-image-author="${image.author}" 
        data-image
      />
    </div>
    `;
  }

  private async fetchImages(query: string) {
    const url = `
      https://api.pexels.com/v1/search?query=${query}&orientation=square&size=small&page=1&per_page=5
    `;

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
        src_small: photo.src.portrait,
        src_big: photo.src.large2x,
        alt: photo.alt,
      }));

      return newData;
    } catch (error) {
      console.error(error.message);
    }
  }
  private handleResize() {
    if (!this.imageCards) return;
    const imageCard = this.imageCards[0] as HTMLElement;

    this.observeElementWidth(imageCard, (width) => {
      this.imageCardWidth = width;
    });
  }
  private handleCurrentGallery = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const check = target.matches("[data-gallery-nav]");
    if (check) {
      const gallery = target.closest(".gallery")?.querySelector(".images-slider") as HTMLElement;
      if (!gallery) return;
      this.lastImageDisplay(gallery);
    }
  };
  private lastImageDisplay(container: HTMLElement) {
    const lastImage = container.children[container.children.length - 1] as HTMLElement;

    this.intersectedLastElement(lastImage, (maxImage) => {
      this.maxImage = maxImage;
    });
  }

  private handlePopupDisplay = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target) return;

    if (target.hasAttribute("data-image")) {
      this.displayPopup(target);
    }
  };

  private displayPopup(image: HTMLElement) {
    if (!this.popup || !this.popupImageContainer) return;
    const srcBig = image.dataset.imageBig;
    const srcSmall = image.getAttribute("src");
    const alt = image.getAttribute("alt");

    this.popupImageContainer.innerHTML = `
      <img src="${srcBig}" alt="${alt}" loading="lazy" class="popup__image--main">
      <img src="${srcSmall}" alt="${alt}" class="popup__image--placeholder">
    `;

    this.handleImageLoad();
    this.popup.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  private handleImageLoad() {
    const mainImage = this.popupImageContainer?.querySelector(".popup__image--main");
    const placeholder = this.popupImageContainer?.querySelector(".popup__image--placeholder");

    if (!mainImage || !placeholder) return;

    mainImage.addEventListener("load", async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 350);
      });

      mainImage.classList.add("loaded");
      placeholder.classList.add("hidden");
    });
  }

  private handlePopupClose = () => {
    if (!this.popup) return;
    this.popup.classList.add("hidden");
    document.body.style.overflow = "auto";
  };
}

import { BaseComponent } from "../core";

type Image = {
  author: string;
  src_big: string;
  src_small: string;
  alt: string;
};

export class Gallery extends BaseComponent {
  //consts
  private accentColor: string = "#ffefe5";
  //state
  private _selectedGallery: string = "all";
  // private _currentIndex: number = 0;

  //elements
  private galleryBtnsContainer: HTMLElement | null;
  private galleryBtns: NodeListOf<Element> | null;
  private galleries: NodeListOf<Element> | null;
  private galleryContainers: NodeListOf<Element> | null;

  public static create(): Gallery {
    const instance = new Gallery();
    return instance;
  }

  private constructor() {
    super();

    this.initializeElements();
    this.addEventListeners();
    this.uploadImages();
    // this.handleImageNav();
  }

  get selectedGallery(): string {
    return this._selectedGallery;
  }

  set selectedGallery(value: string) {
    if (value === "") return;
    this._selectedGallery = value;
  }

  protected cleanup() {
    this.galleryBtnsContainer = null;
    this.galleries = null;
    this.galleryBtns = null;

    this._selectedGallery = "all";

    console.log("Gallery cleanup!");
  }

  private initializeElements(): void {
    const elements = {
      galleryBtnsContainer: document.getElementById("gallery-buttons-container"),
      galleries: document.querySelectorAll(".gallery"),
      galleryBtns: document.querySelectorAll(".gallery-btn"),
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
  }

  private addEventListeners(): void {
    if (!this.galleryBtnsContainer) return;

    super.addListeners(this.galleryBtnsContainer, "click", this.handleGalleryButton as EventListener);
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
      this.selectedGallery = galleryName;
      this.handleGalleryDisplay(galleryName);
    }
  }

  private handleGalleryButton = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const galleryBtn = target.closest(".gallery-btn") as HTMLElement;
    if (!galleryBtn) return;

    this.changeButton(galleryBtn);
  };

  // private handleImageNav() {
  //   const slider = document.querySelector("#classroom-gallery .album__images > .images-slider") as HTMLElement;
  //   const prev = document.querySelector("#classroom-gallery .album-nav > button:first-child");
  //   const next = document.querySelector("#classroom-gallery .album-nav > button:last-child")!;

  //   console.log(slider);
  //   if (!slider) return;
  //   next.addEventListener("click", () => {
  //     slider.style.transform = `translateX(-${1 * 300}px)`;
  //     console.log("ssa");
  //   });
  // }

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
      ``;
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
}

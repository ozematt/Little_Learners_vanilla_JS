// import { log } from "console";
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
  private _selected: string = "all";

  //elements
  private galleryBtnsContainer: HTMLElement | null;
  private galleryBtns: NodeListOf<Element> | null;
  private galleries: NodeListOf<Element> | null;

  public static create(): Gallery {
    // if(!config)
    const instance = new Gallery();
    return instance;
  }

  private constructor() {
    super();

    this.initializeElements();
    this.addEventListeners();
    this.uploadImages();
  }

  get selected(): string {
    return this._selected;
  }

  set selected(value: string) {
    if (value === "") return;
    this._selected = value;
  }

  protected cleanup() {
    this.galleryBtnsContainer = null;
    this.galleryBtns = null;
    this.galleries = null;

    this._selected = "all";

    console.log("Gallery cleanup!");
  }

  private initializeElements(): void {
    const elements = {
      galleryBtnsContainer: document.getElementById("gallery-buttons-container"),
      galleryBtns: document.querySelectorAll(".gallery-btn"),
      galleries: document.querySelectorAll(".album"),
    };
    const missingElements = Object.entries(elements)
      .filter(([_, element]) => !element)
      .map(([name]) => name);

    if (missingElements.length > 0) {
      throw new Error(`Missing elements: ${missingElements.join(", ")}`);
    }

    this.galleryBtnsContainer = elements.galleryBtnsContainer as HTMLElement;
    this.galleryBtns = elements.galleryBtns as NodeListOf<Element>;
    this.galleries = elements.galleries as NodeListOf<Element>;
  }

  private addEventListeners(): void {
    if (!this.galleryBtnsContainer) return;

    super.addListeners(this.galleryBtnsContainer, "click", this.handleGalleryButton as EventListener);
  }

  private handleGalleryDisplay(name: string) {
    if (!this.galleries) return;

    this.galleries.forEach((album) => {
      if (name === "all") {
        album.classList.remove("hidden");
        return;
      }
      const selectedGallery = name + "-gallery";
      const galleryId = album.getAttribute("id");

      if (selectedGallery !== galleryId) {
        album.classList.add("hidden");
      } else {
        album.classList.remove("hidden");
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
      const name = button.getAttribute("id") as string;
      this.selected = name;
      this.handleGalleryDisplay(name);
    }
  }

  private handleGalleryButton = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const galleryBtn = target.closest(".gallery-btn") as HTMLElement;
    if (!galleryBtn) return;

    this.changeButton(galleryBtn);
  };

  private loadImages(container: HTMLElement, images: Image[]) {
    const html = `<div class="images-slider">${images
      .map((image: any) => {
        const img = this.createImageCard(image);
        return img;
      })
      .join("")}</div>`;

    container.innerHTML = html;
  }

  private async uploadImages() {
    const classroomContainer = document.querySelector("#classroom-gallery > .album__images") as HTMLElement;
    const libraryContainer = document.querySelector("#library-gallery > .album__images") as HTMLElement;
    const scienceLabContainer = document.querySelector("#science-lab-gallery > .album__images") as HTMLElement;
    const computerLabContainer = document.querySelector("#computer-lab-gallery > .album__images") as HTMLElement;
    const natureAreaContainer = document.querySelector("#nature-area-gallery > .album__images") as HTMLElement;

    const classroomImages = await this.fetchImages("classroom");
    const libraryImages = await this.fetchImages("library");
    const scienceLabImages = await this.fetchImages("science-lab");
    const computerLabImages = await this.fetchImages("computer-lab");
    const natureAreaImages = await this.fetchImages("garden-and-nature-area");

    this.loadImages(classroomContainer, classroomImages);
    this.loadImages(libraryContainer, libraryImages);
    this.loadImages(scienceLabContainer, scienceLabImages);
    this.loadImages(computerLabContainer, computerLabImages);
    this.loadImages(natureAreaContainer, natureAreaImages);
  }

  private createImageCard(image: Image) {
    return `
    <div class="image-container">
      <img src=${image.src_big} alt=${image.alt}/>
    </div>
    `;
  }

  private async fetchImages(query: string) {
    const apiKey = "FuT0cQsGZ8peRhLoqznIwHFWiORGEnN0wHMq1nPz0Kwl98Gp0uH2Zfoa";
    const url = `https://api.pexels.com/v1/search?query=${query}&orientation=square&size=small&page=1&per_page=5`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: apiKey,
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
}

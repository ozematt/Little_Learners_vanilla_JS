// import { log } from "console";
import { BaseComponent } from "../core";

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
    // this.handleGalleryButton();
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

    super.addListeners(
      this.galleryBtnsContainer,
      "click",
      this.handleGalleryButton as EventListener
    );
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
}

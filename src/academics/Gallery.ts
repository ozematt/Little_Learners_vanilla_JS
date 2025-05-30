import { log } from "console";
import { BaseComponent } from "../core";

export class Gallery extends BaseComponent {
  private accentColor: string = "#ffefe5";

  //state
  private _selected: string = "all";

  public static create(): Gallery {
    // if(!config)
    const instance = new Gallery();
    return instance;
  }

  private constructor() {
    super();
    this.handleGaleryButton();
  }

  get selected(): string {
    return this._selected;
  }

  set selected(value: string) {
    if (value === "") return;
    this._selected = value;
  }

  protected cleanup() {}

  private handleGalleryDisplay(name: string) {
    const galleries = document.querySelectorAll(".album");

    galleries.forEach((album) => {
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
    const btns = document.querySelectorAll(".gallery-btn");

    btns.forEach((btn) => {
      (btn as HTMLElement).style.backgroundColor = "white";
    });

    if (button) {
      button.style.background = this.accentColor;
      const name = button.getAttribute("id") as string;
      this.selected = name;
      this.handleGalleryDisplay(name);
    }
  }

  private handleGaleryButton() {
    const btnsContainer = document.getElementById("gallery-buttons-container");
    if (!btnsContainer) return;

    btnsContainer.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const galleryBtn = target.closest(".gallery-btn") as HTMLElement;
      if (!galleryBtn) return;

      this.changeButton(galleryBtn);
    });
  }
}

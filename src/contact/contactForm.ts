import { InputType } from "zlib";
import { BaseComponent } from "../core";

export class ContactForm extends BaseComponent {
  //Elements
  private inputs: NodeListOf<HTMLInputElement> | null;
  private form: HTMLFormElement | null;

  public static create(): ContactForm {
    const instance = new ContactForm();
    return instance;
  }

  private constructor() {
    super();

    this.initializeElements();
    this.addEventListeners();
  }

  protected cleanup() {
    console.log("ContactForm cleanup!");
  }

  private initializeElements(): void {
    const elements = {
      form: document.querySelector("form"),
      inputs: document.querySelectorAll(".input__item"),
    };
    const missingElements = Object.entries(elements)
      .filter(([_, element]) => !element)
      .map(([name]) => name);

    if (missingElements.length > 0) {
      throw new Error(`Missing elements: ${missingElements.join(", ")}`);
    }

    this.form = elements.form as HTMLFormElement;
    this.inputs = elements.inputs as NodeListOf<HTMLInputElement>;
  }

  private addEventListeners(): void {
    if (!this.inputs || !this.form) return;

    // sprawdzaj pole po opuszczeniu
    this.inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        this.validateInput(input);
      });
    });

    // sprawdzaj wszystkie przy wysłaniu
    this.form.addEventListener("submit", (e) => {
      if (!this.form!.checkValidity()) {
        e.preventDefault();
        this.inputs!.forEach((input) => this.validateInput(input));
      }
    });
  }

  private validateInput(input: HTMLInputElement): void {
    if (!input.checkValidity()) {
      input.classList.add("invalid");
    } else {
      input.classList.remove("invalid");
    }
  }
}

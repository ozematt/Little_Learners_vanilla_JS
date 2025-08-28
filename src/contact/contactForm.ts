import { InputType } from "zlib";
import { BaseComponent } from "../core";

export class ContactForm extends BaseComponent {
  //Elements
  private inputs: NodeListOf<HTMLInputElement> | null;
  private form: HTMLFormElement | null;

  private parentNameInput: HTMLInputElement | null;
  private emailInput: HTMLInputElement | null;
  private phoneNumberInput: HTMLInputElement | null;
  private studentNameInput: HTMLInputElement | null;
  private studentAgeInput: HTMLInputElement | null;
  private programTitleInput: HTMLInputElement | null;
  private messageInput: HTMLInputElement | null;

  private submitButton: HTMLButtonElement | null;

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
      parentNameInput: document.querySelector("#parent-name"),
      emailInput: document.querySelector("#email"),
      phoneNumberInput: document.querySelector("#phone"),
      studentNameInput: document.querySelector("#student-name"),
      studentAgeInput: document.querySelector("#student-age"),
      programTitleInput: document.querySelector("#program"),
      messageInput: document.querySelector("#message"),
      submitButton: document.querySelector("#submitBtn"),
    };
    const missingElements = Object.entries(elements)
      .filter(([_, element]) => !element)
      .map(([name]) => name);

    if (missingElements.length > 0) {
      throw new Error(`Missing elements: ${missingElements.join(", ")}`);
    }

    this.form = elements.form as HTMLFormElement;
    this.inputs = elements.inputs as NodeListOf<HTMLInputElement>;

    this.parentNameInput = elements.parentNameInput as HTMLInputElement;
    this.emailInput = elements.emailInput as HTMLInputElement;
    this.phoneNumberInput = elements.phoneNumberInput as HTMLInputElement;
    this.studentNameInput = elements.studentNameInput as HTMLInputElement;
    this.studentAgeInput = elements.studentAgeInput as HTMLInputElement;
    this.programTitleInput = elements.programTitleInput as HTMLInputElement;
    this.messageInput = elements.messageInput as HTMLInputElement;
    this.submitButton = elements.submitButton as HTMLButtonElement;
  }

  private addEventListeners(): void {
    if (!this.inputs || !this.form) return;

    // validate on blur
    this.inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        this.validateInput(input);
      });
    });

    // validate data on submit
    this.form.addEventListener("submit", (e) => {
      this.submitButton!.disabled = true;

      if (!this.form!.checkValidity()) {
        e.preventDefault();
        this.inputs!.forEach((input) => this.validateInput(input));

        this.submitButton!.disabled = false;
      } else {
        e.preventDefault();

        const formData = {
          parentName: this.parentNameInput?.value,
          email: this.emailInput?.value,
          phoneNumber: this.phoneNumberInput?.value,
          studentName: this.studentNameInput?.value,
          studentAge: this.studentAgeInput?.value,
          programTitle: this.programTitleInput?.value,
          message: this.messageInput?.value,
        };
        console.log(formData);

        this.form?.reset();

        this.submitButton!.disabled = false;
      }
    });
  }

  private validateInput(input: HTMLInputElement): void {
    let isValid = input.checkValidity();

    // additional email validation
    if (input.type === "email" && input.value) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      isValid = emailRegex.test(input.value);
    }

    if (!isValid) {
      input.classList.add("invalid");
      input.nextElementSibling?.classList.remove("hidden");
    } else {
      input.classList.remove("invalid");
      input.nextElementSibling?.classList.add("hidden");
      2;
    }
  }
}

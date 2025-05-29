export class Nav {
  private navLinks: NodeList = document.querySelectorAll("[data-link-name]")!;
  private hover_bg: string = "#ffefe5";
  private contact_bg: string = "#ffae80";

  public handleNavLinkBG(path: string): void {
    const navButtons = Array.from(this.navLinks) as HTMLElement[];

    const contact = navButtons.find((item) => item.innerText === "Contact")!;

    const currentButton = document.querySelector(
      `[data-link-name="${path}"]`
    )! as HTMLElement;

    navButtons
      .filter((item: HTMLElement) => item.innerText !== "Contact")
      .forEach((link) => {
        link.style.backgroundColor = "white";
      });

    if (path === "/contact") {
      contact.style.background = this.contact_bg;
      return;
    }

    currentButton.style.backgroundColor = this.hover_bg;
  }
}

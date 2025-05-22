export class Nav {
  private navLinks: NodeList = document.querySelectorAll("[data-link-name]")!;

  public handleNavLinkBG(path: string): void {
    const navButtons = Array.from(this.navLinks) as HTMLElement[];

    const currentButton = document.querySelector(
      `[data-link-name="${path}"]`
    )! as HTMLElement;

    navButtons
      .filter((item: HTMLElement) => item.innerText !== "Contact")
      .forEach((link) => {
        link.style.backgroundColor = "white";
      });

    currentButton.style.backgroundColor = "#ffefe5";
  }
}

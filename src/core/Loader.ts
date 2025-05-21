export class Loader {
  private loader: HTMLElement = document.getElementById("loader")!;

  public handleDisplayLoader(): void {
    const { loader } = this;
    if (!loader) return;
    loader.classList.add("loader");
    loader.classList.remove("hidden");
  }

  public handleHiddenLoader(): void {
    const { loader } = this;
    if (!loader) return;
    loader?.classList.add("hidden");
    loader?.classList.remove("loader");
  }
}

export interface Component {
  destroy(): void;
}

export abstract class BaseComponent implements Component {
  protected listeners: Array<{
    element: HTMLElement;
    type: string;
    handler: EventListener;
  }> = [];

  protected resizeObserver?: ResizeObserver;
  protected intersectionObserver?: IntersectionObserver;

  public destroy(): void {
    this.removeEventListeners();

    // Czyści obserwatory
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = undefined;
    }

    this.cleanup();
  }

  protected abstract cleanup(): void;

  protected removeEventListeners() {
    this.listeners.forEach(({ element, type, handler }) => {
      element?.removeEventListener(type, handler);
    });
    this.listeners = [];
  }

  protected addListeners(element: HTMLElement, type: string, handler: EventListener) {
    element?.addEventListener(type, handler);
    this.listeners.push({ element, type, handler });
  }

  protected observeElementWidth(element: HTMLElement, onWidthChange: (width: number) => void) {
    if (!element) {
      console.warn("No last item provided to observe");
      return;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    this.resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = element.getBoundingClientRect().width;
        onWidthChange(width);
      }
    });

    this.resizeObserver.observe(element);
  }

  protected intersectedLastElement(lastItem: HTMLElement, onIntersectedElement: (isIntersected: boolean) => void) {
    if (!lastItem) {
      console.warn("No last item provided to observe");
      return;
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          onIntersectedElement(entry.isIntersecting);
        });
      },
      { root: null, threshold: 0.5, rootMargin: "0px" }
    );
    this.intersectionObserver.observe(lastItem as Element);
  }
}

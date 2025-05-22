export interface Component {
  destroy(): void;
}

export abstract class BaseComponent implements Component {
  protected listeners: Array<{
    element: HTMLElement;
    type: string;
    handler: EventListener;
  }> = [];

  public destroy(): void {
    this.removeEventListeners();
    this.cleanup();
  }

  protected abstract cleanup(): void;

  protected removeEventListeners() {
    this.listeners.forEach(({ element, type, handler }) => {
      element?.removeEventListener(type, handler);
    });
    this.listeners = [];
  }

  protected addListeners(
    element: HTMLElement,
    type: string,
    handler: EventListener
  ) {
    element?.addEventListener(type, handler);
    this.listeners.push({ element, type, handler });
  }
}

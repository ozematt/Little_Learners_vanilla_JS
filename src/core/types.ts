export type RouteConfig = {
  [path: string]: {
    html: string;
    text?: string;
  };
};

export type RouterOptions = {
  routes: RouteConfig;
  rootElement: HTMLElement;
};

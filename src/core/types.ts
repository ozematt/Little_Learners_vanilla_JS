export type RouteConfig = {
  [path: string]: {
    html: string;
    title: string;
    description?: string;
  };
};

export type RouterOptions = {
  routes: RouteConfig;
  rootElement: HTMLElement;
};

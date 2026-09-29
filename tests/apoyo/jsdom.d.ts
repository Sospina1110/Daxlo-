// jsdom no trae tipos propios. Las pruebas del build solo usan JSDOM para
// leer HTML; esto alcanza sin sumar @types/jsdom.
declare module "jsdom" {
  export class JSDOM {
    constructor(html?: string, opciones?: Record<string, unknown>);
    readonly window: Window & typeof globalThis;
  }
}

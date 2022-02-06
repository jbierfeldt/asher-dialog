/* eslint-disable @typescript-eslint/no-explicit-any */
export type Tree = DialogEvent[];

export interface DialogEvent {
  event: number | string;
  mes: string;
  res?: ResponseEvent[];
  chain?: number | string;
}

export type DisplayHandler = ((message: string) => void) | undefined;
export type InputHandler =
  | ((responses: ResponseEvent[], cb: any) => void)
  | undefined;

export interface ConstructorOptions {
  displayHandler: DisplayHandler;
  inputHandler: InputHandler;
}

export interface ResponseEvent {
  mes: string;
  next: number | string;
}

export default class DialogEngine {
  public curTree: Tree | undefined;
  public eventsMap: Map<number | string, DialogEvent>;

  private displayHandler: DisplayHandler;
  private inputHandler: InputHandler;

  constructor({
    displayHandler = undefined,
    inputHandler = undefined,
  }: ConstructorOptions) {
    this.displayHandler = displayHandler;
    this.inputHandler = inputHandler;
    this.curTree = undefined;
    this.eventsMap = new Map();
  }

  public loadTree = (tree: Tree): void => {
    this.curTree = tree;
    for (const event of tree) {
      this.eventsMap.set(event.event, event);
    }
  };

  public startTree = (): void => {
    if (this.displayHandler && this.inputHandler && this.curTree) {
      this.runEvent(this.curTree[0]);
    } else {
      throw Error("DisplayHandler or InputHandler not defined.");
    }
  };

  public runEvent = (event: DialogEvent): void => {
    if (this.displayHandler) {
      this.displayHandler(event.mes);
    }

    // chain to next event if defined
    if (event.chain) {
      const nextEvent = this.eventsMap.get(event.chain);
      if (nextEvent) {
        this.runEvent(nextEvent);
      }
    }

    if (event.res) {
      if (this.inputHandler) {
        this.inputHandler(event.res, (responseIndex: number) => {
          if (event.res) {
            const response = event.res[responseIndex];
            const nextEvent = this.eventsMap.get(response.next);
            if (nextEvent) {
              this.runEvent(nextEvent);
            }
          }
        });
      }
    }
  };
}

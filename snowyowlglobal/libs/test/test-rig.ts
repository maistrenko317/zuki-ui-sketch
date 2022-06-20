import {UIElement} from "@snowl/test/ui-element";

export interface TestRig {
  selectByAutomatedText: (id: string) => UIElement;
  selectByText: (text: string, selector?: string) => UIElement;
}

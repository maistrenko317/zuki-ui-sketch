import {TestRig} from "../../test/test-rig";
import {expect} from 'chai';
import {UIElement} from "../../test/ui-element";

export class HomeE2ePage {
  constructor (private rig: TestRig) {}

  async ensure(): Promise<void> {
    const me = this.rig.selectByAutomatedText('home-page');
    await me.waitForExist(1000);
  }

  getMeTabButton(): UIElement {
    return this.rig.selectByAutomatedText('home-me');
  }

}

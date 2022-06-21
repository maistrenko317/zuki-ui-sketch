import {TestRig} from "../../test/test-rig";
import {expect} from 'chai';
import {UIElement} from "../../test/ui-element";

export class MeE2ePage {
  constructor (private rig: TestRig) {}

  async goToFromHome(): Promise<void> {
    const meButton = this.rig.selectByAutomatedText('home-me');
    await meButton.click();
  }

  async ensure(): Promise<void> {
    const me = this.rig.selectByAutomatedText('me-component');
    expect(await me.exists()).to.equal(true);
  }

  getLoginButton(): UIElement {
    return this.rig.selectByAutomatedText('login-button-me');
  }
}

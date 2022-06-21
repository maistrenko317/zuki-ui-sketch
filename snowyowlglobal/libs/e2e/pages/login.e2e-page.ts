import {TestRig} from "../../test/test-rig";
import {expect} from 'chai';
import {UIElement} from "../../test/ui-element";
export class LoginE2ePage {
  constructor(private rig: TestRig) {}

  async ensure(): Promise<void> {
    const el = this.rig.selectByAutomatedText('login-page');
    await el.waitForExist(500);
    expect(await el.exists()).to.equal(true);
  }

  getEmailField(): UIElement {
    return this.rig.selectByAutomatedText('login-email');
  }

  getPasswordField(): UIElement {
    return this.rig.selectByAutomatedText('login-password');
  }

  getLoginButton(): UIElement {
    return this.rig.selectByAutomatedText('login-button');
  }

}

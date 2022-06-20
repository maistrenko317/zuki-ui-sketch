import { AppPage } from './app.po';
import {expect} from "chai";
import {TestRig} from "@snowl/test/test-rig";
import {browser, by, element, ElementFinder, ExpectedConditions, until} from "protractor";
import {UIElement} from "@snowl/test/ui-element";
import {runE2e} from "@snowl/e2e";

function protractorToUIElement(el: any): UIElement {
  return {
    click: el.click,
    exists: el.isPresent,
    sendKeys: el.sendKeys,
    clear: el.clear,
    waitForExist: (timeout: number) => browser.wait(ExpectedConditions.presenceOf(el), timeout) as any,
    text: el.getText
  };
}

const rig: TestRig = {
  selectByAutomatedText: (id) => {
    const el = element(by.css(`[automated="${id}"]`));
    return protractorToUIElement(el);
  },
  selectByText: (text, selector) => {
    const el = element.all(by.cssContainingText(selector || '*', text)).last();
    return protractorToUIElement(el);
  }
};

before(async function() {
  this.timeout(10000);
  await browser.get('/');
});

runE2e(rig);

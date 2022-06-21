import {TestRig} from "../../test/test-rig";
import {loginE2e} from "./login.e2e";
import {HomeE2ePage, LoginE2ePage, MeE2ePage} from "@snowl/e2e/pages";
import {expect} from 'chai';

export function authE2e(rig: TestRig) {
  describe("auth", () => {
      let mePage: MeE2ePage;
      let loginPage: LoginE2ePage;
      let homePage: HomeE2ePage;

      before(() => {
        mePage = new MeE2ePage(rig);
        loginPage = new LoginE2ePage(rig);
        homePage = new HomeE2ePage(rig);
      });

      it('should go to me page', async function() {
        this.timeout(3000);
        // const meButton = homePage.getMeTabButton();
        // await meButton.click();
        await mePage.goToFromHome();
        // await mePage.ensure();
      });

      describe('login page', () => {
        it('should go to login', async function() {
          const button = mePage.getLoginButton();
          await button.waitForExist(200);
          expect(await button.exists()).to.equal(true);
          await button.click();
          await loginPage.ensure();

        });

        it('should show dialog with incorrect login', async function () {
          this.timeout(30000);

          const email = loginPage.getEmailField();
          const password = loginPage.getPasswordField();
          const login = loginPage.getLoginButton();

          await email.sendKeys('badUser@gmail.com');
          await password.sendKeys('badPassword');
          await login.click();

          // TODO: why doesn't protractor notice this logging in stuff?
          // const loggingIn = rig.selectByText('Logging in');
          // await loggingIn.waitForExist(10000);

          const el = rig.selectByText('Invalid email or password.');
          await el.waitForExist(10000);

          const dismiss = rig.selectByText('Dismiss', 'button');
          await dismiss.click();
        });

        it('should take you to games after logging in', async function() {
          const email = loginPage.getEmailField();
          const password = loginPage.getPasswordField();
          const login = loginPage.getLoginButton();

          await email.clear();
          await password.clear();
          await email.sendKeys('user1@gmail.com');
          await password.sendKeys('a');

          await login.click();

          await homePage.ensure();
        });

        it('should show the logged in user', async function() {
          const meButton = homePage.getMeTabButton();
          await meButton.click();
          await mePage.ensure();
        })


    })

  })
}

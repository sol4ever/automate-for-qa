import LoginModal from '../pages/loginModal.js';
import NavTabs from '../pages/navTabs.js';
import { loginInputs } from '../resources/loginInputs.js';

describe('Positive Login and Navigation Functionality', () => {

    beforeEach(async () => {
        await LoginModal.open();
    });

    afterEach(async () => {
        expect(await NavTabs.resetButton).toBeDisplayed();
        // await browser.browserClose({})
        // await browser.reloadSession();
    });

    it('should login successfully and access Analityczne page', async () => {
        await NavTabs.goToAnalytics();
        await LoginModal.login(loginInputs.validUsername, loginInputs.validPassword);
        await expect(browser).toHaveUrl(expect.stringContaining('/analytics'));
    });

    // it('should login successfully and access Pracownicy page', async () => {
    //     await NavTabs.goToUsers();
    //     await LoginModal.login(loginInputs.validUsername, loginInputs.validPassword);
    //     await expect(browser).toHaveUrl(expect.stringContaining('/users-landing/info'));
    // });

    // it('should login successfully and access Produkty page', async () => {
    //     await NavTabs.goToProducts();
    //     await LoginModal.login(loginInputs.validUsername, loginInputs.validPassword);
    //     await expect(browser).toHaveUrl(expect.stringContaining('/products-landing/info'));
    // });

    // it('should login successfully and access Analityczne page', async () => {
    //     await NavTabs.goToAnalytics();
    //     await LoginModal.login(loginInputs.username11Char, loginInputs.password11Char);
    //     await expect(browser).toHaveUrl(expect.stringContaining('/analytics'));
    // });

    // it('should login successfully and access Pracownicy page', async () => {
    //     await NavTabs.goToUsers();
    //     await LoginModal.login(loginInputs.username20Char, loginInputs.password20Char);
    //     await expect(browser).toHaveUrl(expect.stringContaining('/users-landing/info'));
    // });

    // it('should login successfully and access Produkty page', async () => {
    //     await NavTabs.goToProducts();
    //     await LoginModal.login(loginInputs.validUsername, loginInputs.password20Char);
    //     await expect(browser).toHaveUrl(expect.stringContaining('/products-landing/info'));
    // });
});

import LoginPage from '../pages/loginModal.js';
import NavTabs from '../pages/zavTabs.js'
import { loginInputs } from '../resources/loginInputs.js';
import expectedValue from '../resources/expected.js'

describe('Negative Login Tests - Boundary and Invalid Inputs', () => {

    beforeEach(async () => {
        await LoginPage.open();
    });
     
    afterEach(async () => {
        expect(await NavTabs.resetButton).toBeDisplayed({ reverse: true})
        // await browser.execute(() => sessionStorage.clear());
    });

    it('should show error for empty username and password, and reset button should not be visible', async () => {
        await NavTabs.goToAnalytics();  
        await LoginPage.login(loginInputs.usernameEmpty, loginInputs.passwordEmpty);
        await expect(LoginPage.loginError).toHaveText(expectedValue.loginValidationError);
    });

    it('should show error for username with 1 character and password with 1 characters, and reset button should not be visible', async () => {
        await NavTabs.goToAnalytics();  
        await LoginPage.login(loginInputs.username1Char, loginInputs.password1Char);
        await expect(LoginPage.loginError).toHaveText(expectedValue.loginValidationError);
    });

    it('should show error for username with 9 characters and password with 9 characters, and reset button should not be visible', async () => {
        await NavTabs.goToAnalytics();  
        await LoginPage.login(loginInputs.username9Char, loginInputs.password9Char);
        await expect(LoginPage.loginError).toHaveText(expectedValue.loginValidationError);
    });

    it('should show error for username with 21 characters and password with 21 characters, and reset button should not be visible', async () => {
        await NavTabs.goToAnalytics();  
        await LoginPage.login(loginInputs.username21Char, loginInputs.password21Char);
        await expect(LoginPage.loginError).toHaveText(expectedValue.loginValidationError);
    });

    it('should show error for username with 11 characters and password with 1 character, and reset button should not be visible', async () => {
        await NavTabs.goToAnalytics();  
        await LoginPage.login(loginInputs.username11Char, loginInputs.password1Char);
        await expect(LoginPage.loginError).toHaveText(expectedValue.loginValidationError);
    });

    it('should show error for username with 10 characters and password with 9 characters, and reset button should not be visible', async () => {
        await NavTabs.goToAnalytics();  
        await LoginPage.login(loginInputs.validUsername, loginInputs.password9Char);
        await expect(LoginPage.loginError).toHaveText(expectedValue.loginValidationError);
    });

    it('should show error for username with 21 characters and password with 11 characters, and reset button should not be visible', async () => {
        await NavTabs.goToAnalytics();  
        await LoginPage.login(loginInputs.username21Char, loginInputs.password11Char);
        await expect(LoginPage.loginError).toHaveText(expectedValue.loginValidationError);
    });
});

describe('Negative Login Tests - Boundary and Invalid Inputs with successful final login', () => {

    beforeEach(async () => {
        await LoginPage.open();
        await NavTabs.goToAnalytics();  
    });
     

    it('should show error for username with 10 characters and password with 9 characters, and reset button should not be visible', async () => {
        // await LoginPage.open();
        // await NavTabs.goToAnalytics();  
        await LoginPage.login(loginInputs.validUsername, loginInputs.password9Char);
        await expect(LoginPage.loginError).toHaveText(expectedValue.loginValidationError);
        expect(await NavTabs.resetButton).toBeDisplayed({ reverse: true})
    });

    it('should login successfully after invalid attempts and check reset button', async () => {
        // await NavTabs.goToAnalytics();  
        await LoginPage.login(loginInputs.validUsername, loginInputs.validPassword);
        expect(await NavTabs.resetButton).toBeDisplayed()
        await expect(browser).toHaveUrl(expect.stringContaining('/analytics'));
    });
});

import Page from './page';
import { waitForUrlToContain } from '../utilities/helpers.waits';

class LoginModal extends Page{

    get usernameInput() {
        return $('[data-testid="username-input"]');
    }
    get passwordInput() {
        return $('[data-testid="password-input"]');
    }
    get loginButton() {
        return $('[data-testid="login-button"]');
    }
    get loginError() {
        return $('[data-testid="login-error"]');
    }
    get loginModal() {
        return $('[data-testid="login-modal"]');
    }

    async openLoginModal(navTabSelector) {
        await navTabSelector.click();
        await this.loginModal.waitForDisplayed();
    }

    async login(username, password) {
        await this.usernameInput.setValue(username);
        await this.passwordInput.setValue(password);
        await this.loginButton.click();
    }

    async waitForUrlToContain(expectedUrl) {
        await waitForUrlToContain(expectedUrl);
    }
}

export default new LoginModal();

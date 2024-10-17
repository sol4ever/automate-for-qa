import Page from './page.js';
import { waitToBeClickableAndClick } from '../utilities/helpers.waits.js';

class NavTabs extends Page {

    get analyticsTab() { return $('[data-testid="nav-analytics"]'); }
    get usersTab() { return $('[data-testid="nav-users"]'); }
    get productsTab() { return $('[data-testid="nav-products"]'); }
    get resetButton() { return $('[data-testid="reset-button"]'); }

    open() {
        return super.open('/home');
    }

    async goToAnalytics() {
        await waitToBeClickableAndClick(await this.analyticsTab);
    }

    async goToUsers() {
        await waitToBeClickableAndClick(await this.usersTab);
    }

    async goToProducts() {
        await waitToBeClickableAndClick(await this.productsTab);
    }
}

export default new NavTabs();
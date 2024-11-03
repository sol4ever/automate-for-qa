import Page from './page.js';

class ProductsLanding extends Page {
    open() {
        return super.open('/products-landing/info');
    }

    async navigateToTab(tab) {
        const tabSelector = {
            info: '[data-testid="nav-info"]',
            list: '[data-testid="nav-list"]',
            deleted: '[data-testid="nav-deleted"]',
            new: '[data-testid="nav-new"]',
        }[tab];
        await $(tabSelector).click();
    }
}

export default new ProductsLanding();

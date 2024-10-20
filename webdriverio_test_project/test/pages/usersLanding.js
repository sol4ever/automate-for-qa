import Page from './page.js';

class UsersLanding extends Page {

    get navInfo() {
        return $('[data-testid="navInfo"]');
    }
    get navList() {
        return $('[data-testid="navList"]');
    }
    get navDeleted() {
        return $('[data-testid="navDeleted"]');
    }
    get navNew() {
        return $('[data-testid="navNew"]');
    }


    open() {
        return super.open('/users-landing/info');
    }


    async clickNavInfo() {
        await (await this.navInfo).click();
    }

    async clickNavList() {
        await (await this.navList).click();
    }

    async clickNavDeleted() {
        await (await this.navDeleted).click();
    }

    async clickNavNew() {
        await (await this.navNew).click();
    }
}

export default new UsersLanding();

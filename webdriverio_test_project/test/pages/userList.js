import { waitForElementToBeDisplayed } from '../utilities/helpers.waits.js'

class UserList {

    get addNewUserButton() {
        return $('[data-testid="addNewUserButton"]');
    }
    get searchInput() {
        return $('[data-testid="searchInput"]');
    }
    get noDataMessage() {
        return $('[data-testid="noDataMessage"]');
    }
    get noSearchResultsMessage() {
        return $('[data-testid="noSearchResultsMessage"]');
    }
    get dataGrid() {
        return $('[data-testid="dataGrid"]');
    }
    get deleteConfirmationModal() {
        return $('[data-testid="deleteConfirmationModal"]');
    }
    getEditUserButton(userId) {
        return $(`[data-testid="editUser-${userId}"]`);
    }
    getDeleteUserButton(userId) {
        return $(`[data-testid="deleteUser-${userId}"]`);
    }
    getEntityListItem(userId) {
        return $(`[data-testid="entityListItem-${userId}"]`);
    }
    getEmail(userId) {
        return $(`[data-testid="email-${userId}"]`);
    }
    getPhone(userId) {
        return $(`[data-testid="phone-${userId}"]`);
    }
    getStatus(userId) {
        return $(`[data-testid="status-${userId}"]`);
    }
    getTitle(userId) {
        return $(`[data-testid="title-${userId}"]`);
    }

    async getEntityListItem(userName) {
        const userByAlt = $(`img[alt="${userName}"]`);
        
        if (await userByAlt.isDisplayed()) {
            return userByAlt;
        }
        const userByText = $(`.entityListItem*=${userName}`);
        return userByText;
    }

    async filterUserByName(newUserName) {
        const searchInput = await this.searchInput;
        await searchInput.click();
        await searchInput.setValue(newUserName);

        const createdUser = await this.getEntityListItem(newUserName);
        await waitForElementToBeDisplayed(
            createdUser,
            5000,
            `Expected user ${newUserName} to appear in the filtered list, but it was not found.`
        );

        await expect(createdUser).toBeDisplayed()
    }
}

export default new UserList();

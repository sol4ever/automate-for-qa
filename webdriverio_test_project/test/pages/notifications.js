import Page from './page.js';
import { waitForElementDisplayed, waitForUrlToContain } from '../utilities/helpers.waits.js';

class Notifications extends Page {

    get notificationContainer() { 
        return $('.MuiAlert-message'); 
    }

    async validateNotifications(toastMessage,expectedUrl) {
     
        await waitForElementDisplayed(await this.notificationContainer);

        let toastValue = await this.notificationContainer.getText();
        console.log(toastValue + " <-- This is the displayed toast message");

        await expect(this.notificationContainer).toHaveTextContaining(toastMessage, {
            ignoreCase: true,
            message: `Expected to have toast message with text: "${toastMessage}", but it wasn't found!`
        }).then(async () => {
            await waitForUrlToContain(expectedUrl);
        });
    }

}
export default new Notifications();
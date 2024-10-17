import Page from './page.js';
import { waitForElementDisplayed, waitToBeClickableAndClick } from '../utilities/helpers.waits.js';

class Home extends Page {

    open() {
        return super.open('/home')
    }

    get buttonGetStarted() { return $$('.get-started-docs')[0]; }

    async scrollToButtonGetName() {
             waitForElementDisplayed(await this.buttonGetStarted).then(async () => {
            let buttonName = await this.buttonGetStarted.getText();
            console.log("This is button name: " + buttonName)
            return buttonName
        })

    }

}
export default new Home();
import Page from './page.js';
import { waitToBeClickableAndClick } from '../utilities/helpers.waits.js';

// import fs from 'fs';
// import path from 'path';

// export const createDirectoryIfNotExists = (dirPath) => {
//     if (!fs.existsSync(dirPath)) {
//         fs.mkdirSync(dirPath, { recursive: true });
//     }
// };

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
        // if (!await this.analyticsTab.isClickable()) {
        //     await browser.saveScreenshot('./error_screenshots/element-not-clickable.png');
        // }
    }

    // async goToAnalytics() {
    //     const screenshotsDir = path.resolve('./error_screenshots');
        
    //     // Ensure the directory exists
    //     createDirectoryIfNotExists(screenshotsDir);

    //     try {
    //         await waitToBeClickableAndClick(await this.analyticsTab);
    //     } catch (error) {
    //         // Save screenshot if element is not clickable
    //         const screenshotPath = path.join(screenshotsDir, 'element-not-clickable.png');
    //         await browser.saveScreenshot(screenshotPath);
    //         console.error(`Error clicking on Analytics Tab. Screenshot saved at ${screenshotPath}`);
    //         throw error; // Re-throw the error to fail the test
    //     }
    // }

    async goToUsers() {
        await waitToBeClickableAndClick(await this.usersTab);
    }

    async goToProducts() {
        await waitToBeClickableAndClick(await this.productsTab);
    }
}

export default new NavTabs();
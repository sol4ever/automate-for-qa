import {config} from '../../wdio.conf.js'

export default class Page {
    open(path) {
        const appUrl = new URL(path, config.baseUrl)
        // console.log('Navigating to appUrl:', appUrl);  // Debugging
        // console.log('Navigating to config.baseUrl:', config.baseUrl);  // Debugging
        return browser.url(appUrl.href);
    }
}

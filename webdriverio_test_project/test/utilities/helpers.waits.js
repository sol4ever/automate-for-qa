import 'dotenv/config';

export const waitForElementEnabled = async (element) => {
    const elem = await element;
    await elem.waitUntil(async function () {
        return ((await this.isEnabled()))
    }, {
        timeout: 5000,
        timeoutMsg: "Expected element to be enabled, but it wasn't!"
    })
}

export const waitForElementToBeClosed = async (element) => {
    const elem = await element;
    await elem.waitUntil(async function () {
        return ((await this.isDisplayed()) === false)
    }, {
        timeout: 5000,
        timeoutMsg: "Expected element to be closed, but it wasn't!"
    })
}


export const waitForElementToHaveValue = async (element) => {
    const elem = await element;
    await elem.waitUntil(async function () {
        return (await this.getText()) == value;
    }, {
        timeout: 5000,
        timeoutMsg: `Expected element to have value: "${value}", but it wasn't!`
    })
}

export const waitForElementToNotHaveValue = async (element) => {
    const elem = await element;
    await elem.waitUntil(async function () {
        return ((await this.getText())) !== value;
    }, {
        timeout: 5000,
        timeoutMsg: `Expected element to not have value: "${value}", but it had!`
    })
}

export const waitToBeClickableAndClick = async (element) => {
    await element.waitForClickable({timeout: 20000});
    await element.click();
}

export const waitForElementDisplayed = async (element, timeout = 5000) => {
    await element.waitForDisplayed({ timeout });
};

export const waitForUrlToContain = async (expectedUrl) => {
    await browser.waitUntil(
        async () => (await browser.getUrl()).includes(expectedUrl),
        {
            timeout: 5000,
            timeoutMsg: `Expected URL to contain ${expectedUrl}, but got ${await browser.getUrl()}`,
        }
    );
};

export const waitForElementToBeDisplayed = async (element, timeout = 5000, timeoutMsg = 'Expected element to be displayed, but it was not.') => {
    const elem = await element;
    await elem.waitUntil(async function () {
        return await this.isDisplayed();
    }, {
        timeout: timeout,
        timeoutMsg: timeoutMsg
    });
};
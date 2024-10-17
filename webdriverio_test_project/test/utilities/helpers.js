export const waitAndClick = (elem, timeout) => {
    elem.waitForDisplayed({ timeout });
    elem.click();
}

export const pickElement = (elementsToCheck) => {
    let itemsList = [];
    for (let i = 0; i < elementsToCheck.lenght; i++) {
        itemsList.push(elementsToCheck[i]);
    };
    return itemsList;
}

export const showElements = (elementsToCheck) => {
    let itemsList = [];
    for (let i = 0; i < elementsToCheck.lenght; i++) {
        itemsList.push(elementsToCheck[i].getText());
    };
    itemsList.forEach(function (item, index) {
        let itemNumber = index + 1;
        console.log("Item: " + item + ", " + " Item number: " + itemNumber);
    });
}

//Arrow down to select filtered option, and press enter to confirm selection
//Selenium keys codes: https://www.selenium.dev/selenium/docs/api/py/webdriver/selenium.webdriver.common.keys.html
export const selectFromList = async () => {
    await browser.performActions([{
        type: 'key',
        id: 'keyboard',
        actions: [
            {
                type: 'keyDown', value: '\ue015'
            },
        ],
    }]);
    await browser.performActions([{
        type: 'key',
        id: 'keyboard',
        actions: [
            {
                type: 'keyDown', value: '\ue007'
            },
        ],
    }]);
}
import NewProduct from '../pages/newProduct';
import ProductsLanding from '../pages/productsLanding';
import Notifications from '../pages/notifications';
import urls from '../resources/urls';
import { currentDateAndTime } from '../utilities/helpers.timeGenerators';
import LoginModal from '../pages/loginModal';
import Home from '../pages/home.js';
import NavTabs from '../pages/navTabs';
import { loginInputs } from '../resources/loginInputs';
import ProductsList from '../pages/productsList.js';

describe('NewProduct Form Tests', () => {

    // beforeEach(async () => {
    //     // await Home.open();
    //     await LoginModal.open();
    //     await NavTabs.goToProducts();
    //     await LoginModal.login(loginInputs.validUsername, loginInputs.validPassword);
    // });

    // beforeEach(async () => {
    //     await browser.execute(() => sessionStorage.clear());
    // });

    // afterEach(async () => {
    //     await browser.execute(() => sessionStorage.clear());
    // });

    it('should submit a smartphone product successfully', async () => {
        await LoginModal.open();
        await NavTabs.goToProducts();
        console.log(await browser.getUrl(),'3')
        await LoginModal.login(loginInputs.validUsername, loginInputs.validPassword)
      

        await NavTabs.goToProducts();
        console.log(await browser.getUrl(),'4')
        await ProductsLanding.navigateToTab('new');
        await browser.pause(5000)
    });



    it('should submit a smartphone product successfully', async () => {
        // await LoginModal.open();
        // await NavTabs.goToProducts();
        // console.log(await browser.getUrl(),'3')
        // await LoginModal.login(loginInputs.validUsername, loginInputs.validPassword)
      
        const productName = `${currentDateAndTime()} Smartfon`;

        // await NavTabs.goToProducts();
        console.log(await browser.getUrl(),'4')
        // await ProductsLanding.navigateToTab('new');
        await browser.pause(5000)
        console.log(await browser.getUrl(),'5')
        await browser.pause(5000)

        await NewProduct.fillBasicInfo({
            name: productName,
            subcategory: 'Smartfony',
            price: '1800',
        });

        await NewProduct.submitForm();
        await Notifications.validateNotifications('Produkt został dodany!', urls.productsList);
        await ProductsList.filterProductsByName(productName)
    });

    it('should submit a feature phone product successfully', async () => {
        // await LoginModal.open();
        // await NavTabs.goToProducts();
        // await LoginModal.login(loginInputs.validUsername, loginInputs.validPassword);
        console.log(await browser.getUrl(),'3')

        const productName = `${currentDateAndTime()} Feature Phone`;

        await NavTabs.goToProducts();
        await ProductsLanding.navigateToTab('new');
        console.log(await browser.getUrl(),'4')

        await NewProduct.fillBasicInfo({
            name: productName,
            subcategory: 'Feature Phones',
            price: '300',
        });

        await NewProduct.submitForm();
        await Notifications.validateNotifications('Produkt został dodany!', urls.productsList);
        await ProductsList.filterProductsByName(productName)
    });

    it('should submit a phone accessory (case) successfully', async () => {
        const productName = `${currentDateAndTime()} Etui`;

        await NavTabs.goToProducts();
        await ProductsLanding.navigateToTab('new');

        await NewProduct.fillBasicInfo({
            name: productName,
            subcategory: 'Etui',
            price: '50',
        });

        await NewProduct.submitForm();
        await Notifications.validateNotifications('Produkt został dodany!', urls.productsList);
        await ProductsList.filterProductsByName(productName)
    });

    it('should submit a phone accessory (screen protector) successfully', async () => {
        const productName = `${currentDateAndTime()} Szkło ochronne`;

        await NavTabs.goToProducts();
        await ProductsLanding.navigateToTab('new');

        await NewProduct.fillBasicInfo({
            name: productName,
            subcategory: 'Szkła ochronne',
            price: '30',
        });

        await NewProduct.submitForm();
        await Notifications.validateNotifications('Produkt został dodany!', urls.productsList);
        await ProductsList.filterProductsByName(productName)
    });

    it('should submit a phone accessory (charger) successfully', async () => {
        const productName = `${currentDateAndTime()} Ładowarka`;

        await NavTabs.goToProducts();
        await ProductsLanding.navigateToTab('new');

        await NewProduct.fillBasicInfo({
            name: productName,
            subcategory: 'Ładowarki',
            price: '100',
        });

        await NewProduct.submitForm();
        await Notifications.validateNotifications('Produkt został dodany!', urls.productsList);
        await ProductsList.filterProductsByName(productName)
    });

    it('should submit a phone accessory (headphones) successfully', async () => {
        const productName = `${currentDateAndTime()} Słuchawki`;

        await NavTabs.goToProducts();
        await ProductsLanding.navigateToTab('new');

        await NewProduct.fillBasicInfo({
            name: productName,
            subcategory: 'Słuchawki',
            price: '150',
        });

        await NewProduct.submitForm();
        await Notifications.validateNotifications('Produkt został dodany!', urls.productsList);
        await ProductsList.filterProductsByName(productName)
    });

    it('should submit a phone accessory (powerbank) successfully', async () => {
        const productName = `${currentDateAndTime()} Powerbank`;

        await NavTabs.goToProducts();
        await ProductsLanding.navigateToTab('new');

        await NewProduct.fillBasicInfo({
            name: productName,
            subcategory: 'Powerbanki',
            price: '200',
        });

        await NewProduct.submitForm();
        await Notifications.validateNotifications('Produkt został dodany!', urls.productsList);
        await ProductsList.filterProductsByName(productName)
    });
});

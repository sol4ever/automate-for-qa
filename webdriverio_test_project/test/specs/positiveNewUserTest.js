import NewUser from '../pages/newUser';
import testDataUser from '../resources/userInputs';
import UsersLanding from '../pages/usersLanding';
import LoginModal from '../pages/loginModal';
import { loginInputs } from '../resources/loginInputs';
import NavTabs from '../pages/navTabs';
import Home from '../pages/home';
import Notifications from '../pages/notifications';
import urls from '../resources/urls'
import UserList from '../pages/userList';


describe('NewUser Form Positive Tests', () => {

    beforeEach(async () => {
        await Home.open();
        await browser.execute(() => {
            sessionStorage.clear(); 
        });
    });

    it('should fill the form with positive values and submit successfully', async () => {
        const newUserName = testDataUser.userName.positive[1];

        await NavTabs.goToUsers();
        await LoginModal.login(loginInputs.validUsername, loginInputs.validPassword);
        await UsersLanding.clickNavNew();

        await (await NewUser.inputUserName).setValue(newUserName); // 'JaneDoe AutoMate'
        await (await NewUser.inputFullName).setValue(testDataUser.fullName.positive[0]); // 'John Doe'
        await (await NewUser.inputEmail).setValue(testDataUser.email.positive[0]); // 'test@example.com'
        await (await NewUser.inputPhone).setValue(testDataUser.phone.positive[1]); // '+48123123123'
        await (await NewUser.inputAddress).setValue(testDataUser.address.positive[0]); // '123 Main St'

        await NewUser.enterDateOfBirth();

        await (await NewUser.selectGender).click();
        await browser.keys(['ArrowDown', 'Enter']);

        await (await NewUser.radioTitleFrontendDeveloper).click();
        await (await NewUser.toggleActive).click();
        await (await NewUser.submitButton).click();

        await Notifications.validateNotifications('Pracownik dodany!', urls.usersList);
        await UserList.filterUserByName(newUserName)
    });
});

describe('NewUser Form Positive Tests - Minimum Values', () => {

    beforeEach(async () => {
        await Home.open();
        await browser.execute(() => {
            sessionStorage.clear(); 
        });
    });

    it('should fill the form with minimum positive values and submit successfully', async () => {
        const newUserName = testDataUser.userName.positive[2]; // 'aaa' (minimum length)

        await NavTabs.goToUsers();
        await LoginModal.login(loginInputs.validUsername, loginInputs.validPassword);
        await UsersLanding.clickNavNew();

        await (await NewUser.inputUserName).setValue(newUserName); // Use 'aaa'
        await (await NewUser.inputFullName).setValue(testDataUser.fullName.positive[1]); // 'Jane Smith'
        await (await NewUser.inputEmail).setValue(testDataUser.email.positive[1]); // 'user.name111111111111111@domain.com'
        await (await NewUser.inputPhone).setValue(testDataUser.phone.positive[0]); // '1'
        await (await NewUser.inputAddress).setValue(testDataUser.address.positive[1]); // 'Apartment 45B'

        await NewUser.enterDateOfBirth();

        await (await NewUser.selectGender).click();
        await browser.keys(['ArrowDown', 'Enter']);

        await (await NewUser.radioTitleBackendDeveloper).click(); // 'Backend Developer'
        await (await NewUser.toggleActive).click();
        await (await NewUser.submitButton).click();

        await Notifications.validateNotifications('Pracownik dodany!', urls.usersList);
        await UserList.filterUserByName(newUserName);
    });
});

describe('NewUser Form Positive Tests - Maximum Values', () => {

    beforeEach(async () => {
        await Home.open();
        await browser.execute(() => {
            sessionStorage.clear(); 
        });
    });

    it('should fill the form with maximum positive values and submit successfully', async () => {
        const newUserName = testDataUser.userName.positive[3]; // 'a'.repeat(40) (maximum length)

        await NavTabs.goToUsers();
        await LoginModal.login(loginInputs.validUsername, loginInputs.validPassword);
        await UsersLanding.clickNavNew();

        await (await NewUser.inputUserName).setValue(newUserName); // Use 'a'.repeat(40)
        await (await NewUser.inputFullName).setValue(testDataUser.fullName.positive[2]); // 'aaa'
        await (await NewUser.inputEmail).setValue(testDataUser.email.positive[0]); // 'test@example.com'
        await (await NewUser.inputPhone).setValue(testDataUser.phone.positive[2]); // '123456789123'
        await (await NewUser.inputAddress).setValue(testDataUser.address.positive[2]); // 'a'.repeat(40)

        await NewUser.enterDateOfBirth();

        await (await NewUser.selectGender).click();
        await browser.keys(['ArrowDown', 'Enter']);

        await (await NewUser.radioTitleProductOwner).click(); // 'Product Owner'
        await (await NewUser.toggleActive).click();
        await (await NewUser.submitButton).click();

        await Notifications.validateNotifications('Pracownik dodany!', urls.usersList);
        await UserList.filterUserByName(newUserName);
    });
});
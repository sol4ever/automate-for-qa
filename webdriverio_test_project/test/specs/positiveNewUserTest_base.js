import NewUser from '../pages/newUser.js';
import testDataUser from '../resources/userInputs.js';
import UsersLanding from '../pages/usersLanding.js';
import LoginModal from '../pages/loginModal.js';
import { loginInputs } from '../resources/loginInputs.js';
import NavTabs from '../pages/navTabs.js';
import Notifications from '../pages/notifications.js';
import urls from '../resources/urls.js'
import UserList from '../pages/userList.js';

describe('NewUser Form Positive Tests', () => {

    beforeEach(async () => {
        await LoginModal.open();
        await NavTabs.goToUsers();
        await LoginModal.login(loginInputs.validUsername, loginInputs.validPassword);
    });


    it('should fill the form with positive values and submit successfully', async () => {
        const newUserName = testDataUser.userName.positive[1];
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
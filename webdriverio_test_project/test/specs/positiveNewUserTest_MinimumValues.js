import NewUser from '../pages/newUser.js';
import testDataUser from '../resources/userInputs.js';
import UsersLanding from '../pages/usersLanding.js';
import LoginModal from '../pages/loginModal.js';
import { loginInputs } from '../resources/loginInputs.js';
import NavTabs from '../pages/navTabs.js';
import Home from '../pages/home.js';
import Notifications from '../pages/notifications.js';
import urls from '../resources/urls.js'
import UserList from '../pages/userList.js';
import LoginPage from '../pages/loginModal.js';

describe('NewUser Form Positive Tests - Minimum Values', () => {

    it('should fill the form with minimum positive values and submit successfully', async () => {
        await LoginPage.open();

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
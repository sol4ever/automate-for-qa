import NewUser from '../pages/newUser.js';
import testDataUser from '../resources/userInputs.js';
import UsersLanding from '../pages/usersLanding.js';
import LoginModal from '../pages/loginModal.js';
import { loginInputs } from '../resources/loginInputs.js';
import NavTabs from '../pages/navTabs.js';
import Notifications from '../pages/notifications.js';
import urls from '../resources/urls.js'
import UserList from '../pages/userList.js';

describe('NewUser Form Positive Tests - Maximum Values', () => {

    it('should fill the form with maximum positive values and submit successfully', async () => {
        
        await LoginModal.open();
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
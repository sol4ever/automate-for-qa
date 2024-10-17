import Page from './page';
import { getDayBeforeDate } from '../utilities/helpers.timeGenerators';
import { waitToBeClickableAndClick } from '../utilities/helpers.waits';

class NewUser extends Page {
    get inputUserName() {
        return $('[data-testid="inputUserName"]');
    }
    get inputFullName() {
        return $('[data-testid="inputFullName"]');
    }
    get inputEmail() {
        return $('[data-testid="inputEmail"]');
    }
    get inputPhone() {
        return $('[data-testid="inputPhone"]');
    }
    get inputAddress() {
        return $('[data-testid="inputAddress"]');
    }
    get inputDob() {
        return $('[data-testid="inputDob"]');
    }
    get DatePickerInput() {
        return $('input[placeholder="MM/DD/YYYY"][type="text"]');
    }
    
    get selectGender() {
        return $('[data-testid="selectGender"]');
    }
    get inputTitle() {
        return $('[data-testid="inputTitle"]');
    }
    get userAvatar() {
        return $('[data-testid="userAvatar"]');
    }
    get labelSelectImage() {
        return $('[data-testid="labelSelectImage"]');
    }
    get toggleActive() {
        return $('[data-testid="toggleActive"]');
    }
    get submitButton() {
        return $('[data-testid="submitButton"]');
    }
    get notification() {
        return $('[data-testid="notification"]');
    }
    get imageUploadModal() {
        return $('[data-testid="imageUploadModal"]');
    }
    get radioTitleSoftwareTester() {
        return $('[data-testid="radioTitle-Software Tester"]');
    }
    get radioTitleFrontendDeveloper() {
        return $('[data-testid="radioTitle-Frontend Developer"]');
    }
    get radioTitleBackendDeveloper() {
        return $('[data-testid="radioTitle-Backend Developer"]');
    }
    get radioTitleBusinessAnalyst() {
        return $('[data-testid="radioTitle-Business Analyst"]');
    }
    get radioTitleChapterLead() {
        return $('[data-testid="radioTitle-Chapter Lead"]');
    }
    get radioTitleProductOwner() {
        return $('[data-testid="radioTitle-Product Owner"]');
    }
    get radioTitleFullstackDeveloper() {
        return $('[data-testid="radioTitle-Fullstack Developer"]');
    }
    get radioTitleUXDesigner() {
        return $('[data-testid="radioTitle-UX Designer"]');
    }

    open() {
        return super.open('/users-landing/new');
    }

    async enterDateOfBirth() {
        const dateToEnter = getDayBeforeDate();
        await waitToBeClickableAndClick(await this.DatePickerInput);

        for (const char of dateToEnter) {
            await this.DatePickerInput.addValue(char);
        }
    }
}

export default new NewUser();

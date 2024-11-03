import Page from './page.js';

class NewProduct extends Page {
    open() {
        return super.open('/products-landing/new');
    }

    get nameInput() { return $('[data-testid="input-name"]'); }
    get categorySelect() { return $('[data-testid="select-category"]'); }
    get subcategorySelect() { return $('[data-testid="select-subcategory"]'); }
    get brandSelect() { return $('[data-testid="select-brand"]'); }
    get applicableModelSelect() { return $('[data-testid="select-applicableModel"]'); }
    get materialSelect() { return $('[data-testid="select-material"]'); }
    get chargerTypeSelect() { return $('[data-testid="select-chargerType"]'); }
    get screenSizeSelect() { return $('[data-testid="select-screenSize"]'); }
    get storageSelect() { return $('[data-testid="select-storage"]'); }
    get ramSelect() { return $('[data-testid="select-ram"]'); }
    get batterySelect() { return $('[data-testid="select-battery"]'); }
    get colorOptions() { return $$('[data-testid="color-options"] input'); }
    get typeOptions() { return $$('[data-testid="radio-options"] input'); }
    get priceInput() { return $('[data-testid="price-input"]'); }
    get promotedSwitch() { return $('[data-testid="promoted-switch"]'); }
    get submitButton() { return $('[data-testid="submit-button"]'); }
    get operatingSystemSelect() { return $('[data-testid="select-os"]') }

    async selectOption(selector, steps) {
        await selector.click();
        for (let i = 0; i < steps; i++) await browser.keys('ArrowDown');
        await browser.keys('Enter');
    }

    async fillBasicInfo({ name, subcategory, price }) {
        await this.nameInput.setValue(name);

        // Set category based on the subcategory type
        if (['Smartfony', 'Feature Phones'].includes(subcategory)) {
            await this.selectOption(this.categorySelect, 0); // Telefony komórkowe
        } else {
            await this.selectOption(this.categorySelect, 1); // Akcesoria
        }

        // Set subcategory
        const subcategoryOptions = {
            'Smartfony': 0,
            'Feature Phones': 1,
            'Etui': 0,
            'Szkła ochronne': 1,
            'Ładowarki': 2,
            'Słuchawki': 3,
            'Powerbanki': 4,
        };
        await this.selectOption(this.subcategorySelect, subcategoryOptions[subcategory]);

        // Fill fields based on subcategory-specific requirements
        switch (subcategory) {
            case 'Smartfony':
            case 'Feature Phones':
                await this.selectOption(this.brandSelect, 1); // Brand Apple
                await this.selectOption(this.operatingSystemSelect, 1); // OS IOS 17
                await this.selectOption(this.screenSizeSelect, 1); // 6.1"
                await this.selectOption(this.storageSelect, 1); // 64GB
                await this.selectOption(this.ramSelect, 1); // 4GB
                await this.selectOption(this.batterySelect, 1); // 4000 mAh
                await this.colorOptions[0].click(); // Color czarny
                break;

            case 'Etui':
                await this.selectOption(this.brandSelect, 3); // Brand Forever
                await this.selectOption(this.applicableModelSelect, 6); // Redmi 15
                await this.selectOption(this.materialSelect, 1); // Plastik
                await this.colorOptions[0].click(); // Color czarny
                break;

            case 'Szkła ochronne':
                await this.selectOption(this.brandSelect, 3); // Brand Forever
                await this.selectOption(this.applicableModelSelect, 1); // Galaxy A70
                await this.selectOption(this.screenSizeSelect, 1); // 6.1"
                break;

            case 'Ładowarki':
                await this.selectOption(this.brandSelect, 0); // Brand Samsung
                await this.selectOption(this.applicableModelSelect, 0); // Galaxy A40
                await this.selectOption(this.chargerTypeSelect, 0); // USB-C
                break;

            case 'Słuchawki':
                await this.selectOption(this.brandSelect, 0); // Brand Samsung
                await this.selectOption(this.applicableModelSelect, 2); // Galaxy S10
                await this.typeOptions[1].click(); // Type nauszne
                await this.colorOptions[1].click(); // Color biały
                break;

            case 'Powerbanki':
                await this.selectOption(this.brandSelect, 2); // Brand Xiaomi
                await this.selectOption(this.applicableModelSelect, 1); // Redmi 18
                await this.selectOption(this.batterySelect, 1); // 4000 mAh
                break;
        }

        // Set the price and toggle promoted status
        await this.priceInput.setValue(price);
        await this.togglePromoted();
    }

    async togglePromoted() {
        await this.promotedSwitch.click();
    }

    async submitForm() {
        await this.submitButton.click();
    }
}

export default new NewProduct();

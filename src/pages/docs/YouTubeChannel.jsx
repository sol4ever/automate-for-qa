import React from 'react';
import CodeBlock from './CodeBlock';

export default function YouTubeChannel() {
    const testCode = `
describe('Positive Login and Navigation Functionality', () => {

    beforeEach(async () => {
        await LoginModal.open('/home');
    });

    afterEach(async () => {
        expect(await NavTabs.resetButton).toBeDisplayed();
        await browser.reloadSession();
    });

    it('should login successfully and access Analityczne page', async () => {
        await NavTabs.goToAnalytics();
        await LoginModal.login(loginInputs.validUsername, loginInputs.validPassword);
        await expect(browser).toHaveUrlContaining('/analytics');
    });

    it('should login successfully and access Pracownicy page', async () => {
        await NavTabs.goToUsers();
        await LoginModal.login(loginInputs.validUsername, loginInputs.validPassword);
        await expect(browser).toHaveUrlContaining('/users-landing/info');
    });

    it('should login successfully and access Produkty page', async () => {
        await NavTabs.goToProducts();
        await LoginModal.login(loginInputs.validUsername, loginInputs.validPassword);
        await expect(browser).toHaveUrlContaining('/products-landing/info');
    });
});
    `;

    return (
        <div>
            <p>WebdriverIO to kompleksowy framework do testowania aplikacji webowych, który łączy w sobie zarówno możliwość pisania lekkich testów komponentów, jak i pełnych scenariuszy end-to-end w przeglądarce. <b>Jego wszechstronność pozwala na dopasowanie do różnych potrzeb testowych, co czyni go narzędziem odpowiednim zarówno dla małych, jak i dużych projektów.</b></p>
            <p>Jedną z kluczowych cech WebdriverIO jest inteligentne podejście do selektorów, które znacząco upraszcza interakcję z aplikacjami opartymi na takich technologiach jak React. Dzięki temu testerzy mogą łatwo identyfikować i kontrolować komponenty, bez konieczności definiowania złożonych lokatorów. WebdriverIO obsługuje również zagnieżdżone struktury DOM, w tym shadow DOM, co umożliwia testowanie nawet bardzo skomplikowanych interfejsów użytkownika.</p>
            <p>Framework zapewnia integrację z różnymi narzędziami testowymi, takimi jak Mocha, co umożliwia elastyczne zarządzanie testami oraz generowanie szczegółowych raportów. <b>Automatyzacja testów za pomocą WebdriverIO pozwala znacząco skrócić czas potrzebny na ich przeprowadzenie, jednocześnie minimalizując ryzyko błędów, które mogą zostać pominięte w testach manualnych.</b></p>
            <p>Dzięki możliwości obsługi różnych przeglądarek i platform, WebdriverIO sprawdza się zarówno w mniejszych projektach, jak i w dużych, rozbudowanych aplikacjach webowych. Framework ten jest również na bieżąco aktualizowany, co pozwala na łatwe dostosowanie go do najnowszych technologii i standardów w branży.</p>
            <p><b>WebdriverIO ułatwia testowanie interfejsu użytkownika w sposób szybki i niezawodny, zapewniając jednocześnie pełną kontrolę nad procesem testowania.</b></p>

            <CodeBlock code={testCode} />
        </div>
    );
}

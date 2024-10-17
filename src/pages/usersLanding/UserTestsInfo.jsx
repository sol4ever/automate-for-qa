import React, { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import './userTestsInfo.css';
import '../../styles/buttons.css';
import '../../styles/variables.css';

export default function UserTestsInfo() {
  const [copied, setCopied] = useState(false);

  const codeToCopy = `
describe('Strona Listy Pracowników', () => {
  it('powinna poprawnie ładować stronę listy pracowników', () => {
    browser.url('/users-landing/list');
    expect(browser).toHaveTitle('Lista Pracowników');
    const contractorList = $('#contractorList');
    expect(contractorList).toBeDisplayed();
  });

  it('powinna filtrować pracowników na podstawie wpisanego tekstu', () => {
    const searchInput = $('#searchInput');
    searchInput.setValue('Jan');
    const contractorItems = $$('.contractorListItem');
    contractorItems.forEach(item => {
      expect(item.getText()).toContain('Jan');
    });
  });

  it('powinna poprawnie wyświetlać usuniętych pracowników na liście', () => {
    browser.url('/users-landing/deleted');
    expect(browser).toHaveTitle('Lista Usuniętych Pracowników');
    const deletedContractorList = $('#deletedContractorList');
    expect(deletedContractorList).toBeDisplayed();
  });
});
  `;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="user-tests-info">
      <h2>Jak testować sekcję <b>'Pracownicy':</b></h2>
      <p>Podczas automatyzacji testów dla strony Pracownicy, ważne jest rozważenie różnych scenariuszy, aby zapewnić pełne pokrycie testami.</p>
      <p>Strony i funkcjonalności do przetestowania:</p> 
      <p>Logowanie do systemu, Edytowania danych istniejącego Pracownika, Usuwania Pracownika, Dodawania nowego Pracownika, weryfikacja Listy usuniętych Pracowników i reset aplikacji.</p>

      <h3>Scenariusze testowe wysokiego poziomiu:</h3>

      <h4>Lista Pracowników</h4>
      <p>Zweryfikuj, czy strona Listy Pracowników ładuje się poprawnie, a wszystkie elementy są wyświetlane.</p>
      <p>Upewnij się, że funkcja wyszukiwania filtruje pracowników na podstawie kryteriów wejściowych.</p>
      <p>Zweryfikuj, że kliknięcie w pracownika przenosi na stronę Szczegółów/Edytowania Pracownika.</p>
      <p>Upewnij się, że przycisk 'Dodaj nowego pracownika' przenosi do formularza nowego pracownika.</p>

      <h4>Edytowanie danych Pracownika</h4>
      <p>Zweryfikuj, czy strona Szczegółów/Edytowania Pracownika ładuje się poprawnie, z uzupełnionymi danymi pracownika.</p>
      <p>Upewnij się, że edytowanie informacji o pracowniku i zapisanie ich aktualizuje dane pracownika.</p>
      <p>Sprawdź walidacje formularza (np. pola wymagane, prawidłowy format e-maila).</p>
      <p>Upewnij się, że anulowanie edycji nie zmienia danych pracownika.</p>

      <h4>Usuwanie Pracownika</h4>
      <p>Zweryfikuj, że kliknięcie przycisku usuwania wyświetla modal z potwierdzeniem.</p>
      <p>Upewnij się, że potwierdzenie usunięcia usuwa pracownika z listy.</p>
      <p>Sprawdź, że anulowanie usunięcia nie powoduje usunięcia pracownika.</p>
      <p>Potwierdź, że po pomyślnym usunięciu, dane pracownika widoczne są na stronie Listy usuniętyuch Pracowników.</p>

      <h4>Tworzenie Nowego Pracownika</h4>
      <p>Zweryfikuj, że formularz nowego pracownika ładuje się poprawnie i zawiera wszystkie niezbędne pola.</p>
      <p>Upewnij się, że wypełnienie formularza i zapisanie tworzy nowego pracownika.</p>
      <p>Sprawdź walidacje formularza (np. pola wymagane, prawidłowy format e-maila).</p>
      <p>Upewnij się, że nowy pracownik pojawia się na liście pracowników po utworzeniu.</p>

      <h4>Lista Usuniętych Pracowników</h4>
      <p>Zweryfikuj, czy strona Listy Usuniętych Pracowników ładuje się poprawnie, a wszystkie elementy są wyświetlane.</p>
      <p>Upewnij się, że usunięci pracownicy nie są dostępni na głównej liście pracowników.</p>
      <p>Zweryfikuj, że kliknięcie w pracownika na liście usuniętych otwiera modal ze szczegółami pracownika.</p>

      <h3>Strategia automatyzacji testów:</h3>
      <p>Aby stworzyć skuteczną strategię automatyzacji testów dla tych scenariuszy, wykonaj następujące kroki:</p>
      <p><strong>Skonfiguruj WebdriverIO:</strong> Zainicjuj projekt WebdriverIO z odpowiednimi konfiguracjami.</p>
      <p><strong>Zorganizuj przypadki testowe:</strong> Stwórz osobne pliki testowe dla każdej funkcjonalności (np. UserList.test.js, NewUser.test.js, DeletedUserList.test.js, EditUser.test.js).</p>
      <p><strong>Zastosuj Model Obiektów Stron (POM):</strong> Użyj modelu POM, aby oddzielić skrypty testowe od struktury strony, co ułatwi utrzymanie kodu.</p>
      <p><strong>Napisz skrypty testowe:</strong> Zaimplementuj skrypty testowe dla każdego scenariusza, korzystając z komend i asercji WebdriverIO.</p>
      <p><strong>Uruchom testy:</strong> Użyj narzędzia do uruchamiania testów, wykonaj je i wygeneruj raporty.</p>

      <h3>Przykładowa implementacja przypadku testowego:</h3>
      <div className="code-container">
        <button className="copy-button" onClick={copyToClipboard}>
          <ContentCopyIcon />
          {copied ? " Skopiowano!" : " Kopiuj"}
        </button>
        <pre>
          <code>{codeToCopy}</code>
        </pre>
      </div>

      <p>To jest podstawowy przykład rozpoczęcia pracy z WebdriverIO do testowania strony Pracownicy. Podobne testy można napisać dla innych funkcjonalności.</p>
    </div>
  );
}

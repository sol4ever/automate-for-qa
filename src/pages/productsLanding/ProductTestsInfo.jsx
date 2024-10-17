import React, { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import './productTestsInfo.css';
import '../../styles/buttons.css';
import '../../styles/variables.css';

export default function ProductTestsInfo() {
  const [copied, setCopied] = useState(false);

  const codeToCopy = `
describe('Strona Listy Produktów', () => {
  it('powinna poprawnie ładować stronę listy produktów', () => {
    browser.url('/products-landing/list');
    expect(browser).toHaveTitle('Lista Produktów');
    const productList = $('#productList');
    expect(productList).toBeDisplayed();
  });

  it('powinna filtrować produkty na podstawie wpisanego tekstu', () => {
    const searchInput = $('#searchInput');
    searchInput.setValue('Telefon');
    const productItems = $$('.productListItem');
    productItems.forEach(item => {
      expect(item.getText()).toContain('Telefon');
    });
  });

  it('powinna poprawnie wyświetlać usunięte produkty na liście', () => {
    browser.url('/products-landing/deleted');
    expect(browser).toHaveTitle('Lista Usuniętych Produktów');
    const deletedProductList = $('#deletedProductList');
    expect(deletedProductList).toBeDisplayed();
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
    <div className="product-tests-info">
      <h2>Jak testować sekcję Produktów:</h2>
      <p>Podczas automatyzacji testów dla strony Produkty, ważne jest rozważenie różnych scenariuszy, aby zapewnić pełne pokrycie testami.</p>
      <p>Strony i funkcjonalności do przetestowania:</p> 
      <p>Logowanie do systemu, Edytowania danych istniejącego Produktu, Usuwania Produktu, Dodawania nowego Produktu, weryfikacja Listy usuniętych Produktów i reset aplikacji.</p>

      <h3>Scenariusze testowe wysokiego poziomiu:</h3>

      <h4>Lista Produktów</h4>
      <p>Zweryfikuj, czy strona Listy Produktów ładuje się poprawnie, a wszystkie elementy są wyświetlane.</p>
      <p>Upewnij się, że funkcja wyszukiwania filtruje produkty na podstawie kryteriów wejściowych.</p>
      <p>Sprawdź działanie paginacji (jeśli dotyczy).</p>
      <p>Zweryfikuj, że kliknięcie w produkt przenosi na stronę Szczegółów/Edytowania Produktu.</p>
      <p>Upewnij się, że przycisk 'Dodaj nowy produkt' przenosi do formularza nowego produktu.</p>

      <h4>Edytowanie Produktu</h4>
      <p>Zweryfikuj, czy strona Szczegółów/Edytowania Produktu ładuje się poprawnie, z uzupełnionymi danymi produktu.</p>
      <p>Upewnij się, że edytowanie informacji o produkcie i zapisanie ich aktualizuje dane produktu.</p>
      <p>Sprawdź walidacje formularza (np. pola wymagane, prawidłowy format ceny).</p>
      <p>Upewnij się, że anulowanie edycji nie zmienia danych produktu.</p>

      <h4>Usuwanie Produktu</h4>
      <p>Zweryfikuj, że kliknięcie przycisku usuwania wyświetla modal z potwierdzeniem.</p>
      <p>Upewnij się, że potwierdzenie usunięcia usuwa produkt z listy.</p>
      <p>Sprawdź, że anulowanie usunięcia nie powoduje usunięcia produktu.</p>
      <p>Potwierdź, że po pomyślnym usunięciu, dane pracownika widoczne są na stronie Listy usuniętyuch Pracowników.</p>

      <h4>Tworzenie Nowego Produktu</h4>
      <p>Zweryfikuj, że formularz nowego produktu ładuje się poprawnie i zawiera wszystkie niezbędne pola.</p>
      <p>Upewnij się, że wypełnienie formularza i zapisanie tworzy nowy produkt.</p>
      <p>Sprawdź walidacje formularza (np. pola wymagane, prawidłowy format ceny).</p>
      <p>Upewnij się, że nowy produkt pojawia się na liście po utworzeniu.</p>

      <h4>Lista Usuniętych Produktów</h4>
      <p>Zweryfikuj, czy strona Listy Usuniętych Produktów ładuje się poprawnie, a wszystkie elementy są wyświetlane.</p>
      <p>Upewnij się, że usunięte produkty nie są dostępne na głównej liście produktów.</p>
      <p>Sprawdź, czy przywrócenie produktu przenosi go z listy usuniętych na główną listę produktów.</p>
      <p>Zweryfikuj, że kliknięcie w produkt na liście usuniętych przenosi na szczegóły produktu.</p>

      <h3>Strategia automatyzacji testów:</h3>
      <p>Aby stworzyć skuteczną strategię automatyzacji testów dla tych scenariuszy, wykonaj następujące kroki:</p>
      <p><strong>Skonfiguruj WebdriverIO:</strong> Zainicjuj projekt WebdriverIO z odpowiednimi konfiguracjami.</p>
      <p><strong>Zorganizuj przypadki testowe:</strong> Stwórz osobne pliki testowe dla każdej funkcjonalności (np. ProductList.test.js, NewProduct.test.js, DeletedProductList.test.js, EditProduct.test.js).</p>
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

      <p>To jest podstawowy przykład rozpoczęcia pracy z WebdriverIO do testowania strony Listy Produktów oraz Usuniętych Produktów. Podobne testy można napisać dla innych funkcjonalności.</p>
    </div>
  );
}

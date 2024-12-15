import React from 'react';
import CodeBlock from './CodeBlock';

export default function ApplicationData() {
  const productDataCode = `
const products = [
  {
    id: "1",
    name: "Smartfon Apple iPhone 14",
    category: "Telefony komórkowe",
    subcategory: "Smartfony",
    brand: "Apple",
    price: 3999,
    inStock: "Nie",
    promoted: false,
    os: "iOS 17",
    screenSize: '6.1"',
    storage: "128 GB",
    ram: "6 GB",
    battery: "4000 mAh",
    material: "",
    color: ["czarny"],
    chargerType: "",
    applicableModel: "",
    type: "",
    img: "/images/products/iphone14.jpg",
    status: 'active'
  },
];
  `;

  const userDataCode = `
const users = [
  {
  "id": "1",
  "userName": "John Snow",
  "address": "Winterfell",
  "avatar": "/images/users/Jon_Snow.jpg",
  "email": "john.snow@gmail.com",
  "status": "aktywny",
  "title": "Software Tester",
  "fullName": "John Snow Aegon Targaryen",
  "dob": "1990-01-01",
  "widgetLgDate": "2.08.2024",
  "widgetLgAmount": "11130.00 PLN",
  "widgetLgStatus": "Zatwierdzona",
  "joinDate": "10.08.2022",
  "phone": "+48511511511",
  "currentMainProject": "Braavos web app"
}
];
  `;

  return (
    <div className="application-data">
      <p>W aplikacji dane dotyczące <strong>produktów</strong> oraz <strong>pracowników</strong> są każdorazowo wgrywane z plików (z ang. dummy data). Dane te nie są zapisywane trwale w systemie, a wszelkie zmiany wprowadzone przez użytkownika, takie jak tworzenie nowych produktów, edytowanie danych pracowników czy oznaczanie elementów jako usunięte, są przechowywane jedynie w trakcie trwania sesji.</p>

      <p>Po ponownym uruchomieniu serwera, aplikacja zostaje zresetowana, a wszystkie dane są ładowane ponownie na podstawie danych predefiniowanych w plikach <strong>dummyUsers</strong> i <strong>dummyProducts</strong>. Dzięki temu możliwe jest szybkie testowanie funkcjonalności bez konieczności zarządzania bazą danych.</p>

      <h3>Zalety takiego podejścia</h3>
      <p>Jedną z głównych zalet seedowania danych przy każdym uruchomieniu aplikacji jest <strong>bezpieczeństwo danych</strong>. Ponieważ aplikacja nie wykorzystuje prawdziwej bazy danych, ryzyko przypadkowego zapisania lub utraty wrażliwych danych jest całkowicie wyeliminowane. Jest to szczególnie ważne w aplikacjach mających na celu naukę, takich jak ta, która służy do szkolenia i testowania automatyzacji testów frontendu przy użyciu WebdriverIO.</p>

      <p>Nieutrzymywanie trwałych danych pozwala na nieograniczone i bezpieczne eksperymentowanie bez obaw o potencjalne konsekwencje nieprawidłowego działania kodu. Każdy użytkownik może wielokrotnie uruchamiać aplikację i testować różne scenariusze, bez konieczności przywracania stanu aplikacji czy usuwania błędnych danych.</p>

      <p>Dzięki wgrywaniu każdorazowo tych samych danych dla produktów i pracowników, możliwe jest wielokrotne testowanie w szerokim zakresie scenariuszy, takich jak tworzenie, edytowanie, czy usuwanie elementów- w kontrolowanych warunkach.</p>

      <p>Takie podejście do zarządzania danymi jest <strong>niskokosztowe, bezpieczne i elastyczne</strong>. Nie tylko pozwala na szybkie testowanie funkcji, ale także na pełną kontrolę nad danymi, co jest kluczowe w nauce automatyzacji testów.</p>

      <h3>Przykładowe dane dla produktów</h3>
      <p>W aplikacji zaimplementowano różnorodne produkty, w tym telefony komórkowe, akcesoria oraz ładowarki. Poniżej znajduje się przykładowy kod danych produktów:</p>

      <CodeBlock code={productDataCode} />

      <h3>Przykładowe dane dla pracowników</h3>
      <p>Analogicznie, dane dotyczące pracowników również są generowane przy każdym uruchomieniu aplikacji. Poniżej znajduje się przykład kodu dla pracowników:</p>

      <CodeBlock code={userDataCode} />

      <h3>Walidacje i zarządzanie danymi</h3>
      <p>W aplikacji dostępne są walidacje formularzy podczas tworzenia i edytowania danych produktów oraz pracowników. Walidacje obejmują m.in. sprawdzanie poprawności adresów e-mail, wymagalność pól oraz inne specyficzne zasady zależne od typu wprowadzanych danych, np. ceny produktów.</p>

      <p>Możliwe jest także oznaczanie produktów i pracowników jako "usuniętych". W praktyce oznacza to, że dane te nie są trwale usuwane, lecz jedynie oznaczane jako niedostępne w głównych listach produktów lub pracowników. W dowolnym momencie można przywrócić usunięty element do widoczności.</p>

      <p>Wszystkie dane przechowywane w aplikacji mają charakter tymczasowy. Po zresetowaniu serwera lub ponownym uruchomieniu aplikacji, wszelkie zmiany wprowadzone w trakcie sesji zostaną utracone, a dane zostaną załadowane na nowo z plików <strong>dummyUsers</strong> i <strong>dummyProducts</strong>.</p>

      <p>Dzięki temu aplikacja umożliwia szybkie testowanie różnych scenariuszy bez obaw o utratę danych rzeczywistych lub konieczność pracy na wrażliwych informacjach.</p>
    </div>
  );
}

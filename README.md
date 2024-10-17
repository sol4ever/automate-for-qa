Automate for QA

Ten projekt jest stworzony, aby ułatwić naukę automatyzacji testów dla inżynierów QA. 
Zawiera frontend zbudowany w React oraz backend oparty na Express.js. 
Backend udostępnia API REST do zarządzania produktami i użytkownikami. 
Projekt zawiera również funkcje takie jak uwierzytelnianie logowania, zarządzanie produktami i użytkownikami oraz analitykę.

Uruchamianie aplikacji:
Wymagania wstępne:
Upewnij się, że masz zainstalowane:
Node.js (z npm)
Git (do klonowania repozytorium)

Rozpoczęcie pracy:
Sklonuj repozytorium:
git clone https://github.com/sol4ever/automate-for-qa.git

Zainstaluj zależności: 
w katalogu głównym projektu uruchom:
npm install

To zainstaluje wszystkie wymagane zależności dla frontendu i backendu.

Uruchamianie lokalnie:
Aby uruchomić frontend i backend lokalnie:

Uruchom serwer backendu: 
Przejdź do katalogu app-management i uruchom:
npm start

lub

node server.js

To uruchomi backend Express.js pod adresem http://localhost:5000.

Uruchom frontend: 
W katalogu głównym uruchom:
npm start

To uruchomi frontend React pod adresem http://localhost:3000.

Konfiguracja środowiska:
Dla lokalnego środowiska ustaw w plikach .env odpowiednie adresy URL:

Frontend (src/.env):
REACT_APP_API_URL=http://localhost:5000

Backend (app-management/.env):
FRONTEND_APP_URL=http://localhost:3000
PORT=5000

Logowanie i uwierzytelnianie:
Aby uzyskać dostęp do sekcji takich jak Analityka, Produkty i Użytkownicy, musisz się zalogować. 
Nazwa użytkownika i hasło muszą mieć od 10 do 20 znaków (alfanumerycznych). 
Nie ma funkcji wylogowania; po zamknięciu przeglądarki dane sesji są usuwane.

Resetowanie danych:
Funkcja resetowania umożliwia przywrócenie początkowego stanu danych (zarówno użytkowników, jak i produktów). 
Za każdym razem, gdy sesja zostanie zresetowana, wszystkie dane zostaną przywrócone do domyślnych ustawień.

Aby zresetować dane, wyślij zapytanie na:
POST /reset
To wyczyści dane sesji dla produktów i użytkowników.

Uwagi dotyczące wdrażania:
Frontend i backend są wdrożone na tej samej platformie hostingowej (np. Render), a pliki frontendu są serwowane jako statyczne zasoby przez backend.

Polityka bezpieczeństwa treści (CSP): Projekt korzysta z rygorystycznej polityki bezpieczeństwa treści (CSP). 
Stylowanie MUI wymaga dopuszczenia stylów inline oraz zewnętrznych czcionek, ale inne zasoby muszą pochodzić z zaufanych źródeł.

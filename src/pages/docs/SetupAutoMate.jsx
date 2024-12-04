import React from 'react';
import CodeBlock from './CodeBlock';

export default function SetupAutoMate() {
    return (
        <div>
            <p><b>Wymagania wstępne:</b></p>
            <p>Przed rozpoczęciem pracy z projektem, upewnij się, że masz zainstalowaną odpowiednią wersję <b>Node.js</b></p>
            <ol>
                <li>
                    <p>W terminalu wpisz:</p>
                    <CodeBlock code={`node -v`} />
                </li>
            </ol>
            <p>Jeśli nie masz zainstalowanego Node.js, postępuj zgodnie z poniższymi krokami:</p>
            <ol>
                <li>Pobierz najnowszą wersję Node.js, która zawiera także <b>npm</b> (Node Package Manager) 
                    <a href="https://nodejs.org/en" target="_blank" rel="noopener noreferrer">
                    z oficjalnej strony Node.js
                    </a>
                </li>
                <li>Pobierz projekt AutoMate z repozytorium git:
                    <a href="https://github.com/sol4ever/automate-for-qa" target="_blank" rel="noopener noreferrer">
                        AutoMate git Repozytorium
                    </a>
                </li>
                <li>Lub użyj komendy w terminalu:</li>
                <CodeBlock code={`git clone https://github.com/sol4ever/automate-for-qa.git`} />
            </ol>

            <p><b>Aby uruchomić lokalnie aplikację AutoMate:</b></p>
            <ol>
                <li>Przejdź do katalogu głównego projektu i zainstaluj wymagane dependencies komendą:</li>
                <CodeBlock code={`npm install`} />

                <li>W katalogu głównym projektu uruchom frontend aplikacji komendą:</li>
                <CodeBlock code={`npm start`} />

                <li>Przejdź do katalogu `app-management`, aby uruchomić backend (serwer) komendą:</li>
                <CodeBlock code={`node server.js`} />
            </ol>
            <p><b>Aplikacja gotowa do testów:</b></p>
            <p>Aplikacja <b>AutoMate</b> powinna automatycznie uruchomić się w przeglądarce pod adresem:</p>
            <CodeBlock code={`http://localhost:3000/home`} />

            <p><b>Informacje o sekcjach ograniczonych:</b></p>
            <p>
                W aplikacji AutoMate dostęp do sekcji <b>Analityczne, Produkty</b> oraz <b>Pracownicy</b> jest ograniczony i wymaga logowania.
                Aby uzyskać dostęp, należy podać nazwę użytkownika oraz hasło:
            </p>
            <ul>
                <li>Nazwa użytkownika: od 10 do 20 znaków</li>
                <li>Hasło: od 10 do 20 znaków</li>
            </ul>
            <p>
                Dane logowania mogą być dowolnymi znakami o wskazanej długości. Po zamknięciu przeglądarki sesja zostaje zakończona,
                a dane zostają utracone, co oznacza, że nie ma mechanizmu wylogowania.
            </p>
            <p>
                Użytkownicy nie mają możliwości ręcznego wylogowania. Aplikacja nie przechowuje danych po zamknięciu przeglądarki.
            </p>
            <p><b>Mechanizm resetowania danych:</b></p>
            <p>
                Aplikacja posiada funkcję resetowania danych, która przywraca wszystkie dane (produktów i pracowników) do stanu początkowego.
                Mechanizm ten działa osobno dla każdej sesji użytkownika. W dowolnym momencie można zresetować dane, co spowoduje przywrócenie 
                ich do wartości domyślnych.
            </p>
            <p>Jak działa resetowanie:</p>
            <ul>
                <li>Po zalogowaniu każdy użytkownik operuje na osobnej sesji z danymi.</li>
                <li>Przycisk resetu przywraca dane produktów i pracowników do ich pierwotnej postaci.</li>
                <li>Dane są resetowane wyłącznie dla bieżącej sesji, bez wpływu na pozostałe sesje.</li>
            </ul>
            <p>
                Po zamknięciu przeglądarki dane zostają utracone, a przy ponownym otwarciu aplikacja ładuje dane początkowe.
            </p>
        </div>
    );
}

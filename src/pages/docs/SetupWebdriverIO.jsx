import React from 'react';
import CodeBlock from './CodeBlock';

export default function SetupWebdriverIO() {
    return (
        <div>
            <p><b>Wymagania wstępne:</b></p>
            <p>Przed rozpoczęciem konfiguracji projektu testowego, upewnij się, że masz zainstalowaną odpowiednią wersję <b>Node.js</b> (co najmniej v18.20.0).</p>
            <ol>
                <li>
                    <p>W terminalu wpisz, aby sprawdzić wersję Node.js:</p>
                    <CodeBlock code={`node -v`} />
                </li>
                <li>
                    <p>Jeśli nie masz zainstalowanej odpowiedniej wersji Node.js, pobierz najnowszą wersję z:</p>
                    <a href="https://nodejs.org/en" target="_blank" rel="noopener noreferrer">
                        Oficjalnej strony Node.js
                    </a>
                </li>
            </ol>

            <p><b>Kroki do uruchomienia projektu testowego:</b></p>
            <ol>
                <li>
                    <p>Przejdź do katalogu projektu <b>webdriverio_test_project</b>:</p>
                    <CodeBlock code={`cd webdriverio_test_project`} />
                </li>
                <li>
                    <p>Zainstaluj zależności projektu komendą:</p>
                    <CodeBlock code={`npm install`} />
                </li>
                <li>
                    <p>Upewnij się, że masz zainstalowaną przeglądarkę Chrome. Aby sprawdzić wersję Chrome, w terminalu lub pasku adresu wpisz:</p>
                    <CodeBlock code={`chrome://settings/help`} />
                </li>
                <li>
                    <p>Rekomendowane jest zaktualizowanie Chrome do najnowszej wersji.</p>
                </li>
                <li>
                    <p>Przejdź do pliku <b>package.json</b> w katalogu projektu <b>webdriverio_test_project</b> i sprawdź wersję <b>chromedriver</b>, która jest aktualnie używana:</p>
                    <CodeBlock code={`"chromedriver": "126.0.4",`} />
                </li>
                <li>
                    <p>Sprawdź najnowszą stabilną wersję chromedriver na stronie:</p>
                    <a href="https://www.npmjs.com/package/chromedriver?activeTab=versions" target="_blank" rel="noopener noreferrer">
                        NPM chromedriver
                    </a>
                    <p>Jeśli wersja w <b>package.json</b> różni się od najnowszej stabilnej wersji, zaktualizuj ją w pliku <b>package.json</b>, a następnie wykonaj:</p>
                    <CodeBlock code={`npm install`} />
                    <p>lub</p>
                    <CodeBlock code={`npm update`} />
                </li>
            </ol>

            <p><b>Uruchamianie testów:</b></p>
            <p>Po zainstalowaniu wszystkich wymaganych zależności, możesz uruchomić pełny pakiet testów komendą:</p>
            <CodeBlock code={`npm run test:local`} />

            <p><b>Szczegóły konfiguracji projektu:</b></p>
            <p>Szczegóły dotyczące konfiguracji projektu są dostępne w plikach <b>wdio.conf.js</b>, <b>package.json</b>, oraz <b>README.md</b> znajdujących się w katalogu <b>webdriverio_test_project</b>.</p>
            <p>Dodatkowo, więcej szczegółów na temat konfiguracji i użycia WebdriverIO znajdziesz w oficjalnej dokumentacji na stronie:
                <a href="https://webdriver.io/" target="_blank" rel="noopener noreferrer"> WebdriverIO </a>
            </p>
            <p>Możesz także skorzystać z kanału WebdriverIO na YouTube, gdzie dostępne są tutoriale wideo:
                <a href="https://www.youtube.com/@webdriverio" target="_blank" rel="noopener noreferrer">Youtube WebdriverIO</a>
            </p>
        </div>
    );
}
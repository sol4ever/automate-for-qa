import './home.css';
import bugImage from '../../images/bug.jpg';
import analiticsImage from '../../images/analitics.png'
import productsImage from '../../images/products.png'
import usersImage from '../../images/user.png'
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    const handleGetStartedClick = (event) => {
        const target = event.currentTarget.getAttribute('data-testid');

        switch (target) {
            case 'get-started-docs':
                navigate('/docs');
                break;
            case 'get-started-analytics':
                navigate('/analytics');
                break;
            case 'get-started-selectors':
                navigate('/selectors');
                break;
            case 'get-started-users':
                navigate('/users-landing/info');
                break;
            case 'get-started-products':
                navigate('/products-landing/info');
                break;
            case 'get-started-about':
                navigate('/about');
                break;
            default:
                break;
        }
    };

    return (
        <div className='home'>
            <section className='section-box'>
                <h1>poznaj AutoMate</h1>
                <img
                    decoding="async"
                    sizes="800px"
                    srcSet={bugImage}
                    src={bugImage}
                    alt="Bug illustration"
                    className="header-placeholder-image"
                />
                <h2 className="text-highlight">pobierz, uruchom, wykonaj testy</h2>
                <button className='cta-button' data-testid='get-started-docs' onClick={handleGetStartedClick}>
                    Poznaj projekt!
                </button>
            </section>
            <section className='section-box'>
                <h1>NAUKA AUTOMATYZACJI TESTÓW</h1>
                <p><b>AutoMate</b> to narzędzie edukacyjne wspierające naukę automatyzacji testów, które symuluje działanie systemów zarządzania danymi w firmie. Użytkownik startuje z automatycznie wczytaną listą pracowników i produktów, możliwą do zresetowania w dowolnym momencie.</p>

                <h2 className="text-highlight">Co znajdziesz w AutoMate?</h2>
                <p><b>AutoMate</b> składa się z trzech głównych sekcji, które symulują różne podsystemy:</p>
                <li><b>SEKCJA ANALITYCZNE</b></li>
                <li><b>SEKCJA PRACOWNICY</b></li>
                <li><b>SEKCJA PRODUKTY</b></li>

                <p>Każda z sekcji oferuje różne poziomy trudności i wyzwań, co pozwala na stopniowe doskonalenie umiejętności testowania, od odczytu danych po złożone interakcje z formularzami.</p>

                <h2 className="text-highlight">Dla kogo?</h2>
                <p><b>AutoMate</b> jest narzędziem dla testerów manualnych chcących wejść w świat automatyzacji, początkujących inżynierów automatyzacji testów i developerów zainteresowanych podniesieniem jakości w swoich projektach.</p>
                <p>Projekt umożliwia naukę w oparciu o zawarte w nim suity testowe w WebdriverIO ale pozwala na dodanie testów w innych frameworkach.</p>
                <h2 className="text-highlight">przetestuj swoje możliwości</h2>
                <button className='cta-button' data-testid='get-started-docs' onClick={handleGetStartedClick}>
                    Poznaj projekt!
                </button>
            </section>


            <section className='section-box'>
                <h1>zacznij automatyzować</h1>
                <img
                    decoding="async"
                    sizes="800px"
                    srcSet={analiticsImage}
                    src={analiticsImage}
                    alt="Bug illustration"
                    className="header-placeholder-image"
                />
                <h2 className="text-highlight">ANALITYCZNE</h2>
                <div className='text-description-box'>
                <h3 className="text-description">Umożliwia testowanie odczytu danych finansowych i HR, bez możliwości edycji bezpośrednio w sekcji.<br/>Część danych podlega zmianom wykonanym w sekcji PRACOWNICY.<br/>Sprawdź na co masz wpływ.</h3>
                </div>
                <button className='cta-button' data-testid='get-started-analytics' onClick={handleGetStartedClick}>
                    Automatyzuj!
                </button>
            </section>

            <section className='section-box'>
                <h1>wejdź w interakcję z systemem</h1>
                <img
                    decoding="async"
                    sizes="800px"
                    srcSet={usersImage}
                    src={usersImage}
                    alt="Bug illustration"
                    className="header-placeholder-image"
                />
                <h2 className="text-highlight">sekcja PRACOWNICY</h2>
                <div className='text-description-box'>
                <h3 className="text-description">Symuluje system do zarządzania pracownikami. Możesz dodawać, edytować i usuwać dane pracowników.<br/>AutoMate rozpoczyna pracę systemu z listą domyślnych pracowników wczytaną na start.</h3>
                </div>
                <button className='cta-button' data-testid='get-started-users' onClick={handleGetStartedClick}>
                    Spróbuj sam!
                </button>
            </section>

            <section className='section-box'>
                <h1>sprawdź co potrafisz</h1>
                <img
                    decoding="async"
                    sizes="800px"
                    srcSet={productsImage}
                    src={productsImage
                    }
                    alt="Bug illustration"
                    className="header-placeholder-image"
                />
                <h2 className="text-highlight">sekcja produkty</h2>
                <div className='text-description-box'>
                <h3 className="text-description">Symuluje zarządzanie produktami- assetami firmy, z możliwością ich dodawania, modyfikowania i usuwania.<br/>Tak jak w sekcji pracowników, startujesz z automatycznie wczytaną listą produktów, którą można zresetować.</h3>
                </div>
                <button className='cta-button' data-testid='get-started-products' onClick={handleGetStartedClick}>
                    Spróbuj sam!
                </button>
            </section>

            <section className='footer'>
                <h1>automatyzacja krokiem w przyszłość</h1>
                <button className='cta-button' data-testid='get-started-docs' onClick={handleGetStartedClick}>
                    Poznaj projekt!
                </button>
            </section>
        </div>
    );
}

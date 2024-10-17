import './docs.css';
import Section from './Section';
import GettingStarted from './GettingStarted';
import YouTubeChannel from './YouTubeChannel';
import SetupWebdriverIO from './SetupWebdriverIO';
import ApplicationData from './ApplicationData';
import Endpoints from './Endpoints';
import SetupAutoMate from './SetupAutoMate';

export default function Docs() {
    return (
        <div className='docs'>
        <Section title="O projekcie">
            <GettingStarted />
        </Section>
        <Section title="O WebdriverIO">
            <YouTubeChannel />
        </Section>
        <Section title="Konfiguracja aplikacji webowej AutoMate">
            <SetupAutoMate />
        </Section>
        <Section title="Konfiguracja projektu testowego">
            <SetupWebdriverIO />
        </Section>
        <Section title="Dane w aplikacji">
            <ApplicationData />
        </Section>
        <Section title="Endpointy">
            <Endpoints />
        </Section>
    </div>
    );
}

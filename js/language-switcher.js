// language-switcher.js
document.addEventListener('DOMContentLoaded', async function () {
    const languageSlider = document.getElementById('language-slider');
    let currentLanguage = CookieUtil.getCookie('language') || 'de';

    // Funktion zum Setzen des Slider-Zustands
    function setSliderState(language) {
        languageSlider.checked = language === 'en';
        if (consoleManager.getConsoleOutput()) {
            console.log(`Slider state set to ${language}`);
        }
    }

    // Wenn es ein gespeichertes Sprach-Cookie gibt, stelle den Schieberegler entsprechend ein
    setSliderState(currentLanguage);

    // Funktion zum Laden von Texten aus der Datei basierend auf der ausgewählten Sprache
    async function loadTexts(language) {
        try {
            // Überprüfe, ob eine Internetverbindung besteht
            const isOnline = navigator.onLine;

            if (!isOnline) {
                // Keine Internetverbindung, zeige den Sprachcode anstelle der Flaggen
                const offlineText = language.toUpperCase(); // Zeige den Sprachcode (EN oder DE)

                const languageElement = document.getElementById('language');
                if (languageElement) {
                    languageElement.innerHTML = offlineText;
                }

                // Verstecke die Flaggen
                const flagsElement = document.getElementById('flags');
                if (flagsElement) {
                    flagsElement.style.display = 'none';
                }

                if (consoleManager.getConsoleOutput()) {
                    console.log(`No internet connection. Displaying language code: ${offlineText}`);
                }

                return; // Beende die Funktion, wenn keine Internetverbindung besteht
            }

            // Wenn eine Internetverbindung besteht, lade die Texte normal
            if (consoleManager.getConsoleOutput()) {
                console.log('Loading texts for language:', language);
            }

            const response = await fetchTexts(language);
            const texts = await response.text();
            texts.split('\n').forEach(function (text) {
                const [key, value] = text.split('=');
                if (key && value) {
                    const element = document.getElementById(key);
                    if (element) {
                        element.innerHTML = value;
                    }
                }
            });

            if (consoleManager.getConsoleOutput()) {
                console.log(`Texts loaded successfully for language: ${language}`);
            }

            // Setze den Text für den Slider
            //setSliderText(language);
        } catch (error) {
            console.error('Fehler beim Laden der Texte:', error);
        }
    }

    // Funktion zum Fetchen der Texte für eine bestimmte Sprache
    async function fetchTexts(language) {
        try {
            // Konsolenausgabe für Debugging
            if (consoleManager.getConsoleOutput()) {
                console.log('Fetching texts for language:', language);
            }

            const response = await fetch(`/language/language-${language}.txt`);

            if (!response.ok) {
                throw new Error(`Failed to fetch language file for ${language}`);
            }

            return response;
        } catch (error) {
            throw new Error(`Error fetching language file: ${error.message}`);
        }
    }

    // Funktion zum Aktualisieren des Sprach-Cookies
    function updateLanguageCookie(language) {
        CookieUtil.setCookie('language', language, 4, { secure: true }); // Speichere die Sprache für 4 Tage
        if (consoleManager.getConsoleOutput()) {
            console.log(`Language cookie updated: ${language}`);
        }
    }

    // Überwache Änderungen am Schieberegler und speichere die Sprache als Cookie
    languageSlider.addEventListener('change', function () {
        currentLanguage = languageSlider.checked ? 'en' : 'de';

        // Aktualisiere den Text der Elemente basierend auf der ausgewählten Sprache
        loadTexts(currentLanguage);

        // Speichere die ausgewählte Sprache im Cookie
        updateLanguageCookie(currentLanguage);
    });
});
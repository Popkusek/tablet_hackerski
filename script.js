// Funkcja pobierająca i formatująca aktualny czas
function updateSystemTime() {
    // Szukamy w HTML elementu o id "os-time"
    const timeElement = document.getElementById('os-time');
    
    // Pobieramy aktualną datę i czas z systemu Twojego komputera
    const now = new Date(); 
    
    // Wyciągamy godziny i minuty. 
    // Funkcja padStart(2, '0') dodaje zero z przodu, jeśli liczba jest mniejsza niż 10 (np. "09" zamiast "9")
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    // Podmieniamy tekst w naszym elemencie na górnym pasku
    timeElement.textContent = `${hours}:${minutes}`;
}

// Uruchamiamy funkcję od razu po załadowaniu strony
updateSystemTime();

// Ustawiamy interwał, który co 1000 milisekund (1 sekunda) odpala funkcję ponownie, aby zegar na bieżąco "chodził"
setInterval(updateSystemTime, 1000);

// --- SYSTEM LOGOWANIA ---
const loginBtn = document.getElementById('login-btn');
const passInput = document.getElementById('pass-input');

// Funkcja sprawdzająca dane logowania
function attemptLogin() {
    const loginValue = document.getElementById('login-input').value;
    const passValue = passInput.value;
    const errorMsg = document.getElementById('login-error');

    // Wymagany login i hasło (możesz zmienić na co chcesz)
    if (loginValue === 'admin' && passValue === '1234') {
        errorMsg.textContent = ''; // Czyszczenie błędu
        
        // Ukrywamy panel logowania i pokazujemy główny interfejs
        document.getElementById('login-panel').style.display = 'none';
        document.getElementById('hacking-app').style.display = 'flex';
        
        // Czyścimy wpisane dane ze względów bezpieczeństwa
        document.getElementById('login-input').value = '';
        passInput.value = '';
    } else {
        errorMsg.textContent = 'ODMOWA DOSTĘPU: Nieprawidłowe dane.';
    }
}

// Reakcja na kliknięcie przycisku "ZALOGUJ"
loginBtn.addEventListener('click', attemptLogin);

// Reakcja na wciśnięcie klawisza "Enter" w polu z hasłem
passInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        attemptLogin();
    }
});
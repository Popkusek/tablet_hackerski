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
document.getElementById('login-btn').addEventListener('click', function() {
    // Pobieramy wpisane wartości
    const loginValue = document.getElementById('login-input').value;
    const passValue = document.getElementById('pass-input').value;
    const errorMsg = document.getElementById('login-error');

    // Ustawiamy proste hasło (możesz zmienić na dowolne)
    if (loginValue === 'admin' && passValue === '1234') {
        // Czyścimy błąd, ukrywamy panel logowania i pokazujemy aplikację
        errorMsg.textContent = '';
        document.getElementById('login-panel').style.display = 'none';
        document.getElementById('hacking-app').style.display = 'flex';
        
        // Czyszczenie inputów po zalogowaniu
        document.getElementById('login-input').value = '';
        document.getElementById('pass-input').value = '';
    } else {
        // Pokazujemy błąd
        errorMsg.textContent = 'ODMOWA DOSTĘPU: Nieprawidłowe dane.';
    }
});
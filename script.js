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

// --- BAZA DANYCH (localStorage) ---
// Pobieramy użytkowników z pamięci przeglądarki lub tworzymy domyślnego admina
let usersDB = JSON.parse(localStorage.getItem('fib_users')) || {
    'Popkus': { pass: '1234', isNew: false, role: 'admin' }
};
let currentUser = null; // Kto jest teraz zalogowany

function saveDB() {
    localStorage.setItem('fib_users', JSON.stringify(usersDB));
}

// --- ZARZĄDZANIE WIDOKAMI ---
const pLogin = document.getElementById('login-panel');
const pChangePass = document.getElementById('change-pass-panel');
const pApp = document.getElementById('hacking-app');
const pAdmin = document.getElementById('admin-panel');

function hideAllPanels() {
    pLogin.style.display = 'none';
    pChangePass.style.display = 'none';
    pApp.style.display = 'none';
    pAdmin.style.display = 'none';
}

// --- SYSTEM LOGOWANIA ---
const passInput = document.getElementById('pass-input');

function attemptLogin() {
    const login = document.getElementById('login-input').value.trim();
    const pass = passInput.value;
    const errorMsg = document.getElementById('login-error');

    // Sprawdzamy czy użytkownik istnieje i hasło pasuje
    if (usersDB[login] && usersDB[login].pass === pass) {
        currentUser = login; // Zapisujemy kto się zalogował
        errorMsg.textContent = '';
        
        document.getElementById('login-input').value = '';
        passInput.value = '';

        hideAllPanels();

        // Jeśli to pierwsze logowanie
        if (usersDB[login].isNew) {
            pChangePass.style.display = 'flex';
        } else {
            enterMainApp();
        }
    } else {
        errorMsg.textContent = 'ODMOWA DOSTĘPU: Nieprawidłowe dane.';
    }
}

document.getElementById('login-btn').addEventListener('click', attemptLogin);
passInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') attemptLogin(); });

// --- WEJŚCIE DO GŁÓWNEJ APLIKACJI ---
function enterMainApp() {
    hideAllPanels();
    pApp.style.display = 'flex';
    
    // Jeśli zalogował się admin, pokaż mu przycisk "ADM"
    const adminBtn = document.getElementById('open-admin-btn');
    if (usersDB[currentUser].role === 'admin') {
        adminBtn.style.display = 'block';
    } else {
        adminBtn.style.display = 'none';
    }
	// Uruchamiamy animację logowania do terminala
    playTerminalLoginAnimation();
}
// --- ANIMACJA LOGOWANIA (TERMINAL) ---
function playTerminalLoginAnimation() {
    const gameArea = document.getElementById('game-area');
    
    // Przygotowujemy czarne tło i zieloną, "informatyczną" czcionkę
    gameArea.innerHTML = `
        <div id="terminal-output" style="color: #00ff00; font-family: 'Courier New', Courier, monospace; padding: 40px; font-size: 1.1rem; text-align: left; height: 100%; display: flex; flex-direction: column; justify-content: flex-start; letter-spacing: 1px;">
        </div>
    `;
    
    const terminal = document.getElementById('terminal-output');
    
    // Teksty, które będą się pojawiać linijka po linijce
    const lines = [
        "> INICJALIZACJA SYSTEMU KIOWAN v4.0...",
        "> ZESTAWIANIE POŁĄCZENIA: ROUTER 0/7/7... [OK]",
        "> WERYFIKACJA KLUCZY AUTORYZACYJNYCH...",
        "> ODBLOKOWYWANIE ZASOBÓW LOKALNYCH... [OK]",
        "> DOSTĘP PRZYZNANY. ŁADOWANIE INTERFEJSU..."
    ];
    
    let delay = 0;
    
    // Pętla dodająca opóźnienie dla każdej linijki (symulacja ładowania)
    lines.forEach((line) => {
        setTimeout(() => {
            terminal.innerHTML += `<p style="margin-bottom: 10px; text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);">${line}</p>`;
        }, delay);
        
        // ZMIENIONY CZAS: Losowy czas oczekiwania (od 800ms do 1800ms)
        delay += Math.floor(Math.random() * 1000) + 800; 
    });
    
    // ZMIENIONY CZAS: Po wyświetleniu ostatniej linijki czekamy jeszcze 1.5 sekundy (1500ms) i ładujemy pulpit
    setTimeout(() => {
        renderDashboard();
    }, delay + 1500);
}
    
// --- ZMIANA HASŁA DLA NOWYCH ---

// Wydzielamy logikę zmiany hasła do osobnej funkcji
function changePassword() {
    const p1 = document.getElementById('new-pass-input').value;
    const p2 = document.getElementById('new-pass-confirm').value;
    const err = document.getElementById('change-pass-error');

    if (p1.length < 3) {
        err.textContent = 'Hasło musi mieć min. 3 znaki!';
        return;
    }
    if (p1 !== p2) {
        err.textContent = 'Hasła nie są identyczne!';
        return;
    }

    // Aktualizacja w bazie
    usersDB[currentUser].pass = p1;
    usersDB[currentUser].isNew = false;
    saveDB();
    
    // Czyszczenie i wejście do apki
    document.getElementById('new-pass-input').value = '';
    document.getElementById('new-pass-confirm').value = '';
    enterMainApp();
}

// Reakcja na kliknięcie przycisku
document.getElementById('save-pass-btn').addEventListener('click', changePassword);

// Reakcja na wciśnięcie "Enter" w obu polach tekstowych
document.getElementById('new-pass-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') changePassword();
});

document.getElementById('new-pass-confirm').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') changePassword();
});

// --- PANEL ADMINISTRATORA ---
document.getElementById('open-admin-btn').addEventListener('click', () => {
    hideAllPanels();
    pAdmin.style.display = 'flex';
    renderUserList();
});

document.getElementById('close-admin-btn').addEventListener('click', () => {
    enterMainApp();
});

// Dodawanie użytkownika
document.getElementById('create-user-btn').addEventListener('click', () => {
    const login = document.getElementById('add-login').value.trim();
    const pass = document.getElementById('add-pass').value.trim();

    if (!login || !pass) return alert('Wypełnij wszystkie pola!');
    if (usersDB[login]) return alert('Użytkownik już istnieje!');

    usersDB[login] = { pass: pass, isNew: true, role: 'user' };
    saveDB();
    
    document.getElementById('add-login').value = '';
    document.getElementById('add-pass').value = '';
    renderUserList();
});

// Wyświetlanie i usuwanie
function renderUserList() {
    const ul = document.getElementById('users-ul');
    ul.innerHTML = ''; // Czyścimy listę
    
    for (const user in usersDB) {
        const li = document.createElement('li');
        let roleInfo = usersDB[user].role === 'admin' ? '[ADMIN] ' : '';
        let newInfo = usersDB[user].isNew ? ' (wymaga zmiany hasła)' : '';
        
        li.innerHTML = `<span>${roleInfo}<strong>${user}</strong>${newInfo}</span>`;
        
        // Nie pozwalamy usunąć głównego admina
        if (user !== 'admin') {
            const delBtn = document.createElement('button');
            delBtn.className = 'delete-btn';
            delBtn.textContent = 'USUŃ';
            delBtn.onclick = () => {
                delete usersDB[user];
                saveDB();
                renderUserList();
            };
            li.appendChild(delBtn);
        }
        ul.appendChild(li);
    }
}
// --- MINIGRA: ZNAJDŹ I ZAPAMIĘTAJ ---
let currentLevel = 1;
let memoryTargets = [];
let memoryTimer;
let shuffleInterval; // Interwał do tasowania
let timeLeft = 60; // Globalny czas na całość (w sekundach)

// Funkcja inicjalizująca całą grę
function startMemoryGame() {
    currentLevel = 1;
    memoryTargets = [];
    timeLeft = 60; // Reset globalnego czasu
    
    clearInterval(memoryTimer);
    clearInterval(shuffleInterval);
    
    startGlobalTimer();
    startShuffleInterval();
    loadMemoryLevel(currentLevel);
}

// Ekran główny - Pulpit z kafelkami
function renderDashboard() {
    const gameArea = document.getElementById('game-area');
    
    gameArea.innerHTML = `
        <div class="dashboard-grid">
            <div class="hack-tile" id="tile-memory">
                <div class="hack-icon">🧠</div>
                <div class="hack-title">Znajdź i zapamiętaj</div>
            </div>
            
            <div class="hack-tile locked">
                <div class="hack-icon">🔒</div>
                <div class="hack-title">Wkrótce...</div>
            </div>
            
            <div class="hack-tile locked">
                <div class="hack-icon">🔒</div>
                <div class="hack-title">Wkrótce...</div>
            </div>
        </div>
    `;

    // Podpięcie nowej funkcji startującej
    document.getElementById('tile-memory').addEventListener('click', startMemoryGame);
}

// Ładowanie poziomu (1, 2 lub 3)
function loadMemoryLevel(level) {
    const target = String(Math.floor(Math.random() * 90000) + 10000);
    memoryTargets.push(target);
    
    // Obliczanie rozmiaru siatki (Poz 1: 6x6, Poz 2: 7x7, Poz 3: 8x8)
    let gridSize = level + 5; 
    let totalButtons = gridSize * gridSize;
    
    let numbers = [target];
    while(numbers.length < totalButtons) {
        let randomNum = String(Math.floor(Math.random() * 90000) + 10000);
        if(!numbers.includes(randomNum)) {
            numbers.push(randomNum);
        }
    }
    numbers.sort(() => Math.random() - 0.5);
    
    const gameArea = document.getElementById('game-area');
    
    gameArea.innerHTML = `
        <div class="memory-game-container">
            <div class="memory-header">
                <div class="memory-level">${level}/3</div>
                <div class="memory-title">Znajdź i zapamiętaj</div>
                <div class="memory-target">${target}</div>
            </div>
            <div class="memory-grid" id="memory-grid" style="grid-template-columns: repeat(${gridSize}, 1fr);"></div>
            
            <div class="memory-timer-container">
                <div class="memory-timer-bar" id="memory-timer-bar" style="width: ${(timeLeft / 60) * 100}%"></div>
            </div>
        </div>
    `;
    
    const grid = document.getElementById('memory-grid');
    numbers.forEach(num => {
        let btn = document.createElement('button');
        btn.className = 'memory-btn';
        btn.textContent = num;
        
        // Skalowanie przycisków, żeby duże siatki się zmieściły
        if(level === 2) btn.style.padding = "10px 14px";
        if(level === 3) btn.style.padding = "8px 12px";

        btn.onclick = () => {
            if(num === target) {
                if(level < 3) {
                    loadMemoryLevel(level + 1);
                } else {
                    startRecallPhase();
                }
            } else {
                endMemoryGame(false, "Kliknięto nieprawidłowy kod.");
            }
        };
        grid.appendChild(btn);
    });
}

// Faza 2: Pytanie z pamięci
function startRecallPhase() {
    const questionLevel = Math.floor(Math.random() * 3) + 1; 
    const correctAnswer = memoryTargets[questionLevel - 1]; 
    
    let options = [correctAnswer];
    while(options.length < 3) {
        let randomNum = String(Math.floor(Math.random() * 90000) + 10000);
        if(!options.includes(randomNum) && !memoryTargets.includes(randomNum)) {
            options.push(randomNum);
        }
    }
    options.sort(() => Math.random() - 0.5);
    
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = `
        <div class="memory-game-container">
            <div class="memory-header">
                <div class="memory-title" style="margin-top: 50px;">Jaki znak był w poziomie ${questionLevel}</div>
            </div>
            <div class="recall-options" id="recall-options"></div>
            
            <div class="memory-timer-container">
                <div class="memory-timer-bar" id="memory-timer-bar" style="width: ${(timeLeft / 60) * 100}%"></div>
            </div>
        </div>
    `;
    
    const optionsContainer = document.getElementById('recall-options');
    options.forEach(opt => {
        let btn = document.createElement('button');
        btn.className = 'memory-btn';
        btn.textContent = opt;
        btn.onclick = () => {
            if(opt === correctAnswer) {
                endMemoryGame(true, "DOSTĘP PRZYZNANY");
            } else {
                endMemoryGame(false, "Błędna odpowiedź. Odrzucono.");
            }
        }
        optionsContainer.appendChild(btn);
    });
}

// --- NOWE LOGIKI CZASU I TASOWANIA ---

// Globalny zegar na całą grę (60 sekund)
function startGlobalTimer() {
    memoryTimer = setInterval(() => {
        timeLeft -= 0.05; // Spadek co 50ms (dla płynnej animacji)
        
        const bar = document.getElementById('memory-timer-bar');
        if (bar) {
            bar.style.width = (timeLeft / 60) * 100 + "%";
        }
        
        if(timeLeft <= 0) {
            endMemoryGame(false, "Czas minął.");
        }
    }, 50); 
}

// Funkcja tasująca elementy co 5 sekund
function startShuffleInterval() {
    shuffleInterval = setInterval(() => {
        // Tasowanie siatki (jeśli istnieje)
        const grid = document.getElementById('memory-grid');
        if (grid) {
            const btns = Array.from(grid.children);
            btns.sort(() => Math.random() - 0.5);
            btns.forEach(btn => grid.appendChild(btn)); 
        }
        
        // Tasowanie opcji pamięciowych (jeśli jesteśmy w fazie finałowej)
        const options = document.getElementById('recall-options');
        if (options) {
            const btns = Array.from(options.children);
            btns.sort(() => Math.random() - 0.5);
            btns.forEach(btn => options.appendChild(btn));
        }
    }, 5000); 
}

// Koniec gry (Wygrana / Przegrana)
function endMemoryGame(win, msg) {
    clearInterval(memoryTimer); // Zatrzymujemy czas
    clearInterval(shuffleInterval); // Zatrzymujemy tasowanie
    
    const gameArea = document.getElementById('game-area');
    const color = win ? "#00ff00" : "#ff3333";
    
    gameArea.innerHTML = `
        <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%;">
            <h2 style="color:${color}; font-size:2.5rem; letter-spacing:2px;">${win ? 'SUKCES' : 'PORAŻKA'}</h2>
            <p style="color:#888; margin-top:10px;">${msg}</p>
        </div>
    `;
    
    // Powrót do pulpitu po 3 sekundach
    setTimeout(renderDashboard, 3000);
}
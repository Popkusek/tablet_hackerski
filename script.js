// --- INTEGRALNY SYSTEM OPERACYJNY TABLETU (FIB OS) ---

// 1. ZEGAR SYSTEMOWY
function updateSystemTime() {
    const timeElement = document.getElementById('os-time');
    if (!timeElement) return;
    const now = new Date(); 
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}`;
}
updateSystemTime();
setInterval(updateSystemTime, 1000);

// 2. BAZA UŻYTKOWNIKÓW (localStorage)
let usersDB = JSON.parse(localStorage.getItem('fib_users')) || {
    'Popkus': { pass: '1234', isNew: false, role: 'admin' }
};
let currentUser = null;

function saveDB() {
    localStorage.setItem('fib_users', JSON.stringify(usersDB));
}

// 3. WIDOKI I PANALE
const pLogin = document.getElementById('login-panel');
const pChangePass = document.getElementById('change-pass-panel');
const pApp = document.getElementById('hacking-app');
const pAdmin = document.getElementById('admin-panel');

function hideAllPanels() {
    if(pLogin) pLogin.style.display = 'none';
    if(pChangePass) pChangePass.style.display = 'none';
    if(pApp) pApp.style.display = 'none';
    if(pAdmin) pAdmin.style.display = 'none';
}

// 4. AUTORYZACJA I LOGOWANIE
const passInput = document.getElementById('pass-input');

function attemptLogin() {
    const loginInputElem = document.getElementById('login-input');
    if (!loginInputElem || !passInput) return;
    
    const login = loginInputElem.value.trim();
    const pass = passInput.value;
    const errorMsg = document.getElementById('login-error');

    if (usersDB[login] && usersDB[login].pass === pass) {
        currentUser = login;
        if(errorMsg) errorMsg.textContent = '';
        
        loginInputElem.value = '';
        passInput.value = '';

        hideAllPanels();

        if (usersDB[login].isNew) {
            if(pChangePass) pChangePass.style.display = 'flex';
        } else {
            enterMainApp();
        }
    } else {
        if(errorMsg) errorMsg.textContent = 'ODMOWA DOSTĘPU: Nieprawidłowe dane.';
    }
}

const loginBtn = document.getElementById('login-btn');
if(loginBtn) loginBtn.addEventListener('click', attemptLogin);
if(passInput) passInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') attemptLogin(); });

// 5. PRZEJŚCIE DO PULPITU I ANIMACJA TERMINALA
function enterMainApp() {
    hideAllPanels();
    if(pApp) pApp.style.display = 'flex';
    
    const adminBtn = document.getElementById('open-admin-btn');
    if (adminBtn) {
        if (usersDB[currentUser] && usersDB[currentUser].role === 'admin') {
            adminBtn.style.display = 'block';
        } else {
            adminBtn.style.display = 'none';
        }
    }
    playTerminalLoginAnimation();
}

function playTerminalLoginAnimation() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    
    gameArea.innerHTML = `
        <div id="terminal-output" style="color: #00ff00; font-family: 'Courier New', Courier, monospace; padding: 40px; font-size: 1.1rem; text-align: left; height: 100%; display: flex; flex-direction: column; justify-content: flex-start; letter-spacing: 1px;">
        </div>
    `;
    
    const terminal = document.getElementById('terminal-output');
    const lines = [
        "> INICJALIZACJA SYSTEMU KIOWAN v4.0...",
        "> ZESTAWIANIE POŁĄCZENIA: ROUTER 0/7/7... [OK]",
        "> WERYFIKACJA KLUCZY AUTORYZACYJNYCH...",
        "> ODBLOKOWYWANIE ZASOBÓW LOKALNYCH... [OK]",
        "> DOSTĘP PRZYZNANY. ŁADOWANIE INTERFEJSU..."
    ];
    
    let delay = 0;
    lines.forEach((line) => {
        setTimeout(() => {
            if(terminal) terminal.innerHTML += `<p style="margin-bottom: 10px; text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);">${line}</p>`;
        }, delay);
        delay += Math.floor(Math.random() * 1000) + 800; 
    });
    
    setTimeout(() => {
        renderMainDashboard();
    }, delay + 1500);
}

// 6. PANEL GŁÓWNY (DESKTOP)
function renderMainDashboard() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    
    const headerH1 = document.querySelector('.app-header h1');
    if(headerH1) headerH1.innerHTML = '&gt; FIB';
    
    gameArea.innerHTML = `
        <div class="dashboard-grid">
            <div class="hack-tile" id="app-hacks">
                <div class="hack-icon">☠️</div>
                <div class="hack-title">FIB::HACK_MODULE</div>
            </div>
            <div class="hack-tile" id="app-database">
                <div class="hack-icon">🗄️</div>
                <div class="hack-title">FIB::DATABASE</div>
            </div>
            <div class="hack-tile" id="app-calculator">
                <div class="hack-icon">🧮</div>
                <div class="hack-title">FIB::CALCULATOR</div>
            </div>
        </div>
    `;

    const btnHacks = document.getElementById('app-hacks');
    const btnDb = document.getElementById('app-database');
    if(btnHacks) btnHacks.addEventListener('click', renderHackMenu);
    if(btnDb) btnDb.addEventListener('click', renderDatabase);
	const btnCalc = document.getElementById('app-calculator');
    if(btnCalc) btnCalc.addEventListener('click', renderCalculator);
}

// 7. MODUŁ HAKERSKI - MENU
function renderHackMenu() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    
    const headerH1 = document.querySelector('.app-header h1');
    if(headerH1) headerH1.innerHTML = '&gt; FIB::HACK_SELECT';
    
    gameArea.innerHTML = `
        <div style="margin-bottom: 10px; text-align: left; padding-left: 40px;">
            <button id="back-btn" style="padding: 8px 15px; background: #222; color: #aaa; border: 1px solid #444; cursor: pointer; border-radius: 3px; font-weight: bold;">&lt; POWRÓT</button>
        </div>
        <div class="dashboard-grid" style="padding-top: 10px;">
            <div class="hack-tile" id="tile-memory">
                <div class="hack-icon">🧠</div>
                <div class="hack-title">Znajdź i zapamiętaj</div>
            </div>
            <div class="hack-tile locked">
                <div class="hack-icon">🔒</div>
                <div class="hack-title">Wkrótce...</div>
            </div>
        </div>
    `;

    const tileMemory = document.getElementById('tile-memory');
    const backBtn = document.getElementById('back-btn');
    if(tileMemory) tileMemory.addEventListener('click', startMemoryGame);
    if(backBtn) backBtn.addEventListener('click', renderMainDashboard);
}

// 8. BAZA DANYCH NOTATEK (localStorage)
let notesDB = JSON.parse(localStorage.getItem('fib_notes')) || [];
const DB_PASSWORD = "7777";

function saveNotes() {
    localStorage.setItem('fib_notes', JSON.stringify(notesDB));
}

function renderDatabase() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    
    const headerH1 = document.querySelector('.app-header h1');
    if(headerH1) headerH1.innerHTML = '&gt; FIB::DATABASE';

    gameArea.innerHTML = `
        <div style="margin-bottom: 20px; text-align: left; padding-left: 40px;">
            <button id="back-btn" style="padding: 8px 15px; background: #222; color: #aaa; border: 1px solid #444; cursor: pointer; border-radius: 3px; font-weight: bold;">&lt; POWRÓT</button>
        </div>
        <div class="db-login-box">
            <h3>KRYPTOGRAFICZNA BLOKADA</h3>
            <input type="password" id="db-pass-input" placeholder="WPROWADŹ HASŁO BAZY" autocomplete="off">
            <button id="db-login-btn">DEKODUJ REPOZYTORIUM</button>
            <p id="db-error" style="color: #ff3333; font-weight: bold; margin-top: 12px; font-size: 0.9rem;"></p>
        </div>
    `;

    const backBtn = document.getElementById('back-btn');
    if(backBtn) backBtn.addEventListener('click', renderMainDashboard);
    
    const passIn = document.getElementById('db-pass-input');
    const dbLoginBtn = document.getElementById('db-login-btn');
    
    function checkDbPass() {
        if (passIn && passIn.value === DB_PASSWORD) {
            renderDatabaseContent();
        } else {
            const dbError = document.getElementById('db-error');
            if(dbError) dbError.textContent = "ODMOWA DOSTĘPU: Błędny klucz szyfrujący.";
        }
    }

    if(dbLoginBtn) dbLoginBtn.addEventListener('click', checkDbPass);
    if(passIn) passIn.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkDbPass(); });
}

function renderDatabaseContent() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    
    const headerH1 = document.querySelector('.app-header h1');
    if(headerH1) headerH1.innerHTML = '&gt; FIB::DATABASE';

    const isAdmin = usersDB[currentUser] && usersDB[currentUser].role === 'admin';
    let adminButtonHtml = isAdmin ? `<button id="add-note-btn" class="admin-note-btn">[+] UTWÓRZ WPIS</button>` : '';

    gameArea.innerHTML = `
        <div class="notes-controls">
            <button id="back-btn" style="padding: 8px 15px; background: #222; color: #aaa; border: 1px solid #444; cursor: pointer; border-radius: 3px; font-weight: bold;">&lt; POWRÓT</button>
            ${adminButtonHtml}
        </div>
        <div class="notes-grid" id="notes-grid"></div>
    `;

    const backBtn = document.getElementById('back-btn');
    if(backBtn) backBtn.addEventListener('click', renderMainDashboard);

    if (isAdmin) {
        const addNoteBtn = document.getElementById('add-note-btn');
        if(addNoteBtn) addNoteBtn.addEventListener('click', renderNoteForm);
    }

    renderNotesTiles();
}

function renderNotesTiles() {
    const grid = document.getElementById('notes-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (notesDB.length === 0) {
        grid.innerHTML = `<p style="color: #666; grid-column: 1/-1; text-align: center; margin-top: 50px; font-family: 'Courier New', monospace; font-size: 1.2rem; letter-spacing: 2px; text-shadow: none;">&gt; SYSTEM_FIB: BRAK ZAPISANYCH REKORDÓW_</p>`;
        return;
    }

    notesDB.forEach((note, index) => {
        const tile = document.createElement('div');
        tile.className = 'note-tile';
        tile.textContent = note.title;
        tile.onclick = () => {
            // Przekazujemy również INDEX (numer) notatki
            viewNoteDetail(note, index);
        };
        grid.appendChild(tile);
    });
}

function renderNoteForm() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    
    const headerH1 = document.querySelector('.app-header h1');
    if(headerH1) headerH1.innerHTML = '&gt; FIB::DATABASE';
    
    gameArea.innerHTML = `
        <div class="note-form">
            <h3>NOWY REKORD OPERACYJNY</h3>
            <input type="text" id="note-title" placeholder="Wprowadź tytuł notatki..." autocomplete="off">
            <textarea id="note-content" placeholder="Wprowadź tajną zawartość wpisu..."></textarea>
            <div class="form-btns">
                <button class="btn-save" id="note-save-btn">GENERUJ KAFELEK</button>
                <button class="btn-cancel" id="note-cancel-btn">ANULUJ</button>
            </div>
        </div>
    `;

    const cancelBtn = document.getElementById('note-cancel-btn');
    const saveBtn = document.getElementById('note-save-btn');
    
    if(cancelBtn) cancelBtn.addEventListener('click', renderDatabaseContent);
    if(saveBtn) saveBtn.addEventListener('click', () => {
        const titleInput = document.getElementById('note-title');
        const contentInput = document.getElementById('note-content');
        if(!titleInput || !contentInput) return;
        
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (!title || !content) return alert('Wszystkie pola formularza muszą zostać uzupełnione!');

        notesDB.push({ title, content });
        saveNotes();
        renderDatabaseContent();
    });
}

// ZAKTUALIZOWANY PODGLĄD NOTATKI (Z PRZYCISKAMI ADMINA)
function viewNoteDetail(note, index) {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    
    const headerH1 = document.querySelector('.app-header h1');
    if(headerH1) headerH1.innerHTML = '&gt; FIB::DATABASE';

    // Sprawdzamy, czy zalogowany użytkownik jest adminem
    const isAdmin = usersDB[currentUser] && usersDB[currentUser].role === 'admin';
    let adminControls = '';
    
    // Jeśli tak, generujemy przyciski EDYTUJ i USUŃ
    if (isAdmin) {
        adminControls = `
            <button id="edit-note-btn" style="padding: 8px 15px; background: #ccaa00; color: #111; border: none; cursor: pointer; border-radius: 3px; font-weight: bold; margin-left: 10px;">EDYTUJ</button>
            <button id="delete-note-btn" style="padding: 8px 15px; background: #ff3333; color: #111; border: none; cursor: pointer; border-radius: 3px; font-weight: bold; margin-left: 10px;">USUŃ</button>
        `;
    }
    
    gameArea.innerHTML = `
        <div style="margin-bottom: 20px; text-align: left; padding-left: 40px; display: flex; align-items: center;">
            <button id="back-to-db-btn" style="padding: 8px 15px; background: #222; color: #aaa; border: 1px solid #444; cursor: pointer; border-radius: 3px; font-weight: bold;">&lt; WSTECZ DO BAZY</button>
            ${adminControls}
        </div>
        <div style="padding: 0 40px; color: #eee; font-family: sans-serif; text-align: left;">
            <h2 style="color: #00ff00; border-bottom: 1px solid #333; padding-bottom: 10px; letter-spacing: 1px; font-weight: bold;">${note.title}</h2>
            <p style="margin-top: 20px; white-space: pre-wrap; line-height: 1.6; color: #ccc; font-size: 1.05rem;">${note.content}</p>
        </div>
    `;
    const backToDbBtn = document.getElementById('back-to-db-btn');
    if(backToDbBtn) backToDbBtn.addEventListener('click', renderDatabaseContent);

    // Podpinamy funkcje pod przyciski admina (jeśli istnieją)
    if (isAdmin) {
        // Logika usuwania
        document.getElementById('delete-note-btn').addEventListener('click', () => {
            if(confirm('Czy na pewno chcesz trwale usunąć ten rekord z bazy FIB?')) {
                notesDB.splice(index, 1); // Usuwa 1 element pod danym indeksem
                saveNotes();
                renderDatabaseContent(); // Powrót do kafelków
            }
        });

        // Logika edycji (otwiera nowy formularz)
        document.getElementById('edit-note-btn').addEventListener('click', () => {
            renderEditNoteForm(index);
        });
    }
}

// NOWA FUNKCJA: FORMULARZ EDYCJI ISTNIEJĄCEJ NOTATKI
function renderEditNoteForm(index) {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    
    const headerH1 = document.querySelector('.app-header h1');
    if(headerH1) headerH1.innerHTML = '&gt; FIB::DATABASE';
    
    const note = notesDB[index];

    gameArea.innerHTML = `
        <div class="note-form">
            <h3>EDYCJA REKORDU</h3>
            <input type="text" id="edit-note-title" value="${note.title}" autocomplete="off">
            <textarea id="edit-note-content">${note.content}</textarea>
            <div class="form-btns">
                <button class="btn-save" id="edit-save-btn">ZAPISZ ZMIANY</button>
                <button class="btn-cancel" id="edit-cancel-btn">ANULUJ</button>
            </div>
        </div>
    `;

    // Anulowanie wraca do podglądu tej konkretnej notatki
    document.getElementById('edit-cancel-btn').addEventListener('click', () => {
        viewNoteDetail(notesDB[index], index);
    });

    // Zapisywanie zmian i nadpisywanie bazy
    document.getElementById('edit-save-btn').addEventListener('click', () => {
        const titleInput = document.getElementById('edit-note-title');
        const contentInput = document.getElementById('edit-note-content');
        if(!titleInput || !contentInput) return;
        
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (!title || !content) return alert('Wypełnij wszystkie pola!');

        // Zamiast push (dodawania nowej), nadpisujemy starą pod konkretnym indeksem
        notesDB[index] = { title, content };
        saveNotes();
        viewNoteDetail(notesDB[index], index); // Zmiany zapisane, pokaż nowy podgląd
    });
}

// 9. ZMIANA HASŁA DLA NOWYCH KONTEKSTÓW
function changePassword() {
    const p1Input = document.getElementById('new-pass-input');
    const p2Input = document.getElementById('new-pass-confirm');
    const err = document.getElementById('change-pass-error');
    if(!p1Input || !p2Input || !err) return;

    const p1 = p1Input.value;
    const p2 = p2Input.value;

    if (p1.length < 3) {
        err.textContent = 'Hasło musi mieć min. 3 znaki!';
        return;
    }
    if (p1 !== p2) {
        err.textContent = 'Hasła nie są identyczne!';
        return;
    }

    if(usersDB[currentUser]) {
        usersDB[currentUser].pass = p1;
        usersDB[currentUser].isNew = false;
        saveDB();
    }
    
    p1Input.value = '';
    p2Input.value = '';
    enterMainApp();
}

const savePassBtn = document.getElementById('save-pass-btn');
if(savePassBtn) savePassBtn.addEventListener('click', changePassword);

const newPassInput = document.getElementById('new-pass-input');
const newPassConfirm = document.getElementById('new-pass-confirm');
if(newPassInput) newPassInput.addEventListener('keypress', function(event) { if (event.key === 'Enter') changePassword(); });
if(newPassConfirm) newPassConfirm.addEventListener('keypress', function(event) { if (event.key === 'Enter') changePassword(); });

// 10. PANEL ADMINISTRATORA - ZARZĄDZANIE KONTY
const openAdminBtn = document.getElementById('open-admin-btn');
const closeAdminBtn = document.getElementById('close-admin-btn');
if(openAdminBtn) openAdminBtn.addEventListener('click', () => { hideAllPanels(); if(pAdmin) pAdmin.style.display = 'flex'; renderUserList(); });
if(closeAdminBtn) closeAdminBtn.addEventListener('click', enterMainApp);

const createUserBtn = document.getElementById('create-user-btn');
if(createUserBtn) createUserBtn.addEventListener('click', () => {
    const addLoginInput = document.getElementById('add-login');
    const addPassInput = document.getElementById('add-pass');
    if(!addLoginInput || !addPassInput) return;
    
    const login = addLoginInput.value.trim();
    const pass = addPassInput.value.trim();

    if (!login || !pass) return alert('Wypełnij wszystkie pola!');
    if (usersDB[login]) return alert('Użytkownik już istnieje!');

    usersDB[login] = { pass: pass, isNew: true, role: 'user' };
    saveDB();
    
    addLoginInput.value = '';
    addPassInput.value = '';
    renderUserList();
});

function renderUserList() {
    const ul = document.getElementById('users-ul');
    if(!ul) return;
    ul.innerHTML = ''; 
    
    for (const user in usersDB) {
        const li = document.createElement('li');
        let roleInfo = usersDB[user].role === 'admin' ? '[ADMIN] ' : '';
        let newInfo = usersDB[user].isNew ? ' (wymaga zmiany hasła)' : '';
        
        li.innerHTML = `<span>${roleInfo}<strong>${user}</strong>${newInfo}</span>`;
        
        if (user !== 'admin' && user !== 'Popkus') { 
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

// 11. MINIGRA LOGIKA (ZNAJDŹ I ZAPAMIĘTAJ)
let currentLevel = 1;
let memoryTargets = [];
let memoryTimer;
let shuffleInterval; 
let timeLeft = 60; 

function startMemoryGame() {
    currentLevel = 1;
    memoryTargets = [];
    timeLeft = 60; 
    
    clearInterval(memoryTimer);
    clearInterval(shuffleInterval);
    
    startGlobalTimer();
    startShuffleInterval();
    loadMemoryLevel(currentLevel);
}

function loadMemoryLevel(level) {
    const target = String(Math.floor(Math.random() * 90000) + 10000);
    memoryTargets.push(target);
    
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
    if(!gameArea) return;
    
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
    if(!grid) return;
    
    numbers.forEach(num => {
        let btn = document.createElement('button');
        btn.className = 'memory-btn';
        btn.textContent = num;
        
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
    if(!gameArea) return;
    
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
    if(!optionsContainer) return;
    
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

function startGlobalTimer() {
    memoryTimer = setInterval(() => {
        timeLeft -= 0.05; 
        const bar = document.getElementById('memory-timer-bar');
        if (bar) {
            bar.style.width = (timeLeft / 60) * 100 + "%";
        }
        if(timeLeft <= 0) {
            endMemoryGame(false, "Czas minął.");
        }
    }, 50); 
}

function startShuffleInterval() {
    shuffleInterval = setInterval(() => {
        const grid = document.getElementById('memory-grid');
        if (grid) {
            const btns = Array.from(grid.children);
            btns.sort(() => Math.random() - 0.5);
            btns.forEach(btn => grid.appendChild(btn)); 
        }
        const options = document.getElementById('recall-options');
        if (options) {
            const btns = Array.from(options.children);
            btns.sort(() => Math.random() - 0.5);
            btns.forEach(btn => options.appendChild(btn));
        }
    }, 5000); 
}

function endMemoryGame(win, msg) {
    clearInterval(memoryTimer); 
    clearInterval(shuffleInterval); 
    
    const gameArea = document.getElementById('game-area');
    if(!gameArea) return;
    
    const color = win ? "#00ff00" : "#ff3333";
    gameArea.innerHTML = `
        <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%;">
            <h2 style="color:${color}; font-size:2.5rem; letter-spacing:2px;">${win ? 'SUKCES' : 'PORAŻKA'}</h2>
            <p style="color:#888; margin-top:10px;">${msg}</p>
        </div>
    `;
    setTimeout(renderHackMenu, 3000);
}
// 12. APLIKACJA: HACKCONNECT SOLVER (Łamacz matryc)
let mathMode = 'standard'; 

function renderCalculator() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    
    const headerH1 = document.querySelector('.app-header h1');
    if(headerH1) headerH1.innerHTML = '&gt; FIB::DECRYPT_MATRIX';
    
    // Szablon rozwijanej listy (X odpowiada za mnożenie)
    const opSelect = `
        <select class="s-op">
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">X</option>
            <option value="/">/</option>
        </select>
    `;

    gameArea.innerHTML = `
        <div style="margin-bottom: 10px; text-align: left; padding-left: 40px;">
            <button id="back-btn" style="padding: 8px 15px; background: #222; color: #aaa; border: 1px solid #444; cursor: pointer; border-radius: 3px; font-weight: bold;">&lt; POWRÓT</button>
        </div>
        
        <div class="solver-container">
            <div class="solver-grid">
                <div></div>
                <input type="text" class="s-target" id="t0" value="" autocomplete="off" maxlength="3">
                <div></div>
                <input type="text" class="s-target" id="t1" value="" autocomplete="off" maxlength="3">
                <div></div>
                <input type="text" class="s-target" id="t2" value="" autocomplete="off" maxlength="3">
                
                <input type="text" class="s-target" id="l0" value="" autocomplete="off" maxlength="3">
                <div class="s-cell" id="o0">?</div>
                ${opSelect.replace('class="s-op"', 'class="s-op" id="h0"')}
                <div class="s-cell" id="o1">?</div>
                ${opSelect.replace('class="s-op"', 'class="s-op" id="h1"')}
                <div class="s-cell" id="o2">?</div>

                <div></div>
                ${opSelect.replace('class="s-op"', 'class="s-op" id="v0"')}
                <div></div>
                ${opSelect.replace('class="s-op"', 'class="s-op" id="v1"')}
                <div></div>
                ${opSelect.replace('class="s-op"', 'class="s-op" id="v2"')}

                <input type="text" class="s-target" id="l1" value="" autocomplete="off" maxlength="3">
                <div class="s-cell" id="o3">?</div>
                ${opSelect.replace('class="s-op"', 'class="s-op" id="h2"')}
                <div class="s-cell" id="o4">?</div>
                ${opSelect.replace('class="s-op"', 'class="s-op" id="h3"')}
                <div class="s-cell" id="o5">?</div>

                <div></div>
                ${opSelect.replace('class="s-op"', 'class="s-op" id="v3"')}
                <div></div>
                ${opSelect.replace('class="s-op"', 'class="s-op" id="v4"')}
                <div></div>
                ${opSelect.replace('class="s-op"', 'class="s-op" id="v5"')}

                <input type="text" class="s-target" id="l2" value="" autocomplete="off" maxlength="3">
                <div class="s-cell" id="o6">?</div>
                ${opSelect.replace('class="s-op"', 'class="s-op" id="h4"')}
                <div class="s-cell" id="o7">?</div>
                ${opSelect.replace('class="s-op"', 'class="s-op" id="h5"')}
                <div class="s-cell" id="o8">?</div>
            </div>
            
            <div class="solver-controls">
                <button class="btn-mode" id="mode-btn" onclick="toggleMathMode()">TRYB: MATEMATYCZNY (BODMAS)</button>
                <button class="btn-solve" onclick="solveHackConnect()">ROZWIĄŻ MATRYCĘ</button>
            </div>
        </div>
    `;
    
    document.getElementById('back-btn').addEventListener('click', renderMainDashboard);
}

window.toggleMathMode = function() {
    const btn = document.getElementById('mode-btn');
    if (mathMode === 'standard') {
        mathMode = 'seq';
        btn.innerText = "TRYB: LINIOWY (OD LEWEJ DO PRAWEJ)";
    } else {
        mathMode = 'standard';
        btn.innerText = "TRYB: MATEMATYCZNY (BODMAS)";
    }
};

function evalMath(a, op1, b, op2, c) {
    let res;
    if (mathMode === 'standard') {
        res = Function('"use strict";return (' + a + op1 + b + op2 + c + ')')();
    } else {
        let step1 = Function('"use strict";return (' + a + op1 + b + ')')();
        res = Function('"use strict";return (' + step1 + op2 + c + ')')();
    }
    return Number.isInteger(res) ? res : 999999; 
}

window.solveHackConnect = function() {
    // Pobieramy wpisane cele
    const t = [parseInt(document.getElementById('t0').value), parseInt(document.getElementById('t1').value), parseInt(document.getElementById('t2').value)];
    const l = [parseInt(document.getElementById('l0').value), parseInt(document.getElementById('l1').value), parseInt(document.getElementById('l2').value)];
    
    // Walidacja - upewniamy się, że wszystkie zielone pola są wypełnione
    if (t.some(isNaN) || l.some(isNaN)) {
        alert("SYSTEM FIB: Uzupełnij wszystkie zielone pola z liczbami (cele) przed rozpoczęciem łamania!");
        return;
    }

    // Pobieramy operatory z rozwijanej listy (zwraca "+", "-", "*", "/")
    const h = [document.getElementById('h0').value, document.getElementById('h1').value, document.getElementById('h2').value, document.getElementById('h3').value, document.getElementById('h4').value, document.getElementById('h5').value];
    const v = [document.getElementById('v0').value, document.getElementById('v1').value, document.getElementById('v2').value, document.getElementById('v3').value, document.getElementById('v4').value, document.getElementById('v5').value];

    for(let i=0; i<9; i++) {
        let cell = document.getElementById('o'+i);
        cell.textContent = "⚙️";
        cell.classList.remove('solved');
    }

    let validRows = [[], [], []];
    for (let i = 1; i <= 9; i++) {
        for (let j = 1; j <= 9; j++) {
            for (let k = 1; k <= 9; k++) {
                if (evalMath(i, h[0], j, h[1], k) === l[0]) validRows[0].push([i, j, k]);
                if (evalMath(i, h[2], j, h[3], k) === l[1]) validRows[1].push([i, j, k]);
                if (evalMath(i, h[4], j, h[5], k) === l[2]) validRows[2].push([i, j, k]);
            }
        }
    }

    for (let r0 of validRows[0]) {
        for (let r1 of validRows[1]) {
            for (let r2 of validRows[2]) {
                if (evalMath(r0[0], v[0], r1[0], v[3], r2[0]) === t[0] &&
                    evalMath(r0[1], v[1], r1[1], v[4], r2[1]) === t[1] &&
                    evalMath(r0[2], v[2], r1[2], v[5], r2[2]) === t[2]) {
                    
                    const answers = [...r0, ...r1, ...r2];
                    for(let i=0; i<9; i++) {
                        let cell = document.getElementById('o'+i);
                        cell.textContent = answers[i];
                        cell.classList.add('solved');
                    }
                    return; 
                }
            }
        }
    }

    alert("SYSTEM FIB: Błąd matrycy! Sprawdź, czy dobrze przepisałeś operatory i liczby.");
    for(let i=0; i<9; i++) document.getElementById('o'+i).textContent = "X";
};
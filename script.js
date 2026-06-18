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
    if(headerH1) headerH1.innerHTML = '&gt; FIB::OS_MAIN_DESKTOP';
    
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
            <div class="hack-tile locked">
                <div class="hack-icon">📡</div>
                <div class="hack-title">FIB::TRACKING</div>
            </div>
        </div>
    `;

    const btnHacks = document.getElementById('app-hacks');
    const btnDb = document.getElementById('app-database');
    if(btnHacks) btnHacks.addEventListener('click', renderHackMenu);
    if(btnDb) btnDb.addEventListener('click', renderDatabase);
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
    if(headerH1) headerH1.innerHTML = '&gt; FIB::DATABASE_SECURE_AUTH';

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
    if(headerH1) headerH1.innerHTML = '&gt; FIB::SECURE_DATABASE_DRIVE';

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
            viewNoteDetail(note);
        };
        grid.appendChild(tile);
    });
}

function renderNoteForm() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    
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

function viewNoteDetail(note) {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    
    gameArea.innerHTML = `
        <div style="margin-bottom: 20px; text-align: left; padding-left: 40px;">
            <button id="back-to-db-btn" style="padding: 8px 15px; background: #222; color: #aaa; border: 1px solid #444; cursor: pointer; border-radius: 3px; font-weight: bold;">&lt; WSTECZ DO BAZY</button>
        </div>
        <div style="padding: 0 40px; color: #eee; font-family: sans-serif; text-align: left;">
            <h2 style="color: #00ff00; border-bottom: 1px solid #333; padding-bottom: 10px; letter-spacing: 1px; font-weight: bold;">${note.title}</h2>
            <p style="margin-top: 20px; white-space: pre-wrap; line-height: 1.6; color: #ccc; font-size: 1.05rem;">${note.content}</p>
        </div>
    `;
    const backToDbBtn = document.getElementById('back-to-db-btn');
    if(backToDbBtn) backToDbBtn.addEventListener('click', renderDatabaseContent);
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
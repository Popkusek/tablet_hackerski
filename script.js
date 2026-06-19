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

// 8. SYSTEM FOLDERÓW I AKTA (localStorage)
let foldersDB = JSON.parse(localStorage.getItem('fib_folders')) || [];
const DB_PASSWORD = "7777";

function saveFolders() {
    localStorage.setItem('fib_folders', JSON.stringify(foldersDB));
}

// Ekran logowania do głównej bazy
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

    document.getElementById('back-btn').addEventListener('click', renderMainDashboard);
    
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

// Ekran główny - Lista Folderów
function renderDatabaseContent() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    
    const headerH1 = document.querySelector('.app-header h1');
    if(headerH1) headerH1.innerHTML = '&gt; FIB::DATABASE_ROOT';

    const isAdmin = usersDB[currentUser] && usersDB[currentUser].role === 'admin';
    let adminButtonHtml = isAdmin ? `<button id="add-folder-btn" class="admin-note-btn" style="background: #00ff00; color: #111;">[+] UTWÓRZ KARTOTEKĘ (FOLDER)</button>` : '';

    gameArea.innerHTML = `
        <div class="notes-controls">
            <button id="back-btn" style="padding: 8px 15px; background: #222; color: #aaa; border: 1px solid #444; cursor: pointer; border-radius: 3px; font-weight: bold;">&lt; POWRÓT</button>
            ${adminButtonHtml}
        </div>
        <div class="notes-grid" id="folders-grid"></div>
    `;

    document.getElementById('back-btn').addEventListener('click', renderMainDashboard);
    if (isAdmin) {
        document.getElementById('add-folder-btn').addEventListener('click', () => renderFolderForm());
    }

    renderFolderTiles();
}

function renderFolderTiles() {
    const grid = document.getElementById('folders-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (foldersDB.length === 0) {
        grid.innerHTML = `<p style="color: #666; grid-column: 1/-1; text-align: center; margin-top: 50px; font-family: 'Courier New', monospace; font-size: 1.2rem; letter-spacing: 2px; text-shadow: none;">&gt; SYSTEM_FIB: BRAK KARTOTEK W BAZIE_</p>`;
        return;
    }

    foldersDB.forEach((folder, index) => {
        const tile = document.createElement('div');
        tile.className = 'note-tile';
        
        // Jeśli folder ma hasło, pokazujemy kłódkę
        let icon = folder.password ? '🔐' : '📁';
        
        tile.innerHTML = `<div style="font-size: 2rem; margin-bottom: 10px;">${icon}</div><div>${folder.title}</div>`;
        tile.onclick = () => {
            if (folder.password) {
                promptFolderPassword(index);
            } else {
                openFolder(index);
            }
        };
        grid.appendChild(tile);
    });
}

// Logowanie do konkretnego folderu
function promptFolderPassword(fIdx) {
    const gameArea = document.getElementById('game-area');
    const folder = foldersDB[fIdx];
    
    gameArea.innerHTML = `
        <div style="margin-bottom: 20px; text-align: left; padding-left: 40px;">
            <button id="back-to-root-btn" style="padding: 8px 15px; background: #222; color: #aaa; border: 1px solid #444; cursor: pointer; border-radius: 3px; font-weight: bold;">&lt; WSTECZ</button>
        </div>
        <div class="db-login-box">
            <h3>KARTOTEKA ZASZYFROWANA</h3>
            <p style="color: #aaa; margin-bottom: 15px;">${folder.title}</p>
            <input type="password" id="folder-pass-input" placeholder="WPROWADŹ HASŁO" autocomplete="off">
            <button id="folder-login-btn">AUTORYZUJ</button>
            <p id="folder-error" style="color: #ff3333; font-weight: bold; margin-top: 12px; font-size: 0.9rem;"></p>
        </div>
    `;

    document.getElementById('back-to-root-btn').addEventListener('click', renderDatabaseContent);
    
    function checkFolderPass() {
        const passIn = document.getElementById('folder-pass-input');
        if (passIn && passIn.value === folder.password) {
            openFolder(fIdx);
        } else {
            document.getElementById('folder-error').textContent = "Błędne hasło dostępu.";
        }
    }

    document.getElementById('folder-login-btn').addEventListener('click', checkFolderPass);
    document.getElementById('folder-pass-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') checkFolderPass(); });
}

// Wnętrze folderu (Lista notatek wewnątrz)
function openFolder(fIdx) {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    
    const folder = foldersDB[fIdx];
    const headerH1 = document.querySelector('.app-header h1');
    if(headerH1) headerH1.innerHTML = `&gt; FIB::DIR_${folder.title.toUpperCase().replace(/\s/g, '_')}`;

    const isAdmin = usersDB[currentUser] && usersDB[currentUser].role === 'admin';
    let adminControls = '';
    
    if (isAdmin) {
        adminControls = `
            <button id="add-note-btn" class="admin-note-btn">[+] DODAJ AKTA</button>
            <button id="edit-folder-btn" style="padding: 8px 15px; background: #ccaa00; color: #111; border: none; cursor: pointer; border-radius: 3px; font-weight: bold; margin-left: auto;">EDYTUJ FOLDER</button>
            <button id="delete-folder-btn" style="padding: 8px 15px; background: #ff3333; color: #111; border: none; cursor: pointer; border-radius: 3px; font-weight: bold; margin-left: 10px;">USUŃ FOLDER</button>
        `;
    }

    gameArea.innerHTML = `
        <div class="notes-controls" style="display: flex; gap: 10px; align-items: center; padding-right: 40px;">
            <button id="back-to-root-btn" style="padding: 8px 15px; background: #222; color: #aaa; border: 1px solid #444; cursor: pointer; border-radius: 3px; font-weight: bold;">&lt; GŁÓWNY KATALOG</button>
            ${adminControls}
        </div>
        <div style="padding: 0 40px; margin-bottom: 20px;">
            <h2 style="color: #00ff00; border-bottom: 1px solid #333; padding-bottom: 5px;">Katalog: ${folder.title}</h2>
        </div>
        <div class="notes-grid" id="notes-grid"></div>
    `;

    document.getElementById('back-to-root-btn').addEventListener('click', renderDatabaseContent);

    if (isAdmin) {
        document.getElementById('add-note-btn').addEventListener('click', () => renderNoteForm(fIdx));
        document.getElementById('edit-folder-btn').addEventListener('click', () => renderFolderForm(fIdx));
        document.getElementById('delete-folder-btn').addEventListener('click', () => {
            if(confirm(`Czy usunąć folder "${folder.title}" i wszystkie akta w nim zawarte?`)) {
                foldersDB.splice(fIdx, 1);
                saveFolders();
                renderDatabaseContent();
            }
        });
    }

    // Generowanie notatek wewnątrz tego folderu
    const grid = document.getElementById('notes-grid');
    if (folder.notes.length === 0) {
        grid.innerHTML = `<p style="color: #666; grid-column: 1/-1; margin-top: 20px; font-family: 'Courier New', monospace;">Brak akt w tym katalogu.</p>`;
    } else {
        folder.notes.forEach((note, nIdx) => {
            const tile = document.createElement('div');
            tile.className = 'note-tile';
            tile.innerHTML = `<div>📄</div><div style="margin-top: 5px;">${note.title}</div>`;
            tile.onclick = () => viewNoteDetail(fIdx, nIdx);
            grid.appendChild(tile);
        });
    }
}

// Formularz tworzenia/edycji FOLDERU
function renderFolderForm(editIdx = null) {
    const gameArea = document.getElementById('game-area');
    
    let isEdit = editIdx !== null;
    let defTitle = isEdit ? foldersDB[editIdx].title : '';
    let defPass = isEdit ? foldersDB[editIdx].password : '';

    gameArea.innerHTML = `
        <div class="note-form">
            <h3>${isEdit ? 'EDYCJA KARTOTEKI' : 'NOWA KARTOTEKA'}</h3>
            <input type="text" id="folder-title" placeholder="Nazwa folderu (np. Akta Gangów)" value="${defTitle}" autocomplete="off">
            <input type="text" id="folder-pass" placeholder="Hasło (zostaw puste, by nie blokować)" value="${defPass}" autocomplete="off" style="margin-top: -5px;">
            <div class="form-btns">
                <button class="btn-save" id="folder-save-btn">ZAPISZ KARTOTEKĘ</button>
                <button class="btn-cancel" id="folder-cancel-btn">ANULUJ</button>
            </div>
        </div>
    `;

    document.getElementById('folder-cancel-btn').addEventListener('click', () => {
        if(isEdit) openFolder(editIdx); else renderDatabaseContent();
    });

    document.getElementById('folder-save-btn').addEventListener('click', () => {
        const title = document.getElementById('folder-title').value.trim();
        const pass = document.getElementById('folder-pass').value.trim();
        if (!title) return alert('Nazwa folderu jest wymagana!');

        if (isEdit) {
            foldersDB[editIdx].title = title;
            foldersDB[editIdx].password = pass;
        } else {
            foldersDB.push({ title: title, password: pass, notes: [] });
        }
        saveFolders();
        if(isEdit) openFolder(editIdx); else renderDatabaseContent();
    });
}

// Formularz tworzenia/edycji NOTATKI w folderze
function renderNoteForm(fIdx, editNoteIdx = null) {
    const gameArea = document.getElementById('game-area');
    
    let isEdit = editNoteIdx !== null;
    let folder = foldersDB[fIdx];
    let defTitle = isEdit ? folder.notes[editNoteIdx].title : '';
    let defContent = isEdit ? folder.notes[editNoteIdx].content : '';

    gameArea.innerHTML = `
        <div class="note-form">
            <h3>${isEdit ? 'EDYCJA AKT' : 'NOWE AKTA DO: ' + folder.title}</h3>
            <input type="text" id="note-title" placeholder="Tytuł akt..." value="${defTitle}" autocomplete="off">
            <textarea id="note-content" placeholder="Treść operacyjna...">${defContent}</textarea>
            <div class="form-btns">
                <button class="btn-save" id="note-save-btn">ZAPISZ AKTA</button>
                <button class="btn-cancel" id="note-cancel-btn">ANULUJ</button>
            </div>
        </div>
    `;

    document.getElementById('note-cancel-btn').addEventListener('click', () => {
        if(isEdit) viewNoteDetail(fIdx, editNoteIdx); else openFolder(fIdx);
    });

    document.getElementById('note-save-btn').addEventListener('click', () => {
        const title = document.getElementById('note-title').value.trim();
        const content = document.getElementById('note-content').value.trim();
        if (!title || !content) return alert('Wypełnij wszystkie pola!');

        if (isEdit) {
            foldersDB[fIdx].notes[editNoteIdx] = { title, content };
        } else {
            foldersDB[fIdx].notes.push({ title, content });
        }
        saveFolders();
        if(isEdit) viewNoteDetail(fIdx, editNoteIdx); else openFolder(fIdx);
    });
}

// Podgląd konkretnej NOTATKI
function viewNoteDetail(fIdx, nIdx) {
    const gameArea = document.getElementById('game-area');
    const note = foldersDB[fIdx].notes[nIdx];
    
    const isAdmin = usersDB[currentUser] && usersDB[currentUser].role === 'admin';
    let adminControls = '';
    
    if (isAdmin) {
        adminControls = `
            <button id="edit-note-btn" style="padding: 8px 15px; background: #ccaa00; color: #111; border: none; cursor: pointer; border-radius: 3px; font-weight: bold; margin-left: 10px;">EDYTUJ WPIS</button>
            <button id="delete-note-btn" style="padding: 8px 15px; background: #ff3333; color: #111; border: none; cursor: pointer; border-radius: 3px; font-weight: bold; margin-left: 10px;">USUŃ WPIS</button>
        `;
    }
    
    gameArea.innerHTML = `
        <div style="margin-bottom: 20px; text-align: left; padding-left: 40px; display: flex; align-items: center;">
            <button id="back-to-folder-btn" style="padding: 8px 15px; background: #222; color: #aaa; border: 1px solid #444; cursor: pointer; border-radius: 3px; font-weight: bold;">&lt; WRÓĆ DO KATALOGU</button>
            ${adminControls}
        </div>
        <div style="padding: 0 40px; color: #eee; font-family: sans-serif; text-align: left;">
            <h2 style="color: #00ff00; border-bottom: 1px solid #333; padding-bottom: 10px; letter-spacing: 1px; font-weight: bold;">${note.title}</h2>
            <p style="margin-top: 20px; white-space: pre-wrap; line-height: 1.6; color: #ccc; font-size: 1.05rem;">${note.content}</p>
        </div>
    `;

    document.getElementById('back-to-folder-btn').addEventListener('click', () => openFolder(fIdx));

    if (isAdmin) {
        document.getElementById('edit-note-btn').addEventListener('click', () => renderNoteForm(fIdx, nIdx));
        document.getElementById('delete-note-btn').addEventListener('click', () => {
            if(confirm('Na pewno usunąć ten dokument z bazy FIB?')) {
                foldersDB[fIdx].notes.splice(nIdx, 1);
                saveFolders();
                openFolder(fIdx);
            }
        });
    }
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
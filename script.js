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
}

// --- ZMIANA HASŁA DLA NOWYCH ---
document.getElementById('save-pass-btn').addEventListener('click', function() {
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
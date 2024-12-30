// Auth handling code
const auth = {
    users: JSON.parse(localStorage.getItem('users')) || {},
    currentUser: localStorage.getItem('currentUser') || null,
    isLoggedIn: localStorage.getItem('currentUser') !== null,
    isLoginMode: true,

    login(username, password) {
        if (this.users[username] && this.users[username].password === password) {
            this.currentUser = username;
            this.isLoggedIn = true;
            localStorage.setItem('currentUser', username);
            document.querySelector('.prompt').textContent = `${username}@hackquest:~$`;
            terminal.addLoggedInCommands(username);
            return true;
        }
        return false;
    },

    register(username, password) {
        if (this.users[username]) {
            return false;
        }
        
        this.users[username] = {
            password: password,
            progress: {
                currentLevel: 1,
                completedLevels: [],
                attempts: {}
            }
        };
        
        localStorage.setItem('users', JSON.stringify(this.users));
        return true;
    },

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        localStorage.removeItem('currentUser');
    },

    toggleMode() {
        this.isLoginMode = !this.isLoginMode;
        const modal = document.getElementById('auth-modal');
        const title = document.getElementById('modal-title');
        const loginText = document.getElementById('login-text');
        const registerText = document.getElementById('register-text');
        
        title.textContent = this.isLoginMode ? 'Login' : 'Register';
        loginText.style.display = this.isLoginMode ? 'none' : 'block';
        registerText.style.display = this.isLoginMode ? 'block' : 'none';
    },

    restoreSession() {
        const username = localStorage.getItem('currentUser');
        if (username) {
            this.currentUser = username;
            this.isLoggedIn = true;
            document.querySelector('.prompt').textContent = `${username}@hackquest:~$`;
            terminal.addLoggedInCommands(username);
            return true;
        }
        return false;
    }
};

// Modal handling functions
function showAuthModal() {
    const modal = document.getElementById('auth-modal');
    const closeBtn = document.querySelector('.close-modal');
    const form = document.getElementById('auth-form');
    const toggleText = document.getElementById('auth-toggle');
    
    modal.style.display = 'block';
    
    closeBtn.onclick = () => {
        modal.style.display = 'none';
        terminal.setModalOpen(false);
    };
    
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            terminal.setModalOpen(false);
        }
    };
    
    toggleText.onclick = () => {
        auth.toggleMode();
    };
    
    form.onsubmit = (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const message = document.getElementById('auth-message');
        
        if (auth.isLoginMode) {
            if (auth.login(username, password)) {
                message.textContent = 'Login successful!';
                message.className = 'success-message';
                setTimeout(() => {
                    modal.style.display = 'none';
                    terminal.setModalOpen(false);
                    terminal.printOutput(`Welcome back, ${username}! Type 'help' to see available commands.`);
                }, 1000);
            } else {
                message.textContent = 'Invalid username or password';
                message.className = 'error-message';
            }
        } else {
            if (auth.register(username, password)) {
                message.textContent = 'Registration successful! You can now login.';
                message.className = 'success-message';
                setTimeout(() => auth.toggleMode(), 1000);
            } else {
                message.textContent = 'Username already exists';
                message.className = 'error-message';
            }
        }
    };
} 
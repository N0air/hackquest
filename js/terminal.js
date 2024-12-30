class Terminal {
    constructor() {
        this.input = document.querySelector('.terminal-input');
        this.output = document.querySelector('.terminal-output');
        this.setupEventListeners();
        this.commandHistory = [];
        this.historyIndex = -1;
        
        this.commands = {
            help: () => this.showHelp(),
            clear: () => this.clearTerminal(),
            about: () => this.showAbout(),
            levels: () => this.showLevels(),
            login: () => this.showLogin(),
            register: () => this.showRegister(),
            logout: () => this.handleLogout()
        };

        this.isModalOpen = false;

        this.input.addEventListener('blur', () => {
            if (!this.isModalOpen) {
                setTimeout(() => this.input.focus(), 10);
            }
        });

        // Add cursor positioning
        this.cursor = document.querySelector('.cursor');
        this.input.addEventListener('input', () => this.updateCursorPosition());
        this.input.addEventListener('keydown', (e) => {
            // Handle backspace separately to prevent cursor jumping
            if (e.key === 'Backspace') {
                setTimeout(() => this.updateCursorPosition(), 0);
            }
        });
        
        // Initial cursor position
        this.updateCursorPosition();

        this.currentLevel = null;

        // Add handler for page unload
        window.addEventListener('beforeunload', () => {
            // Don't clear game state on refresh
            // localStorage.removeItem('inGame');
        });

        // Restore session if user was logged in
        if (auth.currentUser) {
            this.addLoggedInCommands(auth.currentUser);
            document.querySelector('.prompt').textContent = `${auth.currentUser}@hackquest:~$`;
        }
    }

    setupEventListeners() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleCommand();
            } else if (e.key === 'ArrowUp') {
                this.navigateHistory('up');
                setTimeout(() => this.updateCursorPosition(), 0);
            } else if (e.key === 'ArrowDown') {
                this.navigateHistory('down');
                setTimeout(() => this.updateCursorPosition(), 0);
            } else {
                // Update cursor position for all other keys
                setTimeout(() => this.updateCursorPosition(), 0);
            }
        });

        // Add these new event listeners
        this.input.addEventListener('input', () => this.updateCursorPosition());
        this.input.addEventListener('click', () => this.updateCursorPosition());
        this.input.addEventListener('keyup', () => this.updateCursorPosition());
        this.input.addEventListener('mouseup', () => this.updateCursorPosition());
    }

    handleCommand() {
        const commandLine = this.input.value.trim().toLowerCase();
        this.commandHistory.push(commandLine);
        this.historyIndex = this.commandHistory.length;

        this.printOutput(`${auth.currentUser || 'guest'}@hackquest:~$ ${commandLine}`);

        if (commandLine === '') {
            this.input.value = '';
            return;
        }

        const [command, ...args] = commandLine.split(' ');

        // Check if we're in a level
        if (this.currentLevel) {
            this.currentLevel.handleCommand(command, args);
        } else if (command in this.commands) {
            this.commands[command](...args);
        } else {
            this.printOutput(`Command not found: ${command}`);
        }

        this.input.value = '';
        this.updateCursorPosition();

        if (command === 'exit-game') {
            this.exitGame();
            return;
        }
    }

    printOutput(text) {
        const p = document.createElement('p');
        
        if (typeof text === 'string' && text.startsWith(auth.currentUser || 'guest')) {
            // This is a user command
            const commandDiv = document.createElement('div');
            commandDiv.className = 'user-command';
            
            const promptSpan = document.createElement('span');
            promptSpan.className = 'prompt';
            promptSpan.textContent = text.split(':')[0] + ':~$';
            
            const commandSpan = document.createElement('span');
            commandSpan.className = 'command-text';
            commandSpan.textContent = text.split('$')[1];
            
            commandDiv.appendChild(promptSpan);
            commandDiv.appendChild(commandSpan);
            this.output.appendChild(commandDiv);
        } else if (typeof text === 'object') {
            // This is formatted game content
            if (text.type === 'challenge-header' || text.type === 'challenge-description') {
                const container = document.createElement('div');
                container.className = 'challenge-content';
                p.className = text.type;
                p.textContent = text.text;
                container.appendChild(p);
                this.output.appendChild(container);
            } else if (text.type === 'response' || text.type === 'system-message') {
                const container = document.createElement('div');
                container.className = 'response-content';
                p.className = text.type;
                p.textContent = text.text;
                container.appendChild(p);
                this.output.appendChild(container);
            } else {
                p.className = text.type;
                p.textContent = text.text;
                this.output.appendChild(p);
            }
        } else {
            // Regular text output
            p.textContent = text;
            this.output.appendChild(p);
        }
        
        this.output.scrollTop = this.output.scrollHeight;
        this.input.focus();
    }

    showHelp() {
        const helpText = auth.isLoggedIn ? [
            ...this.loggedInHelpText,
            '  exit-game - Return to landing page'
        ] : [
            ...this.baseHelpText,
            '  exit-game - Return to landing page'
        ];
        helpText.forEach(line => this.printOutput(line));
    }

    showAbout() {
        const aboutText = [
            { type: 'header', text: '=== About HackQuest ===' },
            '',
            { type: 'challenge-description', text: 'HackQuest v1.0.0' },
            { type: 'challenge-description', text: 'A terminal-based hacking simulation game' },
            { type: 'challenge-description', text: 'Master the art of cybersecurity through 5 challenging levels' },
            '',
            { type: 'system-message', text: 'Created by N0air' },
            '',
            { type: 'command-example', text: 'Type "help" to see available commands' }
        ];
        aboutText.forEach(line => this.printOutput(line));
    }

    showLevels() {
        const levelsText = [
            'Game Levels:',
            '1. Network Infiltration - Learn basic network scanning and exploitation',
            '2. Password Cracking - Master the art of breaking encrypted passwords',
            '3. Social Engineering - Practice the human aspect of hacking',
            '4. System Exploitation - Exploit system vulnerabilities',
            '5. Advanced Persistence - Maintain access and cover your tracks',
            '',
            'Login required to play. Use "login" command to start.'
        ];
        levelsText.forEach(line => this.printOutput(line));
    }

    clearTerminal() {
        this.output.innerHTML = '';
    }

    showLogin() {
        this.setModalOpen(true);
        showAuthModal();
    }

    showRegister() {
        this.setModalOpen(true);
        showAuthModal();
        auth.toggleMode();
    }

    navigateHistory(direction) {
        if (direction === 'up' && this.historyIndex > 0) {
            this.historyIndex--;
            this.input.value = this.commandHistory[this.historyIndex];
            this.updateCursorPosition();
        } else if (direction === 'down' && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            this.input.value = this.commandHistory[this.historyIndex];
            this.updateCursorPosition();
        }
    }

    addLoggedInCommands(username) {
        this.commands.start = (level) => this.startLevel(level);
        this.commands.status = () => this.showStatus(username);
        this.commands.logout = () => this.handleLogout();
        
        // Update help text
        this.loggedInHelpText = [
            'Available commands:',
            '  help     - Show this help message',
            '  about    - About HackQuest',
            '  levels   - Show game levels info',
            '  start n  - Start level n (e.g., start 1)',
            '  status   - Show your progress',
            '  logout   - Logout from the system',
            '  clear    - Clear terminal'
        ];
    }

    handleLogout() {
        auth.logout();
        document.querySelector('.prompt').textContent = 'guest@hackquest:~$';
        this.printOutput('Logged out successfully.');
        delete this.commands.start;
        delete this.commands.status;
    }

    showStatus(username) {
        // Clear the terminal first
        this.clearTerminal();
        
        const user = auth.users[username];
        const completedLevels = user.progress.completedLevels;
        const currentLevel = user.progress.currentLevel;
        
        // Initialize attempts count if it doesn't exist
        if (!user.progress.attempts) {
            user.progress.attempts = {};
        }

        const levelDescriptions = {
            1: "Network Infiltration - Basic port scanning and SSH exploitation",
            2: "Password Cracking - Hash analysis and authentication bypass",
            3: "Social Engineering - Social manipulation and phishing attacks",
            4: "System Exploitation - Advanced system vulnerabilities",
            5: "Advanced Persistence - Stealth and persistence techniques"
        };

        // Header
        this.printOutput({ type: 'header', text: `=== HackQuest Status: ${username} ===` });
        this.printOutput({ type: 'divider' });

        // Progress Summary Section
        this.printOutput({ type: 'subheader', text: "🎯 Progress Summary" });
        this.printOutput(`Current Level: ${currentLevel}`);
        this.printOutput(`Completed Levels: ${completedLevels.length === 0 ? 'None' : completedLevels.join(', ')}`);
        this.printOutput({ type: 'divider' });

        // Hacker Stats Section
        this.printOutput({ type: 'subheader', text: "🏆 Hacker Stats" });
        const totalAttempts = Object.values(user.progress.attempts).reduce((a, b) => a + b, 0);
        this.printOutput(`Total Failed Attempts: ${totalAttempts}`);
        this.printOutput(`1337 Score: ${(totalAttempts * 0.01).toFixed(2)}%`);
        const rankEmoji = totalAttempts > 50 ? '🦾' : totalAttempts > 30 ? '💪' : totalAttempts > 10 ? '👾' : '🌱';
        this.printOutput(`Hacker Rank: ${this.getHackerRank(totalAttempts)} ${rankEmoji}`);
        this.printOutput({ type: 'divider' });

        // Level Details Section
        this.printOutput({ type: 'subheader', text: "📊 Level Details" });
        
        for (let i = 1; i <= 5; i++) {
            const isCompleted = completedLevels.includes(i);
            const isCurrent = i === currentLevel;
            const levelStatus = isCompleted ? "✅ COMPLETED" : 
                              isCurrent ? "🔄 IN PROGRESS" : 
                              i > currentLevel ? "🔒 LOCKED" : "⏳ AVAILABLE";
            
            const attempts = user.progress.attempts[i] || 0;
            const attemptText = attempts > 0 ? 
                `Failed Attempts: ${attempts} (${(attempts * 0.01).toFixed(2)}% more 1337)` : 
                'No attempts yet';
            
            this.printOutput({ type: 'level-header', text: `Level ${i}: ${levelDescriptions[i]}` });
            this.printOutput(`Status: ${levelStatus}`);
            this.printOutput(`${attemptText} ${attempts > 20 ? '💪' : attempts > 10 ? '😅' : '🌱'}`);
            this.printOutput("");
        }

        // Footer
        this.printOutput({ type: 'divider' });
        this.printOutput({ type: 'command-example', text: "Type 'start <level>' to begin or continue a level" });
        this.printOutput("Pro tip: More failures = More street cred! 😎");
    }

    // Add this helper method to Terminal class
    getHackerRank(attempts) {
        if (attempts > 50) return "Elite Keyboard Warrior";
        if (attempts > 30) return "Digital Troublemaker";
        if (attempts > 10) return "Script Kiddie";
        return "N00b Explorer";
    }

    startLevel(level) {
        if (!level) {
            this.printOutput('Usage: start <level_number>');
            return;
        }
        
        level = parseInt(level);
        if (isNaN(level) || level < 1 || level > 5) {
            this.printOutput('Invalid level number. Use levels 1-5');
            return;
        }

        const user = auth.users[auth.currentUser];
        if (level > user.progress.currentLevel) {
            // Get random locked level insult
            const lockedLevelInsults = [
                "Nice try! But you need to crawl before you can walk... and you're still crawling! 👶",
                `Complete level ${user.progress.currentLevel} first, unless you can hack the game itself (which we doubt) 😏`,
                "Sorry, your hacking skills aren't high enough to unlock this area! 🔒",
                "Error 403: Your ambition is writing checks your skills can't cash! 💸",
                "Aww, that's cute! You think you're ready for that level? Adorable! 🎀",
                "Plot twist: You need to actually be good at hacking to skip levels! 😱",
                `You're trying to run before you can walk... or in your case, before you can even crawl to level ${user.progress.currentLevel}! 🏃`,
                "Task failed successfully: You've discovered you're not as good as you think! 🏆",
                "Access Denied: Please return with more experience points! 🎮",
                "Breaking news: Overconfidence is not a valid authentication method! 📰"
            ];
            
            const insult = lockedLevelInsults[Math.floor(Math.random() * lockedLevelInsults.length)];
            this.printOutput(insult);
            this.printOutput(`\nCurrent Progress: Level ${user.progress.currentLevel}`);
            this.printOutput(`Completed Levels: ${user.progress.completedLevels.join(', ') || 'None'}`);
            this.printOutput("\nType 'status' to see your progress, or 'help' if you're lost!");
            return;
        }

        // Clear the terminal before starting new level
        this.clearTerminal();

        // Initialize the level
        switch(level) {
            case 1:
                this.currentLevel = new Level1(this);
                this.currentLevel.start();
                break;
            case 2:
                this.currentLevel = new Level2(this);
                this.currentLevel.start();
                break;
            case 3:
                this.currentLevel = new Level3(this);
                this.currentLevel.start();
                break;
            case 4:
                this.currentLevel = new Level4(this);
                this.currentLevel.start();
                break;
            case 5:
                this.printOutput('Level 5 coming soon!');
                return;
            default:
                this.printOutput('Invalid level number');
                return;
        }
    }

    setModalOpen(isOpen) {
        this.isModalOpen = isOpen;
        if (!isOpen) {
            this.input.focus();
            this.updateCursorPosition();
        }
    }

    updateCursorPosition() {
        if (!this.isModalOpen) {
            const inputText = this.input.value;
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const computedStyle = window.getComputedStyle(this.input);
            context.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
            
            // Get the width of the text before the cursor
            const textWidth = context.measureText(inputText.substring(0, this.input.selectionStart)).width;
            
            // Update cursor position
            this.cursor.style.left = `${textWidth}px`;
        }
    }

    getTextWidth(text) {
        const canvas = this.getTextWidth.canvas || (this.getTextWidth.canvas = document.createElement('canvas'));
        const context = canvas.getContext('2d');
        const computedStyle = window.getComputedStyle(this.input);
        context.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
        return context.measureText(text).width;
    }

    // Add method to exit game
    exitGame() {
        localStorage.removeItem('inGame');
        window.location.reload();
    }
}

// Make terminal instance globally available
window.terminal = new Terminal(); 
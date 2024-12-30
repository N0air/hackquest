class GameLevel {
    constructor(terminal) {
        this.terminal = terminal;
        this.currentStep = 0;
        this.attempts = 0;
    }

    createCopyableOutput(text) {
        return {
            type: 'copyable',
            text: text
        };
    }

    printWithDelay(messages, delay = 500) {
        let container = document.createElement('div');
        container.className = 'game-content';
        
        messages.forEach((msg, index) => {
            setTimeout(() => {
                if (typeof msg === 'string' && msg.trim() !== '') {
                    const p = document.createElement('p');
                    p.textContent = msg;
                    container.appendChild(p);
                } else if (typeof msg === 'object') {
                    const p = document.createElement('p');
                    p.className = msg.type;
                    p.textContent = msg.text;
                    container.appendChild(p);
                }
                
                if (index === messages.length - 1) {
                    this.terminal.output.appendChild(container);
                    this.terminal.output.scrollTop = this.terminal.output.scrollHeight;
                }
            }, delay * index);
        });
    }

    handleFailure(message) {
        // Specific insults for different types of failures
        const failureCategories = {
            portScan: [
                "Your port scan is so weak, it couldn't even detect a USB coffee warmer! ☕",
                "Scanning skills: 404 NOT FOUND 🔍",
                "Even a smart fridge would detect that scan coming! 🧊",
                "Are you using Internet Explorer to run that scan? 🐌",
                "Plot twist: The firewall is actually feeling sorry for you! 🔥"
            ],
            analyze: [
                "Your vulnerability analysis looks like a Windows 95 security update! 📊",
                "That analysis is so shallow, it makes a puddle look like an ocean! 🌊",
                "You're analyzing it wrong... Have you tried asking it nicely? 🙏",
                "Breaking news: Target system dies of laughter! 📰",
                "Error: Brain.exe has stopped working! 🧠"
            ],
            crack: [
                "Your password cracking attempt is weaker than 'password123'! 🔑",
                "Even my grandma could create a better brute-force attack! 👵",
                "Plot twist: The password was 'please' all along! 😅",
                "Hack.exe has crashed... Would you like to send an error report? 💥",
                "Task failed successfully: You've managed to hack yourself! 🎯"
            ],
            connect: [
                "Connection failed: Target system is too busy laughing! 🤣",
                "Access Denied: Please submit your hacking license first! 📜",
                "Error 418: I'm a teapot, and you're not making coffee! ☕",
                "Connection rejected: System prefers better hackers! 🚫",
                "Task failed: Have you tried turning your skills on and off again? 🔄"
            ],
            generic: [
                "Your hacking skills are still loading... 99% complete since 1999! ⌛",
                "Achievement Unlocked: World's Most Obvious Hacking Attempt! 🏆",
                "Firewall literally just took a screenshot of this for their fail compilation! 📸",
                "System log: LMAO 🤣",
                "Congratulations! You've been added to the 'Hall of Shame'! 🏅"
            ]
        };

        // Get the appropriate insult category based on the current step
        let category;
        switch (this.currentStep) {
            case 0:
                category = failureCategories.portScan;
                break;
            case 1:
                category = failureCategories.analyze;
                break;
            case 2:
                category = failureCategories.crack;
                break;
            case 3:
                category = failureCategories.connect;
                break;
            default:
                category = failureCategories.generic;
        }

        // Get a random insult from the appropriate category
        const insult = category[Math.floor(Math.random() * category.length)];
        
        this.terminal.printOutput(message);
        this.terminal.printOutput(insult);
        this.attempts++;
        
        // Update user's attempt count for this level
        const user = auth.users[auth.currentUser];
        if (!user.progress.attempts) {
            user.progress.attempts = {};
        }
        if (!user.progress.attempts[this.constructor.name.replace('Level', '')]) {
            user.progress.attempts[this.constructor.name.replace('Level', '')] = 0;
        }
        user.progress.attempts[this.constructor.name.replace('Level', '')]++;
        localStorage.setItem('users', JSON.stringify(auth.users));
        
        if (this.attempts >= 3) {
            const encouragement = [
                "Look, even Anonymous had to start somewhere... 🎭",
                "Pro tip: Reading the instructions might actually help! 📖",
                "Don't worry, we won't tell anyone about this... yet! 🤫",
                "Maybe try HTML? I heard it's a hacking language! 😉",
                "Your persistence is admirable... your skills, not so much! 💪"
            ];
            this.terminal.printOutput(encouragement[Math.floor(Math.random() * encouragement.length)]);
            this.terminal.printOutput("Type 'help' to see the current objective, or 'restart' to start over.");
        }
    }

    showCurrentObjective() {
        this.terminal.printOutput("Available commands:");
        this.terminal.printOutput("  restart  - Restart current level");
        this.terminal.printOutput("  exit     - Return to main menu (for quitters)");
        this.terminal.printOutput("  help     - Show this help message");
        this.terminal.printOutput("");
        
        // Show current objective based on step
        switch (this.currentStep) {
            case 0:
                this.terminal.printOutput("Current objective: Scan the target IP (192.168.1.100)");
                this.terminal.printOutput("Command: scan <ip_address>");
                break;
            case 1:
                this.terminal.printOutput("Current objective: Analyze the open port");
                this.terminal.printOutput("Command: analyze <port_number>");
                break;
            case 2:
                this.terminal.printOutput("Current objective: Crack the SSH login");
                this.terminal.printOutput("Command: crack ssh root");
                break;
            case 3:
                this.terminal.printOutput("Current objective: Connect as admin");
                this.terminal.printOutput("Command: connect admin");
                break;
        }
    }

    complete() {
        setTimeout(() => {
            this.terminal.currentLevel = null;
            this.terminal.input.focus();
        }, 500);
    }

    printHeader(text) {
        this.terminal.printOutput({ type: 'header', text });
    }

    printSubheader(text) {
        this.terminal.printOutput({ type: 'subheader', text });
    }

    printDivider() {
        this.terminal.printOutput({ type: 'divider' });
    }

    printCommand(text) {
        this.terminal.printOutput({ type: 'command-example', text });
    }

    handleRestart() {
        // Clear the terminal
        this.terminal.clearTerminal();
        
        // Get random restart insult
        const restartInsults = [
            "Ragequitting already? That's a new speed record! 🏃‍♂️",
            "Ah, the classic 'turn it off and on again' strategy! 🔄",
            "Running away from your problems won't make you a better hacker! 😏",
            "Memory wiped! Just like your hacking skills! 🧹",
            "Achievement Unlocked: Professional Level Restarter! 🏆",
            "Did you try blowing on the terminal? Works with Nintendo! 💨",
            "CTRL+Z won't undo your hacking skills! ⌨️",
            "Restarting won't make the level easier... but dream big! 💫",
            "Plot twist: The real hack was the restarts we made along the way! 🌟",
            "System Restored to: Still Not Good Enough™ 📦"
        ];
        
        const insult = restartInsults[Math.floor(Math.random() * restartInsults.length)];
        
        // Print restart message with insult
        this.terminal.printOutput("\n=== SYSTEM REBOOT INITIATED ===");
        this.terminal.printOutput(insult);
        this.terminal.printOutput("Reloading level... Try not to break it this time! 🙄\n");
        
        // Reset level state
        this.currentStep = 0;
        this.attempts = 0;
        
        // Start the level again
        setTimeout(() => {
            this.start();
        }, 1500);
    }

    handleExit() {
        const exitInsults = [
            "Rage quitting already? And here I thought you were a 'pro hacker'! 🏃‍♂️",
            "Another one bites the dust! Don't worry, McDonald's is always hiring! 🍔",
            "Task Failed Successfully: You've mastered the art of giving up! 🏆",
            "Speedrun to Main Menu: New Record! (Not something to be proud of) 🏃",
            "Error 418: Player's determination not found! ☕",
            "Achievement Unlocked: Professional Level Abandoner! 🎮",
            "Breaking News: Local hacker discovers 'exit' command, declares victory! 📰",
            "Plot twist: The real hack was the levels you abandoned along the way! 🌟",
            "System Log: Player.skills.confidence dropped to 0! 📉",
            "CTRL+Z won't undo your shame! But nice try! ⌨️"
        ];
        
        const insult = exitInsults[Math.floor(Math.random() * exitInsults.length)];
        
        // Clear terminal
        this.terminal.clearTerminal();
        
        // Show exit message
        this.terminal.printOutput("=== MISSION ABANDONED ===");
        this.terminal.printOutput(insult);
        this.terminal.printOutput("\nReturning to main menu... Try not to cry! 😢\n");
        
        // Reset terminal state
        setTimeout(() => {
            this.terminal.currentLevel = null;
            this.terminal.printOutput("Available commands:");
            this.terminal.printOutput("  help     - Show help message");
            this.terminal.printOutput("  start n  - Start level n");
            this.terminal.printOutput("  status   - Show progress");
            this.terminal.printOutput("  levels   - Show level info");
            this.terminal.printOutput("  clear    - Clear terminal");
        }, 1500);
    }
}

class Level1 extends GameLevel {
    constructor(terminal) {
        super(terminal);
        this.targetIP = '192.168.1.100';
        this.openPorts = {
            22: 'SSH',
            80: 'HTTP'
        };
    }

    start() {
        this.currentStep = 0;
        this.attempts = 0;
        
        const intro = [
            { type: 'challenge-header', text: '=== Level 1: Network Infiltration ===' },
            { type: 'section-divider' },
            { type: 'challenge-description', text: 'Welcome to your first hacking challenge!' },
            { type: 'challenge-description', text: 'Your mission is to infiltrate a remote system by scanning and exploiting vulnerabilities.' },
            '',
            { type: 'objective', text: 'Current Objective: Perform initial port scan' },
            '',
            { type: 'available-commands', text: 'Available Commands:' },
            { type: 'command-example', text: '  scan <ip_address>     - Scan target for open ports' },
            { type: 'command-example', text: '  analyze <port>        - Analyze specific port' },
            { type: 'command-example', text: '  crack ssh <user>      - Attempt to crack SSH login' },
            { type: 'command-example', text: '  connect <user>        - Connect to the system' },
            '',
            { type: 'copyable', text: `Target IP: ${this.targetIP}` },
            { type: 'hint', text: 'Hint: Start by scanning the target IP to find open ports' },
            { type: 'section-divider' }
        ];
        
        this.printWithDelay(intro);
    }

    handleCommand(command, args) {
        if (command === 'restart') {
            this.handleRestart();
            return;
        }

        if (command === 'exit') {
            this.handleExit();
            return;
        }

        if (command === 'help') {
            this.showCurrentObjective();
            return;
        }

        switch (this.currentStep) {
            case 0: // Port scanning phase
                if (command === 'scan' && args[0] === this.targetIP) {
                    this.portScan();
                } else {
                    this.handleFailure("Invalid scan command! Try: scan " + this.targetIP);
                }
                break;

            case 1: // Port analysis phase
                if (command === 'analyze' && args[0] === '22') {
                    this.analyzePort();
                } else {
                    this.handleFailure("Invalid analysis command! Try: analyze 22");
                }
                break;

            case 2: // SSH cracking phase
                if (command === 'crack' && args[0] === 'ssh' && args[1] === 'root') {
                    this.crackSSH();
                } else {
                    this.handleFailure("Invalid crack command! Try: crack ssh root");
                }
                break;

            case 3: // Connection phase
                if (command === 'connect' && args[0] === 'admin') {
                    this.connectSystem();
                } else {
                    this.handleFailure("Invalid connect command! Try: connect admin");
                }
                break;
        }
    }

    portScan() {
        this.currentStep = 1;
        const output = [
            { type: 'system-message', text: 'Initiating port scan...' },
            { type: 'progress-update', text: 'Scanning ports 1-1000...' },
            { type: 'success-message', text: 'Scan complete! Open ports found:' },
            { type: 'command-example', text: '  Port 22: SSH' },
            { type: 'command-example', text: '  Port 80: HTTP' },
            '',
            { type: 'objective', text: 'Next Step: Analyze the SSH port (22) for vulnerabilities' },
            { type: 'hint', text: 'Use the analyze command on port 22' }
        ];
        this.printWithDelay(output);
    }

    analyzePort() {
        this.currentStep = 2;
        const output = [
            { type: 'system-message', text: 'Analyzing SSH service on port 22...' },
            { type: 'progress-update', text: 'Checking version and configuration...' },
            { type: 'success-message', text: 'Analysis complete!' },
            '',
            { type: 'challenge-description', text: 'SSH Version: OpenSSH 7.5' },
            { type: 'challenge-description', text: 'Authentication: Password enabled' },
            { type: 'challenge-description', text: 'Root login: Allowed' },
            '',
            { type: 'objective', text: 'Next Step: Attempt to crack root SSH login' },
            { type: 'hint', text: 'Use: crack ssh root' }
        ];
        this.printWithDelay(output);
    }

    crackSSH() {
        this.currentStep = 3;
        const output = [
            { type: 'system-message', text: 'Initiating SSH password crack...' },
            { type: 'progress-update', text: 'Running dictionary attack...' },
            { type: 'success-message', text: 'Credentials found!' },
            '',
            { type: 'challenge-description', text: 'Username: admin' },
            { type: 'challenge-description', text: 'Password: ************' },
            '',
            { type: 'objective', text: 'Final Step: Connect to the system as admin' },
            { type: 'hint', text: 'Use: connect admin' }
        ];
        this.printWithDelay(output);
    }

    connectSystem() {
        this.currentStep = 4;
        const output = [
            { type: 'success-message', text: '=== Connection Established ===' },
            '',
            { type: 'challenge-description', text: 'Successfully connected to the target system!' },
            { type: 'challenge-description', text: 'Access level: Administrator' },
            '',
            { type: 'challenge-header', text: '🎉 Level 1 Complete! 🎉' },
            { type: 'challenge-description', text: 'You\'ve successfully infiltrated your first system!' },
            '',
            { type: 'hint', text: 'Type "start 2" to begin the next level' }
        ];
        this.printWithDelay(output);

        // Update user progress
        const user = auth.users[auth.currentUser];
        if (!user.progress.completedLevels.includes(1)) {
            user.progress.completedLevels.push(1);
            user.progress.currentLevel = Math.max(2, user.progress.currentLevel);
            localStorage.setItem('users', JSON.stringify(auth.users));
        }

        // Complete the level
        setTimeout(() => this.complete(), 3000);
    }
}

class Level2 extends GameLevel {
    constructor(terminal) {
        super(terminal);
        this.steps = [
            this.introduction,
            this.findHash,
            this.crackHash,
            this.bypassAuth,
            this.complete
        ];
        
        // Generate random password from common list
        const commonPasswords = [
            'password123', 'qwerty', 'letmein', 'admin123', 
            'welcome', 'monkey123', 'dragon', 'football'
        ];
        this.password = commonPasswords[Math.floor(Math.random() * commonPasswords.length)];
        this.foundHash = md5(this.password);
    }

    start() {
        this.currentStep = 0;
        this.attempts = 0;
        this.terminal.printOutput("\n=== Starting Level 2: Password Cracking ===\n");
        this.terminal.printOutput("Ah, look who thinks they're ready for the big leagues! 🎭\n");
        this.steps[0].call(this);
    }

    introduction() {
        this.printHeader("=== Level 2: Password Cracking ===");
        this.printDivider();
        
        this.printSubheader("Target Information:");
        this.terminal.printOutput("Corporate Authentication Server");
        this.terminal.printOutput("Objective: Crack password hashes and bypass authentication");
        
        this.printDivider();
        
        this.printSubheader("Current Task:");
        this.terminal.printOutput("Locate the password hash file in the system");
        
        this.printSubheader("Command Syntax:");
        this.printCommand("find <directory> -name 'password.hash'");
        this.printCommand("Example: find /home -name 'password.hash'");
        
        this.printDivider();
        
        this.printSubheader("Starting Point:");
        this.terminal.printOutput("Search in: /var/www/");
    }

    handleCommand(command, args) {
        if (command === 'restart') {
            this.handleRestart();
            return;
        }

        if (command === 'exit') {
            this.handleExit();
            return;
        }

        if (command === 'help') {
            this.showCurrentObjective();
            return;
        }

        if (this.currentStep < this.steps.length) {
            switch (this.currentStep) {
                case 0: // Find hash file
                    if (command === 'find') {
                        if (args[0] === '/var/www' && args[1] === "-name" && args[2] === "'password.hash'") {
                            this.findHash();
                        } else {
                            const findFailures = [
                                "Wrong path! Are you looking for the hash in System32? 🤦‍♂️",
                                "That search is so bad, even Windows Search feels better about itself! 🔍",
                                "Did you learn Linux commands from a fortune cookie? 🥠",
                                "grep -r 'how_to_be_1337_hacker.txt' /dev/null 🤣",
                                "sudo apt-get install better-hacking-skills 📦",
                                "Error 404: Brain not found in specified directory! 🧠",
                                "ls -la /path/to/your/dignity 📁"
                            ];
                            this.handleFailure(findFailures[Math.floor(Math.random() * findFailures.length)]);
                        }
                    } else {
                        const commandFailures = [
                            "Wrong command! 'please_find_hash.exe' not found! 🦄",
                            "Did you mean: 'how_do_I_computer'? 💻",
                            "Error: Command not found in 'Hacking for Dummies' index! 📚",
                            "Loading hacker skills... Task failed successfully! ⚠️",
                            "chmod 777 my_hacking_skills # Permission still denied 🔒"
                        ];
                        this.handleFailure(commandFailures[Math.floor(Math.random() * commandFailures.length)]);
                    }
                    break;

                case 1: // Identify hash
                    if (command === 'identify') {
                        if (args[0] === this.foundHash) {
                            this.crackHash();
                        } else {
                            const hashFailures = [
                                "That's not the hash! Did you type that with your eyes closed? 👀",
                                "Nice try! But that's your phone number, not a hash! 📱",
                                "MD5? More like MD-Why are you like this? 🤔",
                                "That hash is as real as your hacking skills! 🎭",
                                "Error: Hash identification failed. Reason: User error (as usual) 🤷‍♂️",
                                "Plot twist: The real hash was the friends we made along the way! 🌈",
                                "Your hash analysis is giving 'random keyboard smash' vibes! ⌨️"
                            ];
                            this.handleFailure(hashFailures[Math.floor(Math.random() * hashFailures.length)]);
                        }
                    } else {
                        const identifyFailures = [
                            "Wrong command! Staring intensely at the hash won't identify it! 🔍",
                            "Did you try asking the hash politely what type it is? 🎭",
                            "Error: Command not found in 'Crypto for Cave People' 📖",
                            "Roses are red, violets are blue, your command is wrong, and your syntax too! 🌹",
                            "Have you tried turning your brain off and on again? 🔄"
                        ];
                        this.handleFailure(identifyFailures[Math.floor(Math.random() * identifyFailures.length)]);
                    }
                    break;

                case 2: // Crack hash
                    if (command === 'crack') {
                        const attempt = args.join(' ').toLowerCase();
                        if (attempt === "md5 --wordlist rockyou.txt " + this.foundHash) {
                            this.bypassAuth();
                        } else {
                            const crackFailures = [
                                "Your password cracking is weaker than 'password123'! 🔑",
                                "Did you learn password cracking from a cereal box? 🥣",
                                "Even the password is embarrassed for you! 😳",
                                "Breaking news: Local hacker can't break anything! 📰",
                                "Your approach to cracking is like bringing a spoon to a gunfight! 🥄",
                                "rockyou.txt is crying right now! 😢",
                                "The hash just filed a restraining order against you! ⚖️"
                            ];
                            this.handleFailure(crackFailures[Math.floor(Math.random() * crackFailures.length)]);
                        }
                    } else {
                        const wrongCommandFailures = [
                            "Wrong command! 'abracadabra' is not a valid cracking method! 🎩",
                            "Trying to crack the hash with hopes and dreams? 🌈",
                            "Your command is so wrong, it wrapped around to being funny! 😆",
                            "Did you get that command from a TikTok hacker? 📱",
                            "Error: Brain.exe has stopped working! 🧠"
                        ];
                        this.handleFailure(wrongCommandFailures[Math.floor(Math.random() * wrongCommandFailures.length)]);
                    }
                    break;

                case 3: // Final auth bypass
                    if (command === 'bypass' && args[0] === '--auth' && args[1] === this.password) {
                        this.complete();
                    } else {
                        const bypassFailures = [
                            "Authentication still standing! Unlike your reputation! 🛡️",
                            "Access Denied: System requires actual hacking skills! 🚫",
                            "The system just died laughing at your attempt! ⚰️",
                            "Task failed successfully: You've played yourself! 🎮",
                            "Error 418: I'm a teapot, and you're not getting any tea! ☕",
                            "The password is literally right there! How did you mess this up? 🤦‍♂️",
                            "System log: ROFL LMAO KEKW 🤣"
                        ];
                        this.handleFailure(bypassFailures[Math.floor(Math.random() * bypassFailures.length)]);
                    }
                    break;
            }
        }
    }

    findHash() {
        this.currentStep = 1;
        const output = [
            "Searching in /var/www...",
            "...",
            this.createCopyableOutput(`Found: ${this.foundHash}`),
            "",
            "Next step: Identify the hash type",
            "Command: identify <hash>",
            "Tip: Use the copy button to copy the hash exactly"
        ];
        this.printWithDelay(output);
    }

    crackHash() {
        this.currentStep = 2;
        const output = [
            "Hash type identified: MD5",
            "Common password list detected: rockyou.txt",
            "",
            "Next step: Crack the hash using MD5 and rockyou wordlist",
            "Command: crack md5 --wordlist rockyou.txt <hash>"
        ];
        this.printWithDelay(output);
    }

    bypassAuth() {
        this.currentStep = 3;
        const output = [
            "Cracking hash...",
            "Progress: [####################] 100%",
            this.createCopyableOutput(`Password found: '${this.password}'`),
            "",
            "Final step: Bypass authentication using the password",
            this.createCopyableOutput(`Command: bypass --auth ${this.password}`)
        ];
        this.printWithDelay(output);
    }

    complete() {
        this.currentStep = 4;
        const sarcasticPraise = [
            "🎉 *Slow clap* Congratulations on discovering that a common password was common! 🎉",
            "You've graduated from 'Script Kiddie' to 'Almost Script Teenager'! 🎓",
            "",
            "New achievements unlocked:",
            "- Ctrl+C Ctrl+V Mastery Level 2 🏆",
            "- Successfully used a tool someone else wrote 🔧",
            "- Discovered what MD5 stands for (just kidding, we know you didn't) 🤓",
            "- Learned that dictionary attacks work on dictionary words (mind-blowing!) 🤯",
            "- Managed to not break your keyboard while typing commands 🎹",
            "",
            "Your hacking skills have evolved from 'My First Hack™' to 'I Can Use Copy-Paste'! 📈",
            "Next up: Level 3 - Social Engineering",
            "",
            "WARNING: Level 3 requires:",
            "- Basic reading comprehension (uh oh!) 📚",
            "- Actual problem solving (we know, terrifying!) 🧩",
            "- More than two brain cells (might want to borrow some) 🧠",
            "- No, seriously, you can't just copy-paste this one 😱",
            "",
            "Type 'start 3' when you're ready to question your life choices! 🎭",
            "Or type 'help' if you need emotional support... 🤗",
            "",
            "Progress saved... Your cat would be proud! 🐱",
            "(At least someone has to be, right?) 😅"
        ];
        this.printWithDelay(sarcasticPraise);
        
        // Update user progress
        const user = auth.users[auth.currentUser];
        if (!user.progress.completedLevels.includes(2)) {
            user.progress.completedLevels.push(2);
            user.progress.currentLevel = Math.max(3, user.progress.currentLevel);
            localStorage.setItem('users', JSON.stringify(auth.users));
        }

        // Call parent complete to reset terminal state
        super.complete();
    }
}

class Level3 extends GameLevel {
    constructor(terminal) {
        super(terminal);
        this.steps = [
            this.introduction,
            this.reconPhase,
            this.phishingPhase,
            this.exploitPhase,
            this.complete
        ];
        
        // Generate random target info
        this.targetCompany = this.generateCompanyName();
        this.targetEmployee = this.generateEmployeeName();
        this.targetDepartment = this.generateDepartment();
        this.targetEmail = this.generateEmail();
        
        // Generate additional company details
        this.companyDetails = this.generateCompanyDetails();
    }

    // Generate random company names
    generateCompanyName() {
        const prefixes = ['Cyber', 'Tech', 'Data', 'Cloud', 'Quantum', 'Digital'];
        const suffixes = ['Corp', 'Systems', 'Solutions', 'Dynamics', 'Industries', 'Security'];
        return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
    }

    // Generate random employee names
    generateEmployeeName() {
        const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];
        return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    }

    // Generate random department
    generateDepartment() {
        const departments = ['IT Support', 'Human Resources', 'Finance', 'Operations', 'Marketing', 'Sales'];
        return departments[Math.floor(Math.random() * departments.length)];
    }

    // Generate email based on name and company
    generateEmail() {
        const name = this.targetEmployee.toLowerCase().split(' ');
        return `${name[0]}.${name[1]}@${this.targetCompany.toLowerCase()}.com`;
    }

    // Add this new method to generate company details
    generateCompanyDetails() {
        const industries = [
            'Cybersecurity Solutions', 'Cloud Computing', 'Financial Technology',
            'Data Analytics', 'Enterprise Software', 'Digital Infrastructure'
        ];
        
        const locations = [
            'Silicon Valley, CA', 'Boston, MA', 'Austin, TX',
            'Seattle, WA', 'New York, NY', 'Denver, CO'
        ];
        
        const revenues = [
            '$50M - $100M', '$100M - $250M', '$250M - $500M',
            '$500M - $1B', '$1B - $2B', '$2B+'
        ];
        
        const employeeCounts = [
            '100-250', '250-500', '500-1000',
            '1000-2500', '2500-5000', '5000+'
        ];

        return {
            industry: industries[Math.floor(Math.random() * industries.length)],
            location: locations[Math.floor(Math.random() * locations.length)],
            founded: 2000 + Math.floor(Math.random() * 20), // Random year between 2000-2020
            revenue: revenues[Math.floor(Math.random() * revenues.length)],
            employees: employeeCounts[Math.floor(Math.random() * employeeCounts.length)],
            stockSymbol: this.targetCompany.substring(0, 4).toUpperCase(),
            website: `www.${this.targetCompany.toLowerCase()}.com`
        };
    }

    start() {
        this.currentStep = 0;
        this.attempts = 0;
        this.terminal.printOutput("\n=== Level 3: Social Engineering ===\n");
        this.terminal.printOutput("Oh, you think you're ready for psychological warfare? How cute! 🎭\n");
        this.steps[0].call(this);
    }

    introduction() {
        const intro = [
            "=== Level 3: Social Engineering ===",
            "",
            `Target Organization: ${this.targetCompany}`,
            "Objective: Gain access through social engineering",
            "",
            "Phase 1: Reconnaissance",
            "Gather information about the target organization",
            "",
            "Command Syntax:",
            `recon --target ${this.targetCompany}`,
            "",
            "Remember: Social engineering requires patience and attention to detail",
            "Type 'help' for guidance, if your social skills are as bad as your hacking skills 😉"
        ];
        this.printWithDelay(intro);
    }

    handleCommand(command, args) {
        if (command === 'restart') {
            this.handleRestart();
            return;
        }

        if (command === 'exit') {
            this.handleExit();
            return;
        }

        if (command === 'help') {
            this.showCurrentObjective();
            return;
        }

        if (this.currentStep < this.steps.length) {
            switch (this.currentStep) {
                case 0: // Recon phase
                    if (command === 'recon' && args[0] === '--target' && args[1].toLowerCase() === this.targetCompany.toLowerCase()) {
                        this.reconPhase();
                    } else {
                        const reconFailures = [
                            "Your OSINT skills are as sharp as a rubber ball! 🎾",
                            "Are you trying to hack Google by accident? Wrong company! 🔍",
                            "Even LinkedIn would reject your reconnaissance attempt! 💼",
                            "That's not how you spell the company name... or anything else! 📝",
                            "Your research skills make Wikipedia look reliable! 📚",
                            "Did you learn social engineering from a fortune cookie? 🥠",
                            "Error 404: Research skills not found! 🔎"
                        ];
                        this.handleFailure(reconFailures[Math.floor(Math.random() * reconFailures.length)]);
                    }
                    break;

                case 1: // Phishing preparation
                    if (command === 'analyze' && args[0] === '--employee' && 
                        args.slice(1).join(' ').toLowerCase() === this.targetEmployee.toLowerCase()) {
                        this.phishingPhase();
                    } else {
                        const analysisFailures = [
                            "Wrong employee! Are you stalking the janitor? 🧹",
                            "That's not even a real person! Did you make that up? 👻",
                            "Your target analysis is as accurate as a horoscope! ♎",
                            "LinkedIn would like to know your location... to block you! 🚫",
                            "Error: Employee not found in the 'People You Might Know' section! 💭",
                            "Are you trying to social engineer yourself? That's sad... 😢",
                            "Your investigation skills make Sherlock Holmes cry! 🔍"
                        ];
                        this.handleFailure(analysisFailures[Math.floor(Math.random() * analysisFailures.length)]);
                    }
                    break;

                case 2: // Create phishing email
                    const emailCmd = args.join(' ');
                    if (command === 'craft' && this.validatePhishingEmail(emailCmd)) {
                        this.exploitPhase();
                    } else {
                        const phishingFailures = [
                            "Your phishing email is less convincing than a Nigerian prince! 👑",
                            "Even spam filters are laughing at your attempt! 📧",
                            "Did you learn email writing from a cat walking on keyboard? 🐱",
                            "Your social engineering is about as subtle as a DDoS attack! 💣",
                            "Error: Persuasion level below 'Please click here'! 🎣",
                            "That email would only fool your grandmother... maybe! 👵",
                            "The spam folder just filed a restraining order! ⚖️"
                        ];
                        this.handleFailure(phishingFailures[Math.floor(Math.random() * phishingFailures.length)]);
                    }
                    break;

                case 3: // Final exploitation
                    if (command === 'exploit' && this.validateExploit(args.join(' '))) {
                        this.complete();
                    } else {
                        const exploitFailures = [
                            "Your exploit attempt is less reliable than Windows ME! 💾",
                            "Task failed successfully: You played yourself! 🎮",
                            "The target is literally dying of laughter! ⚰️",
                            "Error 418: I'm a teapot, and you're not getting any tea! ☕",
                            "Your exploit is so bad, it fixed a vulnerability! 🛠️",
                            "Successfully failed to fail successfully! 🔄",
                            "The system just rage-quit! 🤬"
                        ];
                        this.handleFailure(exploitFailures[Math.floor(Math.random() * exploitFailures.length)]);
                    }
                    break;
            }
        }
    }

    reconPhase() {
        this.currentStep = 1;
        
        // Print each piece of information separately and immediately
        this.terminal.printOutput("=== Reconnaissance Results ===");
        this.terminal.printOutput("");
        
        // Company Information
        this.terminal.printOutput("Company Information:");
        this.terminal.printOutput(this.createCopyableOutput(`Company: ${this.targetCompany}`));
        this.terminal.printOutput(`Industry: ${this.companyDetails.industry}`);
        this.terminal.printOutput(`Headquarters: ${this.companyDetails.location}`);
        this.terminal.printOutput(`Founded: ${this.companyDetails.founded}`);
        this.terminal.printOutput(`Revenue: ${this.companyDetails.revenue}`);
        this.terminal.printOutput(`Employees: ${this.companyDetails.employees}`);
        this.terminal.printOutput(`Stock Symbol: ${this.companyDetails.stockSymbol}`);
        this.terminal.printOutput(`Website: ${this.companyDetails.website}`);
        this.terminal.printOutput("");
        
        // Employee Information
        this.terminal.printOutput("Key Employee Identified:");
        this.terminal.printOutput(this.createCopyableOutput(`Name: ${this.targetEmployee}`));
        this.terminal.printOutput(this.createCopyableOutput(`Department: ${this.targetDepartment}`));
        this.terminal.printOutput(this.createCopyableOutput(`Email: ${this.targetEmail}`));
        this.terminal.printOutput("");
        
        // Next Steps
        this.terminal.printOutput("Next Step:");
        this.terminal.printOutput("Analyze the employee's profile for potential vulnerabilities");
        this.terminal.printOutput("");
        this.terminal.printOutput("Command:");
        this.terminal.printOutput(this.createCopyableOutput(`analyze --employee ${this.targetEmployee}`));
    }

    phishingPhase() {
        this.currentStep = 2;
        const output = [
            this.printHeader("=== Employee Analysis Complete ==="),
            this.printDivider(),
            
            this.printSubheader("Vulnerability Assessment:"),
            "- Recently requested IT support for password reset",
            "- Active on professional networks",
            "- Frequently mentions project deadlines",
            
            this.printDivider(),
            
            this.printSubheader("Craft Phishing Email:"),
            "Required elements:",
            "- Proper email format",
            "- Convincing subject line",
            "- Urgent call to action",
            "- Company branding reference",
            
            this.printSubheader("Command Syntax:"),
            this.printCommand("craft --email 'subject: text' --body 'message' --urgent --brand"),
            
            this.printDivider(),
            
            "Tip: Include relevant details from reconnaissance"
        ];
        this.printWithDelay(output);
    }

    exploitPhase() {
        this.currentStep = 3;
        const output = [
            this.printHeader("=== Phishing Attack Successful ==="),
            this.printDivider(),
            
            this.printSubheader("Target Response:"),
            "✓ Email opened",
            "✓ Link clicked",
            "✓ Form accessed",
            
            this.printDivider(),
            
            this.printSubheader("Final Step:"),
            "Execute credential harvester",
            
            this.printCommand("exploit --harvest credentials --target employee")
        ];
        this.printWithDelay(output);
    }

    validatePhishingEmail(emailCmd) {
        // Check if email contains required elements
        const hasSubject = emailCmd.includes('--email') && emailCmd.includes('subject:');
        const hasBody = emailCmd.includes('--body');
        const hasUrgent = emailCmd.includes('--urgent');
        const hasBrand = emailCmd.includes('--brand');
        
        // Check if email contains target-specific information
        const hasTargetName = emailCmd.toLowerCase().includes(this.targetEmployee.toLowerCase());
        const hasDepartment = emailCmd.toLowerCase().includes(this.targetDepartment.toLowerCase());
        const hasCompany = emailCmd.toLowerCase().includes(this.targetCompany.toLowerCase());

        return hasSubject && hasBody && hasUrgent && hasBrand && 
               (hasTargetName || hasDepartment || hasCompany);
    }

    validateExploit(cmd) {
        return cmd.includes('--harvest') && 
               cmd.includes('credentials') && 
               cmd.includes('--target') && 
               cmd.includes('employee');
    }

    complete() {
        this.currentStep = 4;
        const sarcasticPraise = [
            "🎭 Congratulations! You've successfully manipulated your way to victory! 🎭",
            "Achievement Unlocked: 'Master of Digital Deception' (aka Professional Liar)",
            "",
            "New Skills Acquired:",
            "- Advanced Copy-Paste Psychology 📋",
            "- Professional Email Writing (Nigerian Prince Level) 👑",
            "- Social Skills (Digital Only) 💻",
            "- Creative Writing (For Evil Purposes) ✍️",
            "- Advanced Pretending to be Important 🎯",
            "",
            "Career Options Unlocked:",
            "- Professional Phisher (Fish not included) 🎣",
            "- Digital Con Artist (Now with ASCII Art!) 🎨",
            "- Spam Email Composer (Premium Position) 📧",
            "- Professional Pretender (Acting Skills Optional) 🎭",
            "",
            "WARNING: Level 4 will require:",
            "- Actual technical skills (Oh no!) 💻",
            "- Real hacking knowledge (The horror!) 🔓",
            "- Less social engineering, more real engineering (Good luck!) 🛠️",
            "- Brain usage: Maximum capacity (Better upgrade that CPU!) 🧠",
            "",
            "Type 'start 4' when you're ready to face real challenges!",
            "Or type 'help' if you need to cry in the corner... 😢",
            "",
            "Progress saved... Your LinkedIn profile just got more interesting! 💼",
            "(Just don't mention the 'ethical' part was optional) 😈"
        ];
        this.printWithDelay(sarcasticPraise);
        
        // Update user progress
        const user = auth.users[auth.currentUser];
        if (!user.progress.completedLevels.includes(3)) {
            user.progress.completedLevels.push(3);
            user.progress.currentLevel = Math.max(4, user.progress.currentLevel);
            localStorage.setItem('users', JSON.stringify(auth.users));
        }

        // Call parent complete to reset terminal state
        super.complete();
    }
}

class Level4 extends GameLevel {
    constructor(terminal) {
        super(terminal);
        this.steps = [
            this.introduction,
            this.vulnerabilityScan,
            this.exploitSelection,
            this.gainAccess,
            this.privilegeEscalation,
            this.complete
        ];

        // Generate random target details
        this.targetSystem = this.generateTargetSystem();
        this.vulnerabilities = this.generateVulnerabilities();
        this.currentExploit = null;
    }

    generateTargetSystem() {
        const systems = [
            {
                name: "Ubuntu Server",
                version: `20.${Math.floor(Math.random() * 4)}.${Math.floor(Math.random() * 5)}`,
                kernel: `5.4.${Math.floor(Math.random() * 100)}`,
                services: ["SSH", "Apache", "MySQL", "Redis"]
            },
            {
                name: "CentOS",
                version: `8.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 4)}`,
                kernel: `4.18.${Math.floor(Math.random() * 100)}`,
                services: ["SSH", "Nginx", "PostgreSQL", "MongoDB"]
            },
            {
                name: "Debian",
                version: `11.${Math.floor(Math.random() * 5)}`,
                kernel: `5.10.${Math.floor(Math.random() * 100)}`,
                services: ["SSH", "Apache", "MariaDB", "Memcached"]
            }
        ];
        return systems[Math.floor(Math.random() * systems.length)];
    }

    generateVulnerabilities() {
        const vulnTypes = [
            {
                name: "Buffer Overflow",
                cve: `CVE-2023-${Math.floor(Math.random() * 9000) + 1000}`,
                severity: "Critical",
                service: "Redis",
                exploit: "exploit/linux/redis/redis_overflow"
            },
            {
                name: "Remote Code Execution",
                cve: `CVE-2023-${Math.floor(Math.random() * 9000) + 1000}`,
                severity: "High",
                service: "Apache",
                exploit: "exploit/linux/http/apache_rce"
            },
            {
                name: "Privilege Escalation",
                cve: `CVE-2023-${Math.floor(Math.random() * 9000) + 1000}`,
                severity: "Critical",
                service: "Kernel",
                exploit: "exploit/linux/local/kernel_exploit"
            }
        ];
        return vulnTypes[Math.floor(Math.random() * vulnTypes.length)];
    }

    start() {
        this.currentStep = 0;
        this.attempts = 0;
        this.terminal.printOutput("\n=== Level 4: Advanced System Exploitation ===\n");
        this.terminal.printOutput("Welcome to the big leagues, script kiddie! Time for some real hacking! 🎯\n");
        this.steps[0].call(this);
    }

    introduction() {
        const intro = [
            "=== Level 4: Advanced System Exploitation ===",
            "",
            "Target System Information:",
            this.createCopyableOutput(`OS: ${this.targetSystem.name} ${this.targetSystem.version}`),
            this.createCopyableOutput(`Kernel: ${this.targetSystem.kernel}`),
            "Running Services: " + this.targetSystem.services.join(", "),
            "",
            "Phase 1: Vulnerability Assessment",
            "Scan the target system for exploitable vulnerabilities",
            "",
            "Command Syntax:",
            "vuln-scan --target <system> --service <service>",
            "",
            "Example: vuln-scan --target system --service apache",
            "",
            "Available services to scan:",
            ...this.targetSystem.services.map(s => `- ${s.toLowerCase()}`),
            "- kernel (for local privilege escalation)",
            "",
            "Remember: Real hackers analyze before they attack! 🔍"
        ];
        this.printWithDelay(intro);
    }

    handleCommand(command, args) {
        if (command === 'restart') {
            this.handleRestart();
            return;
        }

        if (command === 'exit') {
            this.handleExit();
            return;
        }

        if (command === 'help') {
            this.showCurrentObjective();
            return;
        }

        switch (this.currentStep) {
            case 0: // Vulnerability scanning phase
                if (command === 'vuln-scan') {
                    const targetArg = args.indexOf('--target');
                    const serviceArg = args.indexOf('--service');
                    
                    if (targetArg === -1 || serviceArg === -1) {
                        this.handleFailure("Invalid command syntax! Try: vuln-scan --target system --service <service_name>");
                        return;
                    }

                    const service = args[serviceArg + 1]?.toLowerCase();
                    if (this.targetSystem.services.map(s => s.toLowerCase()).includes(service) || service === 'kernel') {
                        if (service === this.vulnerabilities.service.toLowerCase()) {
                            this.vulnerabilityScan();
                        } else {
                            this.handleFailure(`No critical vulnerabilities found in ${service}. Keep scanning! 🔍`);
                        }
                    } else {
                        this.handleFailure("Invalid service! Are you trying to hack a toaster? 🍞");
                    }
                } else {
                    this.handleFailure("Unknown command! 'hack_everything.exe' is not a valid vulnerability scanner! 🎮");
                }
                break;

            case 1: // Exploit selection phase
                if (command === 'exploit' && args[0] === '--select') {
                    const exploitPath = args.slice(1).join(' ');
                    if (exploitPath === this.vulnerabilities.exploit) {
                        this.currentExploit = exploitPath;
                        this.exploitSelection();
                    } else {
                        this.handleFailure("Wrong exploit! That's like bringing a spoon to a gunfight! 🥄");
                    }
                } else {
                    this.handleFailure("Invalid command! Exploits don't deploy themselves... usually! 💣");
                }
                break;

            case 2: // Initial access phase
                if (command === 'exploit' && args[0] === '--execute' && args[1] === '--target') {
                    const targetService = args[2]?.toLowerCase();
                    if (targetService === this.vulnerabilities.service.toLowerCase()) {
                        this.gainAccess();
                    } else {
                        this.handleFailure("Wrong target! You're about as precise as a drunk archer! 🎯");
                    }
                } else {
                    this.handleFailure("Invalid exploit syntax! Did you learn hacking from a fortune cookie? 🥠");
                }
                break;

            case 3: // Privilege escalation phase
                if (command === 'privesc' && args[0] === '--exploit' && args[1] === 'kernel' && args[2] === '--escalate' && args[3] === 'root') {
                    this.privilegeEscalation();
                } else {
                    this.handleFailure("Wrong privesc command! Sudo make me a sandwich? 🥪");
                }
                break;
        }
    }

    showCurrentObjective() {
        this.terminal.printOutput("Available commands:");
        this.terminal.printOutput("  restart  - Restart current level");
        this.terminal.printOutput("  exit     - Return to main menu (for quitters)");
        this.terminal.printOutput("  help     - Show this help message");
        this.terminal.printOutput("");

        switch (this.currentStep) {
            case 0:
                this.terminal.printOutput("Current objective: Scan for vulnerabilities");
                this.terminal.printOutput("Command: vuln-scan --target system --service <service_name>");
                break;
            case 1:
                this.terminal.printOutput("Current objective: Select appropriate exploit");
                this.terminal.printOutput("Command: exploit --select <exploit_path>");
                break;
            case 2:
                this.terminal.printOutput("Current objective: Execute exploit against target");
                this.terminal.printOutput("Command: exploit --execute --target <service>");
                break;
            case 3:
                this.terminal.printOutput("Current objective: Escalate privileges");
                this.terminal.printOutput("Command: privesc --exploit kernel --escalate root");
                break;
        }
    }

    vulnerabilityScan() {
        this.currentStep = 1;
        const output = [
            "=== Vulnerability Scan Results ===",
            "",
            "Critical Vulnerability Found!",
            this.createCopyableOutput(`Type: ${this.vulnerabilities.name}`),
            this.createCopyableOutput(`CVE: ${this.vulnerabilities.cve}`),
            `Severity: ${this.vulnerabilities.severity}`,
            `Affected Service: ${this.vulnerabilities.service}`,
            "",
            "Next Step: Select and configure exploit",
            "",
            "Available Exploit:",
            this.createCopyableOutput(this.vulnerabilities.exploit),
            "",
            "Command:",
            "exploit --select <exploit_path>"
        ];
        this.printWithDelay(output);
    }

    exploitSelection() {
        this.currentStep = 2;
        const output = [
            "=== Exploit Configuration Complete ===",
            "",
            "Selected Exploit:",
            this.createCopyableOutput(`Path: ${this.currentExploit}`),
            "Status: Ready to execute",
            "",
            "Target Information:",
            `Service: ${this.vulnerabilities.service}`,
            `Port: ${this.vulnerabilities.service === 'Redis' ? '6379' : 
                    this.vulnerabilities.service === 'Apache' ? '80' : 
                    this.vulnerabilities.service === 'Nginx' ? '80' : '0'}`,
            "",
            "Execute exploit with:",
            this.createCopyableOutput(`exploit --execute --target ${this.vulnerabilities.service.toLowerCase()}`),
            "",
            "Warning: Accuracy is crucial. One wrong move and you're busted! 🎯"
        ];
        this.printWithDelay(output);
    }

    gainAccess() {
        this.currentStep = 3;
        const output = [
            "=== Initial Access Achieved ===",
            "",
            "🎯 Exploit successful!",
            "✓ Payload delivered",
            "✓ Reverse shell established",
            "✓ System access granted",
            "",
            "Current Access Level: user",
            "Privileges: Limited",
            "",
            "Next Step: Privilege Escalation",
            "Target: root access",
            "",
            "Command:",
            "privesc --exploit kernel --escalate root",
            "",
            "Note: Almost there! Time to become root! 💪"
        ];
        this.printWithDelay(output);
    }

    privilegeEscalation() {
        this.currentStep = 4;
        const output = [
            "=== Privilege Escalation Successful ===",
            "",
            "🎉 Congratulations! Root access achieved!",
            "",
            "Final System Status:",
            "✓ Root privileges obtained",
            "✓ System fully compromised",
            "✓ Access persistence established",
            "",
            "You've successfully pwned the system!",
            "Time to celebrate... ethically, of course! 🎭"
        ];
        this.printWithDelay(output);
        
        // Complete the level after showing the success message
        setTimeout(() => this.complete(), 3000);
    }

    complete() {
        const completion = [
            "🏆 Level 4 Completed: Advanced System Exploitation Master! 🏆",
            "",
            "Skills Unlocked:",
            "- Professional Vulnerability Scanner 🔍",
            "- Expert Exploit Configurator 🛠️",
            "- Root Access Conqueror 👑",
            "- System Permission Juggler 🤹",
            "",
            "Career Update:",
            "- From Script Kiddie to Actually Dangerous! 📈",
            "- Resume Updated: 'Professional System Pwner' 💼",
            "- New Title: 'The Root Whisperer' 👻",
            "",
            "Next Challenge: Level 5",
            "Warning: It only gets harder from here! 😈",
            "",
            "Type 'start 5' when you're ready for the next challenge!",
            "(If you dare... 🎭)"
        ];
        this.printWithDelay(completion);

        // Update user progress
        const user = auth.users[auth.currentUser];
        if (!user.progress.completedLevels.includes(4)) {
            user.progress.completedLevels.push(4);
            user.progress.currentLevel = Math.max(5, user.progress.currentLevel);
            localStorage.setItem('users', JSON.stringify(auth.users));
        }

        // Call parent complete to reset terminal state
        super.complete();
    }
} 
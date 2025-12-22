/**
 * Cyberpunk Terminal Style - Effects and advanced configuration
 */

class CyberpunkTerminalEffects {
    static MODULE_ID = 'cyberpunk-starfinder-terminal-style';
    static MODULE_TITLE = 'Cyberpunk Starfinder Terminal Style';
    static isApplyingPreset = false; // Flag para evitar updates durante preset application

    static init() {
        console.log(`${this.MODULE_TITLE} | Initializing terminal effects`);

        // Register module settings
        this.registerSettings();

        // Apply initial effects
        this.applyTerminalEffects();

        // Hook to apply effects when windows open
        Hooks.on('renderApplication', this.onRenderApplication.bind(this));

        // Hook to reload styles when settings change
        Hooks.on('closeSettingsConfig', this.onSettingsClose.bind(this));
    }

    static registerSettings() {


        // === PRESET SETTINGS ===

        // Color presets
        game.settings.register(this.MODULE_ID, 'colorPreset', {
            name: 'Color Presets',
            hint: 'Select a predefined color preset',
            scope: 'world',
            config: true,
            type: String,
            choices: {
                'custom': 'Custom ⚙️',

                // Classic primero
                'classic-green': 'Classic Green 🟢',
                'classic-green-orange': 'Classic Green-Orange 🟠',

                // Resto ordenados alfabéticamente
                'amber': 'Retro Amber 🟠',
                'black-ice': 'Black Ice ❄️',
                'blood-red': 'Blood Red 🩸',
                'blue': 'Cyberpunk Blue 🔵',
                'bright-green': 'Bright Green 💚',
                'circuit-blue': 'Circuit Blue 🖥️',
                'cold-steel': 'Cold Steel 🧊',
                'corpo-silver': 'Corpo Silver ⚪',
                'cyan-bright': 'Bright Cyan 🔷',
                'deep-violet': 'Deep Violet 🔮',
                'dim-green': 'Dim Green 🌿',
                'ember-orange': 'Ember Orange 🔥',
                'ghost-white': 'Ghost White ⚪',
                'glitch-pink': 'Glitch Pink 🌀',
                'holo-cyan': 'Holo Cyan 🟦',
                'ice-blue': 'Ice Blue 🧊',
                'infrared': 'Infrared 🌡️',
                'magenta': 'Retro Magenta 💗',
                'neon-gold': 'Neon Gold 🌕',
                'night-ops': 'Night Ops 🌌',
                'orange-glow': 'Phosphor Orange 🟠',
                'plasma-green': 'Plasma Green 💚',
                'purple': 'Neon Purple 🟣',
                'quantum-blue': 'Quantum Blue 🔹',
                'red': 'Matrix Red 🔴',
                'retro-green': 'Retro Green 💚',
                'shadow-purple': 'Shadow Purple 🟪',
                'signal-orange': 'Signal Orange 🟧',
                'synthetic-cyan': 'Synthetic Cyan 🟦',
                'teal': 'Teal 🟦',
                'terminal-gray': 'Terminal Gray ⚫️',
                'toxic-green': 'Toxic Green ☣️',
                'violet-neon': 'Neon Violet 🟣',
                'void-black': 'Void Black ⚫️',
                'warpaint-red': 'Warpaint Red 🩸',
                'yellow-phosphor': 'Phosphor Yellow 🟡'
            },
            default: 'holo-cyan',
            onChange: this.applyColorPreset.bind(this)
        });

        // === FONT SETTINGS ===

        // Font family
        game.settings.register(this.MODULE_ID, 'fontFamily', {
            name: 'Font Family',
            hint: 'Select the font for the terminal theme',
            scope: 'world',
            config: true,
            type: String,
            choices: {
                'mono': 'Share Tech Mono (Recommended)',
                'courier': 'Courier Prime',
                'consolas': 'Consolas',
                'menlo': 'Menlo',
                'monaco': 'Monaco',
                'ubuntu': 'Ubuntu Mono',
                'roboto-mono': 'Roboto Mono',
                'pt-mono': 'PT Mono',
                'space-mono': 'Space Mono',
                'ibm-plex-mono': 'IBM Plex Mono',
                'fira-mono': 'Fira Mono',
                'jetbrains-mono': 'JetBrains Mono',
                'cutive-mono': 'Cutive Mono',
                'overpass-mono': 'Overpass Mono',
                'press-start': 'Press Start 2P',
                'vt323': 'VT323'
            },
            default: 'mono',
            onChange: this.updateFontFamily.bind(this)
        });

        // Base font size
        game.settings.register(this.MODULE_ID, 'fontSize', {
            name: 'Font Size',
            hint: 'Base font size in pixels',
            scope: 'world',
            config: true,
            type: Number,
            range: {
                min: 9,
                max: 36,
                step: 1
            },
            default: 19,
            onChange: this.updateFontSize.bind(this)
        });


        // === EFFECTS SETTINGS ===

        // Glow intensity setting
        game.settings.register(this.MODULE_ID, 'glowIntensity', {
            name: 'Glow Intensity',
            hint: 'Controls the intensity of the green glow effect',
            scope: 'world',
            config: true,
            type: Number,
            range: {
                min: 1,
                max: 100,
                step: 1
            },
            default: 6,
            onChange: this.updateGlowIntensity.bind(this)
        });

        // Animation speed setting
        game.settings.register(this.MODULE_ID, 'animationSpeed', {
            name: 'Animation Speed',
            hint: 'Controls the speed of animations (ms)',
            scope: 'world',
            config: true,
            type: Number,
            range: {
                min: 1,
                max: 2000,
                step: 1
            },
            default: 150,
            onChange: this.updateAnimationSpeed.bind(this)
        });


        // === CUSTOM COLOR SETTINGS ===
        // NOTA: Los defaults ahora coinciden con classic-green

        // Border color
        game.settings.register(this.MODULE_ID, 'borderColor', {
            name: 'Border Color',
            hint: 'Set the color used for borders in the interface.',
            scope: 'world',
            config: true,
            type: String,
            default: '#33ffff',  // ✅ holo-cyan
            onChange: this.updateColors.bind(this)
        });

        // Main UI text color
        game.settings.register(this.MODULE_ID, 'mainTextColor', {
            name: 'Text Color',
            hint: 'Main UI text color',
            scope: 'world',
            config: true,
            type: String,
            default: '#99ffff',  // ✅ holo-cyan
            onChange: this.updateColors.bind(this)
        });

        // Dim UI text color
        game.settings.register(this.MODULE_ID, 'dimTextColor', {
            name: 'Dim Text Color',
            hint: 'Dim UI text color',
            scope: 'world',
            config: true,
            type: String,
            default: '#66b3b3',  // ✅ holo-cyan
            onChange: this.updateColors.bind(this)
        });

        // Foundry Menu and Icons text color
        game.settings.register(this.MODULE_ID, 'foundryMenuIconColor', {
            name: 'Foundry Menu and Icons text color',
            hint: 'Foundry Menu and Icons text color',
            scope: 'world',
            config: true,
            type: String,
            default: '#ccffff',  // ✅ holo-cyan
            onChange: this.updateColors.bind(this)
        });

        // Console Log Color
        game.settings.register(this.MODULE_ID, 'consoleLogColor', {
            name: 'Console Log Color',
            hint: 'Console Log Color',
            scope: 'world',
            config: true,
            type: String,
            default: '#22cccc',  // ✅ holo-cyan
            onChange: this.updateColors.bind(this)
        });

        // Background color
        game.settings.register(this.MODULE_ID, 'backgroundColor', {
            name: 'Background Color',
            hint: 'Background color',
            scope: 'world',
            config: true,
            type: String,
            default: '#001414',  // ✅ holo-cyan
            onChange: this.updateColors.bind(this)
        });


        // Button to reset settings
        game.settings.register(this.MODULE_ID, 'resetSettings', {
            name: '**Reset style to default**',
            hint: 'Check this box and click Save changes to reset all settings.',
            scope: 'world',
            config: true,
            type: Boolean,
            default: false,
            onChange: (value) => {
                // Only act if changed to TRUE (checked)
                if (value === true) {
                    this.resetAllSettings();
                }
            }
        });
    }

    static updateColors() {
        // Evitar updates mientras se aplica un preset
        if (this.isApplyingPreset) {
            console.log(`${this.MODULE_TITLE} | Skipping updateColors (preset application in progress)`);
            return;
        }

        const borderColor = game.settings.get(this.MODULE_ID, 'borderColor');
        const consoleLogColor = game.settings.get(this.MODULE_ID, 'consoleLogColor');
        const foundryMenuIconColor = game.settings.get(this.MODULE_ID, 'foundryMenuIconColor');
        const backgroundColor = game.settings.get(this.MODULE_ID, 'backgroundColor');
        const mainTextColor = game.settings.get(this.MODULE_ID, 'mainTextColor');
        const dimTextColor = game.settings.get(this.MODULE_ID, 'dimTextColor');


        // Create dynamic CSS for colors
        const style = document.getElementById('terminal-color-style') || document.createElement('style');
        style.id = 'terminal-color-style';

        style.textContent = `
            :root {
                --terminal-bg: ${backgroundColor} !important;
                --terminal-primary: ${foundryMenuIconColor} !important;
                --terminal-secondary: ${consoleLogColor} !important;
                --terminal-dim: ${dimTextColor} !important;
                --terminal-text: ${mainTextColor} !important; 
                --terminal-border: ${borderColor} !important;
                
            }
        `;

        if (!document.getElementById('terminal-color-style')) {
            document.head.appendChild(style);
        }

        this.updateGlowIntensity(); // Update glow with new colors
    }

    static updateFontSize() {
        const fontSize = game.settings.get(this.MODULE_ID, 'fontSize');

        // Create dynamic CSS for font size
        const style = document.getElementById('terminal-font-size-style') || document.createElement('style');
        style.id = 'terminal-font-size-style';

        style.textContent = `
            :root {
                --terminal-font-size: ${fontSize}px !important;
            }
            
            @media (max-width: 768px) {
                :root {
                    --terminal-font-size: ${Math.max(12, fontSize - 4)}px !important;
                }
            }
        `;

        if (!document.getElementById('terminal-font-size-style')) {
            document.head.appendChild(style);
        }
    }

    static updateFontFamily() {
        const fontFamily = game.settings.get(this.MODULE_ID, 'fontFamily');

        let fontStack = '';
        switch (fontFamily) {
            case 'courier':
                fontStack = "'Courier Prime', 'Courier New', monospace";
                break;
            case 'mono':
                fontStack = "'Share Tech Mono', 'Courier New', monospace";
                break;
            case 'consolas':
                fontStack = "'Consolas', 'Monaco', monospace";
                break;
            case 'menlo':
                fontStack = "'Menlo', 'Monaco', monospace";
                break;
            case 'monaco':
                fontStack = "'Monaco', 'Menlo', monospace";
                break;
            case 'ubuntu':
                fontStack = "'Ubuntu Mono', 'Courier New', monospace";
                break;
            case 'roboto-mono':
                fontStack = "'Roboto Mono', 'Courier New', monospace";
                break;
            case 'pt-mono':
                fontStack = "'PT Mono', 'Courier New', monospace";
                break;
            case 'space-mono':
                fontStack = "'Space Mono', 'Courier New', monospace";
                break;
            case 'ibm-plex-mono':
                fontStack = "'IBM Plex Mono', 'Courier New', monospace";
                break;
            case 'fira-mono':
                fontStack = "'Fira Mono', 'Courier New', monospace";
                break;
            case 'jetbrains-mono':
                fontStack = "'JetBrains Mono', 'Courier New', monospace";
                break;
            case 'cutive-mono':
                fontStack = "'Cutive Mono', 'Courier New', monospace";
                break;
            case 'overpass-mono':
                fontStack = "'Overpass Mono', 'Courier New', monospace";
                break;
            case 'press-start':
                fontStack = "'Press Start 2P', 'Courier New', monospace";
                break;
            case 'vt323':
                fontStack = "'VT323', 'Courier New', monospace";
                break;
            default:
                fontStack = "'Courier Prime', 'Share Tech Mono', monospace";
        }

        // Create dynamic CSS for font
        const style = document.getElementById('terminal-font-family-style') || document.createElement('style');
        style.id = 'terminal-font-family-style';

        style.textContent = `
            :root {
                --terminal-font: ${fontStack} !important;
            }
        `;

        if (!document.getElementById('terminal-font-family-style')) {
            document.head.appendChild(style);
        }
    }

    static async applyColorPreset(newValue) {
        // Usar el parámetro que onChange pasa automáticamente
        const preset = newValue || game.settings.get(this.MODULE_ID, 'colorPreset');

        console.log(`${this.MODULE_TITLE} | applyColorPreset called with: ${preset}`);

        // Solo retornar si el NUEVO preset es 'custom'
        if (preset === 'custom') {
            console.log(`${this.MODULE_TITLE} | Custom preset selected, no changes applied`);
            return;
        }

        const presets = {
            // === CLASSIC FIRST ===
            'classic-green': {
                border: '#00ff00',
                console: '#00cc00',
                text: '#99ff99',
                dimText: '#55aa55',
                background: '#000000',
                foundryMenuIcon: '#ccffcc'
            },
            'classic-green-orange': {
                border: '#00ff33',
                console: '#00aa22',
                text: '#ff7f1a',
                dimText: '#b35a12',
                background: '#000000',
                foundryMenuIcon: '#ffb366'
            },

            // === REST ORDERED ALPHA ===
            'amber': {
                border: '#ffaa00',
                console: '#cc8800',
                text: '#ffe6b3',
                dimText: '#b39980',
                background: '#110800',
                foundryMenuIcon: '#fff0cc'
            },
            'black-ice': {
                border: '#66ccff',
                console: '#3399cc',
                text: '#aaddff',
                dimText: '#6f96b3',
                background: '#000611',
                foundryMenuIcon: '#cce9ff'
            },
            'blood-red': {
                border: '#ff3333',
                console: '#cc2222',
                text: '#ff9999',
                dimText: '#b36b6b',
                background: '#1a0000',
                foundryMenuIcon: '#ffb3b3'
            },
            'blue': {
                border: '#0099ff',
                console: '#0077cc',
                text: '#99d6ff',
                dimText: '#6691b3',
                background: '#001122',
                foundryMenuIcon: '#cceaff'
            },
            'bright-green': {
                border: '#00ff66',
                console: '#00cc44',
                text: '#99ffcc',
                dimText: '#66b394',
                background: '#001100',
                foundryMenuIcon: '#ccffe6'
            },
            'circuit-blue': {
                border: '#33ccff',
                console: '#2299cc',
                text: '#99e6ff',
                dimText: '#66a2b3',
                background: '#000d1a',
                foundryMenuIcon: '#ccefff'
            },
            'cold-steel': {
                border: '#88aaff',
                console: '#6688cc',
                text: '#ccd5ff',
                dimText: '#8f95b3',
                background: '#0a0a12',
                foundryMenuIcon: '#dde4ff'
            },
            'corpo-silver': {
                border: '#cccccc',
                console: '#999999',
                text: '#eeeeee',
                dimText: '#9e9e9e',
                background: '#0d0d0d',
                foundryMenuIcon: '#ffffff'
            },
            'cyan-bright': {
                border: '#00e5ff',
                console: '#00b3cc',
                text: '#99f3ff',
                dimText: '#66a8b3',
                background: '#00141a',
                foundryMenuIcon: '#ccf9ff'
            },
            'deep-violet': {
                border: '#aa33ff',
                console: '#771fcc',
                text: '#d8a6ff',
                dimText: '#9273b3',
                background: '#0d001a',
                foundryMenuIcon: '#e8ccff'
            },
            'dim-green': {
                border: '#006600',
                console: '#004400',
                text: '#66cc66',
                dimText: '#3d7a3d',
                background: '#000000',
                foundryMenuIcon: '#99e699'
            },
            'ember-orange': {
                border: '#ff9933',
                console: '#cc7722',
                text: '#ffd9b3',
                dimText: '#b38f80',
                background: '#1a0d00',
                foundryMenuIcon: '#ffe6cc'
            },
            'ghost-white': {
                border: '#eeeeee',
                console: '#cccccc',
                text: '#ffffff',
                dimText: '#9c9c9c',
                background: '#121212',
                foundryMenuIcon: '#ffffff'
            },
            'glitch-pink': {
                border: '#ff66cc',
                console: '#cc4fa3',
                text: '#ffb3e6',
                dimText: '#b37fa0',
                background: '#1a0014',
                foundryMenuIcon: '#ffd6f2'
            },
            'holo-cyan': {
                border: '#33ffff',
                console: '#22cccc',
                text: '#99ffff',
                dimText: '#66b3b3',
                background: '#001414',
                foundryMenuIcon: '#ccffff'
            },
            'ice-blue': {
                border: '#66ffff',
                console: '#44cccc',
                text: '#ccffff',
                dimText: '#80b3b3',
                background: '#001111',
                foundryMenuIcon: '#e6ffff'
            },
            'infrared': {
                border: '#ff3344',
                console: '#cc222f',
                text: '#ff99a5',
                dimText: '#b36b72',
                background: '#1a0003',
                foundryMenuIcon: '#ffb3bd'
            },
            'magenta': {
                border: '#ff00ff',
                console: '#cc00cc',
                text: '#ff99ff',
                dimText: '#b36bb3',
                background: '#1a001a',
                foundryMenuIcon: '#ffccff'
            },
            'neon-gold': {
                border: '#ffdd33',
                console: '#ccaa22',
                text: '#ffee99',
                dimText: '#b3a868',
                background: '#1a1700',
                foundryMenuIcon: '#fff2cc'
            },
            'night-ops': {
                border: '#88ffcc',
                console: '#66cca3',
                text: '#ccffe6',
                dimText: '#80b39c',
                background: '#000d08',
                foundryMenuIcon: '#e6fff3'
            },
            'orange-glow': {
                border: '#ff6600',
                console: '#cc5200',
                text: '#ffbb99',
                dimText: '#b3836b',
                background: '#1a0d00',
                foundryMenuIcon: '#ffd6cc'
            },
            'plasma-green': {
                border: '#77ff55',
                console: '#55cc33',
                text: '#caffb8',
                dimText: '#8ab380',
                background: '#061a00',
                foundryMenuIcon: '#e1ffd8'
            },
            'purple': {
                border: '#cc00ff',
                console: '#9900cc',
                text: '#e699ff',
                dimText: '#9e66b3',
                background: '#110022',
                foundryMenuIcon: '#f2ccff'
            },
            'quantum-blue': {
                border: '#44aaff',
                console: '#2288cc',
                text: '#b3d9ff',
                dimText: '#7996b3',
                background: '#000a19',
                foundryMenuIcon: '#d6eaff'
            },
            'red': {
                border: '#ff0066',
                console: '#cc0044',
                text: '#ff99bb',
                dimText: '#b36b80',
                background: '#110011',
                foundryMenuIcon: '#ffccdd'
            },
            'retro-green': {
                border: '#55ff55',
                console: '#33cc33',
                text: '#b3ffb3',
                dimText: '#80b380',
                background: '#000a00',
                foundryMenuIcon: '#d6ffd6'
            },
            'shadow-purple': {
                border: '#aa00ff',
                console: '#7700cc',
                text: '#d699ff',
                dimText: '#9266b3',
                background: '#0d0014',
                foundryMenuIcon: '#ebccff'
            },
            'signal-orange': {
                border: '#ff8844',
                console: '#cc6a33',
                text: '#ffd6bb',
                dimText: '#b38f80',
                background: '#1a0f06',
                foundryMenuIcon: '#ffe6d1'
            },
            'synthetic-cyan': {
                border: '#00ffee',
                console: '#00bbcc',
                text: '#99fff7',
                dimText: '#66b3ae',
                background: '#001212',
                foundryMenuIcon: '#ccfffa'
            },
            'teal': {
                border: '#00ffee',
                console: '#00ccbb',
                text: '#99fff7',
                dimText: '#66b3ae',
                background: '#001111',
                foundryMenuIcon: '#ccfffa'
            },
            'terminal-gray': {
                border: '#bbbbbb',
                console: '#888888',
                text: '#eeeeee',
                dimText: '#9c9c9c',
                background: '#000000',
                foundryMenuIcon: '#ffffff'
            },
            'toxic-green': {
                border: '#99ff00',
                console: '#77cc00',
                text: '#ccff99',
                dimText: '#8ab366',
                background: '#0d1a00',
                foundryMenuIcon: '#e6ffcc'
            },
            'violet-neon': {
                border: '#ff33cc',
                console: '#cc2299',
                text: '#ff99e6',
                dimText: '#b366a0',
                background: '#1a0011',
                foundryMenuIcon: '#ffccee'
            },
            'yellow-phosphor': {
                border: '#ffff66',
                console: '#cccc44',
                text: '#ffffcc',
                dimText: '#b3b38a',
                background: '#111100',
                foundryMenuIcon: '#ffffe6'
            },
            'void-black': {
                border: '#555555',
                console: '#333333',
                text: '#cccccc',
                dimText: '#7a7a7a',
                background: '#000000',
                foundryMenuIcon: '#e6e6e6'
            },
            'warpaint-red': {
                border: '#ff1122',
                console: '#cc0e19',
                text: '#ff99a3',
                dimText: '#b36b72',
                background: '#120002',
                foundryMenuIcon: '#ffccd1'
            }

        };

        if (presets[preset]) {
            const colors = presets[preset];
            console.log(`${this.MODULE_TITLE} | Applying colors:`, colors);

            // BLOQUEAR updateColors durante la aplicación
            this.isApplyingPreset = true;

            // Guardar todos los settings SIN disparar updateColors en cada onChange
            await Promise.all([
                game.settings.set(this.MODULE_ID, 'borderColor', colors.border),
                game.settings.set(this.MODULE_ID, 'consoleLogColor', colors.console),
                game.settings.set(this.MODULE_ID, 'foundryMenuIconColor', colors.foundryMenuIcon),
                game.settings.set(this.MODULE_ID, 'backgroundColor', colors.background),
                game.settings.set(this.MODULE_ID, 'mainTextColor', colors.text),
                game.settings.set(this.MODULE_ID, 'dimTextColor', colors.dimText)
            ]);

            console.log(`${this.MODULE_TITLE} | All color settings saved, now applying styles...`);

            // Esperar un momento para que Foundry persista los cambios
            await new Promise(resolve => setTimeout(resolve, 150));

            // DESBLOQUEAR y aplicar los colores visualmente UNA VEZ
            this.isApplyingPreset = false;
            this.updateColors();

            ui.notifications.info(`Color preset "${preset}" applied successfully.`);
        } else {
            console.warn(`${this.MODULE_TITLE} | Preset not found: ${preset}`);
        }
    }

    static applyTerminalEffects() {
        const body = document.body;

        // Apply all settings
        this.updateColors();
        this.updateFontSize();
        this.updateFontFamily();
        this.updateGlowIntensity();
        this.updateAnimationSpeed();
    }

    static updateGlowIntensity() {
        const intensity = game.settings.get(this.MODULE_ID, 'glowIntensity') || 50;
        const borderColor = game.settings.get(this.MODULE_ID, 'borderColor') || '#0f0';
        const glowValue = intensity * 0.3;

        let style = document.getElementById('terminal-glow-style');

        if (!style) {
            style = document.createElement('style');
            style.id = 'terminal-glow-style';
            document.head.appendChild(style);
        }

        style.textContent = `
            :root {
                --terminal-glow: 0 0 ${3 * glowValue}px ${borderColor}, 
                                0 0 ${6 * glowValue}px ${borderColor}, 
                                0 0 ${9 * glowValue}px ${borderColor};
                --terminal-text-shadow: 0 0 ${2 * glowValue}px ${borderColor};
            }
        `;
    }

    static updateAnimationSpeed() {
        const speed = game.settings.get(this.MODULE_ID, 'animationSpeed');

        const style = document.getElementById('terminal-animation-style') || document.createElement('style');
        style.id = 'terminal-animation-style';

        style.textContent = `
            .cyberpunk section.window-content::before {
                animation-duration: ${speed}ms !important;
            }
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
            .terminal-cursor::after,
            .cyberpunk h1.title::before,
            .cyberpunk h2::before {
                animation-duration: ${speed * 10}ms !important;
            }
            .terminal-effects-enabled .cyberpunk {
                animation-duration: ${speed}ms !important;
            }
        `;

        if (!document.getElementById('terminal-animation-style')) {
            document.head.appendChild(style);
        }
    }

    static resetAllSettings() {
        Dialog.confirm({
            title: "Reset Settings",
            content: "<p>Are you sure you want to reset all settings to default values?</p>",
            render: (html) => {
                // Apply styles to make the dialog taller and narrower without scrollbar
                const dialog = html.closest('.dialog');
                if (dialog.length) {
                    dialog.css({
                        'width': '320px !important',
                        'max-width': '90vw'
                    });
                    dialog.find('.window-content').css({
                        'font-size': '14px',
                        'padding': '20px',
                        'overflow': 'visible',
                        'max-height': 'none'
                    });
                    dialog.find('p').css({
                        'font-size': '15px',
                        'line-height': '1.6',
                        'margin-bottom': '20px',
                        'white-space': 'normal',
                        'word-wrap': 'break-word'
                    });
                    dialog.find('button').css({
                        'padding': '10px 20px',
                        'font-size': '14px',
                        'margin': '5px'
                    });
                }
            },
            yes: () => {

               // Default values - AHORA COINCIDEN CON HOLO-CYAN
                const defaults = {
                    borderColor: '#33ffff',
                    consoleLogColor: '#22cccc',
                    foundryMenuIconColor: '#ccffff',
                    dimTextColor: '#66b3b3',
                    backgroundColor: '#001414',
                    mainTextColor: '#99ffff',
                    fontSize: 19,
                    fontFamily: 'mono',
                    glowIntensity: 10,
                    animationSpeed: 150,
                    colorPreset: 'holo-cyan'
                };

                // Apply default values
                Object.entries(defaults).forEach(([key, value]) => {
                    game.settings.set(this.MODULE_ID, key, value);
                });

                // Uncheck the checkbox after completing the reset
                game.settings.set(this.MODULE_ID, 'resetSettings', false);

                // Reload effects
                this.applyTerminalEffects();

                ui.notifications.info("Settings reset to default values.");
            },
            no: () => {
                // Uncheck the checkbox if canceled
                game.settings.set(this.MODULE_ID, 'resetSettings', false);
            },
            defaultYes: false
        });
    }

    static onRenderApplication(app, html, data) {
        // Apply cyberpunk class to new windows
        html.addClass('cyberpunk');
    }

    static onSettingsClose() {
        // Reload effects when settings are closed
        setTimeout(() => {
            this.applyTerminalEffects();
        }, 100);
    }

    // Helper function to darken colors
    static darkenColor(color, factor) {
        // Convert hex to RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        // Darken
        const newR = Math.floor(r * factor);
        const newG = Math.floor(g * factor);
        const newB = Math.floor(b * factor);

        // Convert back to hex
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
}

// Initialize when Foundry is ready
Hooks.once('init', () => {
    CyberpunkTerminalEffects.init();
});

// Export for use in other files if necessary
window.CyberpunkTerminalEffects = CyberpunkTerminalEffects;

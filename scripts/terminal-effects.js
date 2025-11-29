/**
 * Cyberpunk Terminal Style - Effects and advanced configuration
 */

class CyberpunkTerminalEffects {
    static MODULE_ID = 'cyberpunk-starfinder-terminal-style';
    static MODULE_TITLE = 'Cyberpunk Starfinder Terminal Style';

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
                'custom': 'Custom',
                'classic-green': 'Classic Green',
                'classic-green-orange': 'Classic Green-Orange',
                'bright-green': 'Bright Green',
                'dim-green': 'Dim Green',
                'amber': 'Retro Amber',
                'blue': 'Cyberpunk Blue',
                'red': 'Matrix Red',
                'purple': 'Neon Purple',
                'teal': 'Teal',
                'cyan-bright': 'Bright Cyan',
                'magenta': 'Retro Magenta',
                'orange-glow': 'Phosphor Orange',
                'yellow-phosphor': 'Phosphor Yellow',
                'ice-blue': 'Ice Blue',
                'terminal-gray': 'Terminal Gray',
                'blood-red': 'Blood Red',
                'toxic-green': 'Toxic Green',
                'violet-neon': 'Neon Violet'
            },
            default: 'custom',
            onChange: this.applyColorPreset.bind(this)
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
                min: 0,
                max: 100,
                step: 5
            },
            default: 50,
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
                min: 50,
                max: 2000,
                step: 50
            },
            default: 150,
            onChange: this.updateAnimationSpeed.bind(this)
        });


        // === CUSTOM COLOR SETTINGS ===

        // Primary color (main green)
        game.settings.register(this.MODULE_ID, 'primaryColor', {
            name: 'Primary Color',
            hint: 'Main green theme color (hex format: #00ff00)',
            scope: 'world',
            config: true,
            type: String,
            default: '#009900',
            onChange: this.updateColors.bind(this)
        });

        // Secondary color (darker green)
        game.settings.register(this.MODULE_ID, 'secondaryColor', {
            name: 'Secondary Color',
            hint: 'Darker secondary green color (hex format: #006600)',
            scope: 'world',
            config: true,
            type: String,
            default: '#006600',
            onChange: this.updateColors.bind(this)
        });

        // Text color
        game.settings.register(this.MODULE_ID, 'textColor', {
            name: 'Text Color',
            hint: 'Main text color (hex format: #008800)',
            scope: 'world',
            config: true,
            type: String,
            default: '#008800',
            onChange: this.updateColors.bind(this)
        });

        // Background color
        game.settings.register(this.MODULE_ID, 'backgroundColor', {
            name: 'Background Color',
            hint: 'Background color (hex format: #000000)',
            scope: 'world',
            config: true,
            type: String,
            default: '#000000',
            onChange: this.updateColors.bind(this)
        });

        // === FONT SETTINGS ===

        // Base font size
        game.settings.register(this.MODULE_ID, 'fontSize', {
            name: 'Font Size',
            hint: 'Base font size in pixels',
            scope: 'world',
            config: true,
            type: Number,
            range: {
                min: 12,
                max: 36,
                step: 1
            },
            default: 22,
            onChange: this.updateFontSize.bind(this)
        });

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

        
        // Button to reset settings
        game.settings.register(this.MODULE_ID, 'resetSettings', {
            name: 'Reset Settings',
            hint: 'Check the box to reset all settings to default values',
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
        const primaryColor = game.settings.get(this.MODULE_ID, 'primaryColor');
        const secondaryColor = game.settings.get(this.MODULE_ID, 'secondaryColor');
        const textColor = game.settings.get(this.MODULE_ID, 'textColor');
        const backgroundColor = game.settings.get(this.MODULE_ID, 'backgroundColor');

        // Create dynamic CSS for colors
        const style = document.getElementById('terminal-color-style') || document.createElement('style');
        style.id = 'terminal-color-style';

        style.textContent = `
            :root {
                --terminal-bg: ${backgroundColor} !important;
                --terminal-primary: ${primaryColor} !important;
                --terminal-secondary: ${secondaryColor} !important;
                --terminal-dim: ${this.darkenColor(secondaryColor, 0.5)} !important;
                --terminal-text: ${textColor} !important;
                --terminal-border: ${textColor} !important;
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

    static applyColorPreset() {
        const preset = game.settings.get(this.MODULE_ID, 'colorPreset');

        if (preset === 'custom') return; // Don't change if custom

        const presets = {
            'amber': {
                primary: '#ffaa00',
                secondary: '#cc8800',
                text: '#ee9900',
                background: '#110800'
            },
            'blood-red': {
                primary: '#ff3333',
                secondary: '#cc2222',
                text: '#dd2222',
                background: '#1a0000'
            },
            'blue': {
                primary: '#0099ff',
                secondary: '#0077cc',
                text: '#0088ee',
                background: '#001122'
            },
            'classic-green': {
                primary: '#00ff00',
                secondary: '#00cc00',
                text: '#00dd00',
                background: '#000000'
            },
            'classic-green-orange': {
                primary: '#FF7F00',
                secondary: '#00cc00',
                text: '#00dd00',
                background: '#000000'
            },
            'cyan-bright': {
                primary: '#00e5ff',
                secondary: '#00b3cc',
                text: '#00cce0',
                background: '#00141a'
            },
            'dim-green': {
                primary: '#006600',
                secondary: '#004400',
                text: '#005500',
                background: '#000000'
            },
            'ice-blue': {
                primary: '#66ffff',
                secondary: '#44cccc',
                text: '#55eeee',
                background: '#001111'
            },
            'magenta': {
                primary: '#ff00ff',
                secondary: '#cc00cc',
                text: '#dd00dd',
                background: '#1a001a'
            },
            'orange-glow': {
                primary: '#ff6600',
                secondary: '#cc5200',
                text: '#ee5500',
                background: '#1a0d00'
            },
            'purple': {
                primary: '#cc00ff',
                secondary: '#9900cc',
                text: '#bb00ee',
                background: '#110022'
            },
            'red': {
                primary: '#ff0066',
                secondary: '#cc0044',
                text: '#ee0055',
                background: '#110011'
            },
            'teal': {
                primary: '#00ffee',
                secondary: '#00ccbb',
                text: '#00ddcc',
                background: '#001111'
            },
            'terminal-gray': {
                primary: '#bbbbbb',
                secondary: '#888888',
                text: '#aaaaaa',
                background: '#000000'
            },
            'toxic-green': {
                primary: '#99ff00',
                secondary: '#77cc00',
                text: '#88ee00',
                background: '#0d1a00'
            },
            'violet-neon': {
                primary: '#ff33cc',
                secondary: '#cc2299',
                text: '#ee22aa',
                background: '#1a0011'
            },
            'bright-green': {
                primary: '#00ff66',
                secondary: '#00cc44',
                text: '#00ee55',
                background: '#001100'
            },
            'yellow-phosphor': {
                primary: '#ffff66',
                secondary: '#cccc44',
                text: '#eeee55',
                background: '#111100'
            }

        };

        if (presets[preset]) {
            const colors = presets[preset];

            // Update settings
            game.settings.set(this.MODULE_ID, 'primaryColor', colors.primary);
            game.settings.set(this.MODULE_ID, 'secondaryColor', colors.secondary);
            game.settings.set(this.MODULE_ID, 'textColor', colors.text);
            game.settings.set(this.MODULE_ID, 'backgroundColor', colors.background);

            // Apply colors
            this.updateColors();

            ui.notifications.info(`Color preset "${preset}" applied.`);
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
        const primaryColor = game.settings.get(this.MODULE_ID, 'primaryColor') || '#0f0';
        const glowValue = intensity * 0.3;

        let style = document.getElementById('terminal-glow-style');

        if (!style) {
            style = document.createElement('style');
            style.id = 'terminal-glow-style';
            document.head.appendChild(style);
        }

        style.textContent = `
            :root {
                --terminal-glow: 0 0 ${3 * glowValue}px ${primaryColor}, 
                                0 0 ${6 * glowValue}px ${primaryColor}, 
                                0 0 ${9 * glowValue}px ${primaryColor};
                --terminal-text-shadow: 0 0 ${2 * glowValue}px ${primaryColor};
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
                // Default values
                const defaults = {
                    primaryColor: '#009900',
                    secondaryColor: '#006600',
                    textColor: '#008800',
                    backgroundColor: '#000000',
                    fontSize: 19,
                    fontFamily: 'mono',
                    glowIntensity: 10,
                    animationSpeed: 150,
                    colorPreset: 'custom'
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

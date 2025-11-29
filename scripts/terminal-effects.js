/**
 * Cyberpunk Terminal Style - Efectos y configuración avanzada
 */

class CyberpunkTerminalEffects {
    static MODULE_ID = 'cyberpunk-terminal-style';
    static MODULE_TITLE = 'Cyberpunk Terminal Style';

    static init() {
        console.log(`${this.MODULE_TITLE} | Inicializando efectos terminal`);

        // Registrar configuraciones del módulo
        this.registerSettings();

        // Aplicar efectos iniciales
        this.applyTerminalEffects();

        // Hook para aplicar efectos cuando se abren ventanas
        Hooks.on('renderApplication', this.onRenderApplication.bind(this));

        // Hook para recargar estilos cuando cambian las configuraciones
        Hooks.on('closeSettingsConfig', this.onSettingsClose.bind(this));
    }

    static registerSettings() {
        // === CONFIGURACIONES DE COLOR ===

        // Color primario (verde principal)
        game.settings.register(this.MODULE_ID, 'primaryColor', {
            name: 'Color Primario',
            hint: 'Color verde principal del tema (formato hex: #00ff00)',
            scope: 'world',
            config: true,
            type: String,
            default: '#009900',
            onChange: this.updateColors.bind(this)
        });

        // Color secundario (verde más oscuro)
        game.settings.register(this.MODULE_ID, 'secondaryColor', {
            name: 'Color Secundario',
            hint: 'Color verde secundario más oscuro (formato hex: #006600)',
            scope: 'world',
            config: true,
            type: String,
            default: '#006600',
            onChange: this.updateColors.bind(this)
        });

        // Color de texto
        game.settings.register(this.MODULE_ID, 'textColor', {
            name: 'Color de Texto',
            hint: 'Color del texto principal (formato hex: #008800)',
            scope: 'world',
            config: true,
            type: String,
            default: '#008800',
            onChange: this.updateColors.bind(this)
        });

        // Color de fondo
        game.settings.register(this.MODULE_ID, 'backgroundColor', {
            name: 'Color de Fondo',
            hint: 'Color de fondo (formato hex: #000000)',
            scope: 'world',
            config: true,
            type: String,
            default: '#000000',
            onChange: this.updateColors.bind(this)
        });

        // === CONFIGURACIONES DE FUENTE ===

        // Tamaño de fuente base
        game.settings.register(this.MODULE_ID, 'fontSize', {
            name: 'Tamaño de Fuente',
            hint: 'Tamaño de fuente base en píxeles',
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

        // Familia de fuente
        game.settings.register(this.MODULE_ID, 'fontFamily', {
            name: 'Familia de Fuente',
            hint: 'Selecciona la fuente para el tema terminal',
            scope: 'world',
            config: true,
            type: String,
            choices: {
                'mono': 'Share Tech Mono (Recomendada)',
                'courier': 'Courier Prime' ,
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

        // === CONFIGURACIONES DE EFECTOS ===

        // Configuración para efectos de parpadeo
        game.settings.register(this.MODULE_ID, 'flickerEffects', {
            name: 'Efectos de Parpadeo',
            hint: 'Activa los efectos de parpadeo en el texto terminal',
            scope: 'world',
            config: true,
            type: Boolean,
            default: true,
            onChange: this.applyTerminalEffects.bind(this)
        });

        // Configuración para scanlines
        game.settings.register(this.MODULE_ID, 'scanlines', {
            name: 'Líneas de Escaneo',
            hint: 'Activa las líneas de escaneo estilo CRT',
            scope: 'world',
            config: true,
            type: Boolean,
            default: true,
            onChange: this.applyTerminalEffects.bind(this)
        });

        // Configuración para ruido estático
        game.settings.register(this.MODULE_ID, 'staticNoise', {
            name: 'Ruido Estático',
            hint: 'Añade ruido estático sutil a la pantalla',
            scope: 'world',
            config: true,
            type: Boolean,
            default: false,
            onChange: this.applyTerminalEffects.bind(this)
        });

        // Configuración para sonidos terminal
        game.settings.register(this.MODULE_ID, 'terminalSounds', {
            name: 'Sonidos Terminal',
            hint: 'Activa sonidos de tecleo al escribir',
            scope: 'world',
            config: true,
            type: Boolean,
            default: false,
            onChange: this.applyTerminalEffects.bind(this)
        });

        // Configuración para intensidad del brillo
        game.settings.register(this.MODULE_ID, 'glowIntensity', {
            name: 'Intensidad del Brillo',
            hint: 'Controla la intensidad del efecto de brillo verde',
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

        // Configuración para velocidad de animaciones
        game.settings.register(this.MODULE_ID, 'animationSpeed', {
            name: 'Velocidad de Animaciones',
            hint: 'Controla la velocidad de las animaciones (ms)',
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

        // === CONFIGURACIONES PREESTABLECIDAS ===

        // Presets de color
        game.settings.register(this.MODULE_ID, 'colorPreset', {
            name: 'Presets de Color',
            hint: 'Selecciona un preset de colores predefinido',
            scope: 'world',
            config: true,
            type: String,
            choices: {
                'custom': 'Personalizado',
                'classic-green': 'Verde Clásico',
                'bright-green': 'Verde Brillante',
                'dim-green': 'Verde Tenue',
                'amber': 'Ámbar Retro',
                'blue': 'Azul Cyberpunk',
                'red': 'Rojo Matriz',
                'purple': 'Púrpura Neón',
                'teal': 'Verde Azulado',
                'cyan-bright': 'Cian Brillante',
                'magenta': 'Magenta Retro',
                'orange-glow': 'Naranja Fosforescente',
                'yellow-phosphor': 'Amarillo Fósforo',
                'ice-blue': 'Azul Hielo',
                'terminal-gray': 'Gris Terminal',
                'blood-red': 'Rojo Sangre',
                'toxic-green': 'Verde Tóxico',
                'violet-neon': 'Violeta Neón'
            },
            default: 'custom',
            onChange: this.applyColorPreset.bind(this)
        });

        // Botón para resetear configuraciones
        game.settings.register(this.MODULE_ID, 'resetSettings', {
            name: 'Resetear Configuración',
            hint: 'Marca la casilla para resetear todas las configuraciones a valores por defecto',
            scope: 'world',
            config: true,
            type: Boolean,
            default: false,
            onChange: (value) => {
                // Solo actuar si se cambió a TRUE (marcado)
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

        // Crear CSS dinámico para colores
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

        this.updateGlowIntensity(); // Actualizar glow con nuevos colores
    }

    static updateFontSize() {
        const fontSize = game.settings.get(this.MODULE_ID, 'fontSize');

        // Crear CSS dinámico para el tamaño de fuente
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

        // Crear CSS dinámico para la fuente
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

        if (preset === 'custom') return; // No cambiar si es personalizado

        const presets = {
            'classic-green': {
                primary: '#00ff00',
                secondary: '#00cc00',
                text: '#00dd00',
                background: '#000000'
            },
            'bright-green': {
                primary: '#00ff66',
                secondary: '#00cc44',
                text: '#00ee55',
                background: '#001100'
            },
            'dim-green': {
                primary: '#006600',
                secondary: '#004400',
                text: '#005500',
                background: '#000000'
            },
            'amber': {
                primary: '#ffaa00',
                secondary: '#cc8800',
                text: '#ee9900',
                background: '#110800'
            },
            'blue': {
                primary: '#0099ff',
                secondary: '#0077cc',
                text: '#0088ee',
                background: '#001122'
            },
            'red': {
                primary: '#ff0066',
                secondary: '#cc0044',
                text: '#ee0055',
                background: '#110011'
            },
            'purple': {
                primary: '#cc00ff',
                secondary: '#9900cc',
                text: '#bb00ee',
                background: '#110022'
            },
            'teal': {
                primary: '#00ffee',
                secondary: '#00ccbb',
                text: '#00ddcc',
                background: '#001111'
            },
            'cyan-bright': {
                primary: '#00e5ff',
                secondary: '#00b3cc',
                text: '#00cce0',
                background: '#00141a'
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
            'yellow-phosphor': {
                primary: '#ffff66',
                secondary: '#cccc44',
                text: '#eeee55',
                background: '#111100'
            },
            'ice-blue': {
                primary: '#66ffff',
                secondary: '#44cccc',
                text: '#55eeee',
                background: '#001111'
            },
            'terminal-gray': {
                primary: '#bbbbbb',
                secondary: '#888888',
                text: '#aaaaaa',
                background: '#000000'
            },
            'blood-red': {
                primary: '#ff3333',
                secondary: '#cc2222',
                text: '#dd2222',
                background: '#1a0000'
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
            }
        };

        if (presets[preset]) {
            const colors = presets[preset];

            // Actualizar configuraciones
            game.settings.set(this.MODULE_ID, 'primaryColor', colors.primary);
            game.settings.set(this.MODULE_ID, 'secondaryColor', colors.secondary);
            game.settings.set(this.MODULE_ID, 'textColor', colors.text);
            game.settings.set(this.MODULE_ID, 'backgroundColor', colors.background);

            // Aplicar colores
            this.updateColors();

            ui.notifications.info(`Preset de color "${preset}" aplicado.`);
        }
    }

    static applyTerminalEffects() {
        const body = document.body;

        // Limpiar clases anteriores
        body.classList.remove('terminal-effects-enabled', 'terminal-static-enabled');

        // Aplicar efectos según configuración
        if (game.settings.get(this.MODULE_ID, 'flickerEffects')) {
            body.classList.add('terminal-effects-enabled');
        }

        if (game.settings.get(this.MODULE_ID, 'staticNoise')) {
            body.classList.add('terminal-static-enabled');
        }

        // Aplicar todas las configuraciones
        this.updateColors();
        this.updateFontSize();
        this.updateFontFamily();
        this.updateGlowIntensity();
        this.updateAnimationSpeed();

        // Inicializar sonidos si están habilitados
        if (game.settings.get(this.MODULE_ID, 'terminalSounds')) {
            this.initTerminalSounds();
        }
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
            title: "Resetear Configuración",
            content: "<p>¿Estás seguro de que quieres resetear todas las configuraciones a los valores por defecto?</p>",
            render: (html) => {
                // Aplicar estilos para hacer el diálogo más alto y menos ancho sin scrollbar
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
                // Valores por defecto
                const defaults = {
                    primaryColor: '#009900',
                    secondaryColor: '#006600',
                    textColor: '#008800',
                    backgroundColor: '#000000',
                    fontSize: 19,
                    fontFamily: 'mono',
                    flickerEffects: true,
                    scanlines: true,
                    staticNoise: false,
                    terminalSounds: false,
                    glowIntensity: 50,
                    animationSpeed: 150,
                    colorPreset: 'custom'
                };

                // Aplicar valores por defecto
                Object.entries(defaults).forEach(([key, value]) => {
                    game.settings.set(this.MODULE_ID, key, value);
                });

                // Desmarcar el checkbox después de completar el reset
                game.settings.set(this.MODULE_ID, 'resetSettings', false);

                // Recargar efectos
                this.applyTerminalEffects();

                ui.notifications.info("Configuración reseteada a valores por defecto.");
            },
            no: () => {
                // Desmarcar el checkbox si se cancela
                game.settings.set(this.MODULE_ID, 'resetSettings', false);
            },
            defaultYes: false
        });
    }

    static initTerminalSounds() {
        // Crear sonidos de tecleo (simplificado para el ejemplo)
        const sounds = {
            keypress: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBDOO0/PQfin'),
            enter: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBDOO0/PQfin')
        };

        // Añadir event listeners para sonidos de tecleo
        document.addEventListener('keydown', (event) => {
            if (event.target.matches('input, textarea') &&
                game.settings.get(this.MODULE_ID, 'terminalSounds')) {

                if (event.key === 'Enter') {
                    sounds.enter.currentTime = 0;
                    sounds.enter.play().catch(() => { });
                } else if (event.key.length === 1) {
                    sounds.keypress.currentTime = 0;
                    sounds.keypress.play().catch(() => { });
                }
            }
        });
    }

    static onRenderApplication(app, html, data) {
        // Aplicar clase cyberpunk a nuevas ventanas
        html.addClass('cyberpunk');
    }

    static onSettingsClose() {
        // Recargar efectos cuando se cierre la configuración
        setTimeout(() => {
            this.applyTerminalEffects();
        }, 100);
    }

    // Función auxiliar para oscurecer colores
    static darkenColor(color, factor) {
        // Convertir hex a RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        // Oscurecer
        const newR = Math.floor(r * factor);
        const newG = Math.floor(g * factor);
        const newB = Math.floor(b * factor);

        // Convertir de vuelta a hex
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
}

// Inicializar cuando Foundry esté listo
Hooks.once('init', () => {
    CyberpunkTerminalEffects.init();
});

// Exportar para uso en otros archivos si es necesario
window.CyberpunkTerminalEffects = CyberpunkTerminalEffects;
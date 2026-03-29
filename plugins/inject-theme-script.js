import fs from 'fs'

export function injectThemeScript() {
    return {
        name: 'inject-theme-script',
        transformIndexHtml(html) {
            const themesCSS = fs.readFileSync(
                './src/lib/config/themes.css',
                'utf-8'
            )

            const themesModule = fs.readFileSync(
                './src/lib/config/themes.js',
                'utf-8'
            )
            const defaultThemeMatch = themesModule.match(
                /export const defaultTheme = ['"](.+?)['"]/
            )

            if (!defaultThemeMatch) {
                console.error('Failed to extract default theme')
                return html
            }

            const defaultTheme = defaultThemeMatch[1]

            const styleTag = `<style>${themesCSS}</style>`

            const themeScript = `<script>
            (function() {
                const defaultTheme = '${defaultTheme}';
                try {
                    const stored = localStorage.getItem('settings');
                    let themeName = defaultTheme;
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        if (parsed.currentTheme) {
                            themeName = parsed.currentTheme;
                        }
                        if (parsed.font) {
                            document.documentElement.style.setProperty('--font-family', "'" + parsed.font.trim() + "', monospace");
                        }
                        if (parsed.fontWeight) {
                            var w = Number(parsed.fontWeight) || 400;
                            document.documentElement.style.setProperty('--font-weight', String(w));
                            document.documentElement.style.setProperty('--font-weight-light', String(Math.max(100, w - 100)));
                        }
                    }
                    if (themeName === 'custom' && parsed && parsed.customThemeColors) {
                        var c = parsed.customThemeColors;
                        var s = document.createElement('style');
                        s.id = 'custom-theme-vars';
                        s.textContent = ':root.theme-custom { --bg-1:' + c.bg1 + '; --bg-2:' + c.bg2 + '; --bg-3:' + c.bg3 + '; --txt-1:' + c.txt1 + '; --txt-2:' + c.txt2 + '; --txt-3:' + c.txt3 + '; --txt-4:' + c.txt4 + '; --txt-err:' + c.txtErr + '; }';
                        document.head.appendChild(s);
                    }
                    document.documentElement.className = 'theme-' + themeName;
                } catch (e) {
                    document.documentElement.className = 'theme-' + defaultTheme;
                }
            })();
            </script>`

            return html
                .replace(
                    /<script>[\s\S]*?__THEMES_DATA__[\s\S]*?<\/script>/,
                    themeScript
                )
                .replace('</head>', `${styleTag}\n</head>`)
        },
    }
}

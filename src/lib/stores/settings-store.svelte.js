import { defaultCustomColors } from '../config/themes.js'

function detectFormatPreferences() {
    try {
        const use24h = !new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions().hour12;
        const dayBeforeMonth = new Intl.DateTimeFormat().formatToParts(new Date())[0].type === 'day';
        const useFahrenheit = navigator.language === 'en-US';
        const useImperial = useFahrenheit;
        return {
            timeFormat: use24h ? '24hr' : '12hr',
            dateFormat: dayBeforeMonth ? 'dmy' : 'mdy',
            tempUnit: useFahrenheit ? 'fahrenheit' : 'celsius',
            speedUnit: useImperial ? 'mph' : 'kmh',
        }
    } catch {
        return {}
    }
}

let defaultSettings = {
    font: 'Geist Mono Variable',
    currentTheme: 'default',
    tabTitle: '~',
    taskBackend: 'local',
    todoistApiToken: '',
    googleTasksSignedIn: false,
    locationMode: 'manual',
    latitude: null,
    longitude: null,
    timeFormat: '12hr',
    dateFormat: 'mdy',
    tempUnit: 'fahrenheit',
    speedUnit: 'mph',
    forecastMode: 'hourly',
    linksPerColumn: 4,
    linkTarget: '_self',
    links: [
        { title: 'gmail', url: 'https://mail.google.com' },
        { title: 'calendar', url: 'https://calendar.google.com' },
        { title: 'drive', url: 'https://drive.google.com' },
        { title: 'docs', url: 'https://docs.google.com' },
        { title: 'github', url: 'https://github.com' },
        { title: 'slack', url: 'https://slack.com' },
        { title: 'keep', url: 'https://keep.google.com' },
        { title: 'leetcode', url: 'https://leetcode.com/problemset' },
        { title: 'perplexity', url: 'https://perplexity.ai' },
        { title: 'claude', url: 'https://claude.ai' },
        { title: 'aistudio', url: 'https://aistudio.google.com' },
        { title: 'chatgpt', url: 'https://chat.openai.com' },
        { title: 'youtube', url: 'https://youtube.com' },
        { title: 'reddit', url: 'https://reddit.com' },
        { title: 'twitter', url: 'https://x.com' },
        { title: 'feedly', url: 'https://feedly.com' },
    ],
    customThemeColors: { ...defaultCustomColors },
    customCSS: '',
    showClock: true,
    showStats: true,
    showWeather: true,
    showTasks: true,
    showLinks: true,
}

function loadSettings() {
    try {
        const stored = localStorage.getItem('settings')
        if (stored) {
            const parsed = JSON.parse(stored)
            const merged = { ...defaultSettings, ...parsed }
            if (!merged.customThemeColors) {
                merged.customThemeColors = { ...defaultCustomColors }
            }
            return merged
        }
    } catch (error) {
        console.error('failed to load settings from localStorage:', error)
    }

    const detected = detectFormatPreferences()
    return { ...defaultSettings, ...detected }
}

export function saveSettings(settings) {
    try {
        localStorage.setItem('settings', JSON.stringify(settings))
    } catch (error) {
        console.error('failed to save settings to localStorage:', error)
    }
}

export function resetSettings() {
    try {
        localStorage.removeItem('settings')
        // Reset the settings object to default
        const newSettings = loadSettings()
        Object.assign(settings, newSettings)
        return true
    } catch (error) {
        console.error('failed to reset settings:', error)
        return false
    }
}

export const settings = $state(loadSettings())

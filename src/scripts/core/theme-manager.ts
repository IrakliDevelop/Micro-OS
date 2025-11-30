/**
 * Theme definition
 */
export interface Theme {
  name: string;
  displayName: string;
  colors: {
    phosphor: string;
    phosphorDim: string;
    background: string;
    error: string;
    hint: string;
  };
}

/**
 * Built-in themes
 */
export const THEMES: Record<string, Theme> = {
  green: {
    name: 'green',
    displayName: 'Green Phosphor',
    colors: {
      phosphor: '#00ff41',
      phosphorDim: '#00aa2b',
      background: '#000000',
      error: '#ff3333',
      hint: '#00cc38',
    },
  },
  amber: {
    name: 'amber',
    displayName: 'Amber',
    colors: {
      phosphor: '#ffb000',
      phosphorDim: '#cc8800',
      background: '#000000',
      error: '#ff3333',
      hint: '#ffcc00',
    },
  },
  white: {
    name: 'white',
    displayName: 'White Phosphor',
    colors: {
      phosphor: '#f0f0f0',
      phosphorDim: '#b0b0b0',
      background: '#0a0a0a',
      error: '#ff5555',
      hint: '#d0d0d0',
    },
  },
};

/**
 * Theme Manager
 * Handles theme switching and persistence
 */
export class ThemeManager {
  private currentTheme: string = 'green';
  private readonly STORAGE_KEY = 'retro-os-theme';

  constructor() {
    // Load saved theme
    this.loadTheme();
  }

  /**
   * Get all available themes
   */
  public getThemes(): Theme[] {
    return Object.values(THEMES);
  }

  /**
   * Get current theme name
   */
  public getCurrentTheme(): string {
    return this.currentTheme;
  }

  /**
   * Get theme by name
   */
  public getTheme(name: string): Theme | undefined {
    return THEMES[name.toLowerCase()];
  }

  /**
   * Set theme
   */
  public setTheme(name: string): boolean {
    const theme = this.getTheme(name);
    if (!theme) {
      return false;
    }

    // Update CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--color-phosphor', theme.colors.phosphor);
    root.style.setProperty('--color-phosphor-dim', theme.colors.phosphorDim);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-error', theme.colors.error);
    root.style.setProperty('--color-hint', theme.colors.hint);

    // Save to state and localStorage
    this.currentTheme = theme.name;
    this.saveTheme();

    return true;
  }

  /**
   * Load theme from localStorage
   */
  private loadTheme(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved && this.getTheme(saved)) {
        this.setTheme(saved);
      }
    } catch (error) {
      // localStorage might not be available
      console.warn('Could not load theme from localStorage:', error);
    }
  }

  /**
   * Save theme to localStorage
   */
  private saveTheme(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, this.currentTheme);
    } catch (error) {
      // localStorage might not be available
      console.warn('Could not save theme to localStorage:', error);
    }
  }
}


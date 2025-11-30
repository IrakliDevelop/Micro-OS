import { TerminalApp } from '../core/terminal-app';
import { ThemeManager } from '../core/theme-manager';

/**
 * Register theme plugin
 */
export function registerThemePlugin(app: TerminalApp, themeManager: ThemeManager): void {
  app.registerCommand(
    'theme',
    'Manage terminal themes',
    (args: string[], app: TerminalApp) => {
      if (args.length === 0) {
        // Show usage
        app.printLine('');
        app.printLine('Theme Manager', 'section-header');
        app.printLine('=============', 'section-header');
        app.printLine('');
        app.printLine('Usage:');
        app.printLine('  theme list         - List all available themes');
        app.printLine('  theme current      - Show current theme');
        app.printLine('  theme set <name>   - Switch to a theme');
        app.printLine('');
        return;
      }

      const subcommand = args[0].toLowerCase();

      switch (subcommand) {
        case 'list':
          handleListThemes(app, themeManager);
          break;
        case 'current':
          handleCurrentTheme(app, themeManager);
          break;
        case 'set':
          handleSetTheme(app, themeManager, args[1]);
          break;
        default:
          app.printLine(`Unknown subcommand: ${subcommand}`, 'error');
          app.printLine('Type "theme" for usage.', 'hint');
      }
    },
    // Autocomplete handler
    (args: string[], _currentWord: string, _app: TerminalApp) => {
      const subcommands = ['list', 'current', 'set'];
      
      // If no args yet, suggest subcommands
      if (args.length === 0) {
        return subcommands;
      }
      
      const subcommand = args[0].toLowerCase();
      
      // If typing 'set', suggest theme names
      if (subcommand === 'set' && args.length === 1) {
        const themes = themeManager.getThemes();
        return themes.map(t => t.name);
      }
      
      return [];
    }
  );
}

/**
 * Handle list themes
 */
function handleListThemes(app: TerminalApp, themeManager: ThemeManager): void {
  const themes = themeManager.getThemes();
  const currentTheme = themeManager.getCurrentTheme();

  app.printLine('');
  app.printLine('Available Themes', 'section-header');
  app.printLine('================', 'section-header');
  app.printLine('');

  themes.forEach(theme => {
    const current = theme.name === currentTheme ? ' (current)' : '';
    const colorSample = `[${theme.colors.phosphor}]`;
    app.printLine(`  ${theme.displayName.padEnd(20)} ${colorSample}${current}`);
  });

  app.printLine('');
  app.printLine('Use "theme set <name>" to switch themes.', 'hint');
  app.printLine('');
}

/**
 * Handle current theme
 */
function handleCurrentTheme(app: TerminalApp, themeManager: ThemeManager): void {
  const currentName = themeManager.getCurrentTheme();
  const theme = themeManager.getTheme(currentName);

  if (!theme) {
    app.printLine('Error: Current theme not found', 'error');
    return;
  }

  app.printLine('');
  app.printLine(`Current theme: ${theme.displayName}`);
  app.printLine('');
}

/**
 * Handle set theme
 */
function handleSetTheme(app: TerminalApp, themeManager: ThemeManager, name: string | undefined): void {
  if (!name) {
    app.printLine('Error: Theme name required', 'error');
    app.printLine('Usage: theme set <name>', 'hint');
    return;
  }

  const success = themeManager.setTheme(name);

  if (success) {
    const theme = themeManager.getTheme(name);
    app.printLine('');
    app.printLine(`Theme changed to: ${theme?.displayName}`, 'hint');
    app.printLine('');
  } else {
    app.printLine(`Error: Theme '${name}' not found`, 'error');
    app.printLine('Use "theme list" to see available themes.', 'hint');
  }
}


import '../styles/main.scss';
import { TerminalApp } from './core/terminal-app';
import { registerCoreCommands } from './core/commands-core';
import { registerSysInfoPlugin } from './plugins/sysinfo';
import { ThemeManager } from './core/theme-manager';
import { registerThemePlugin } from './plugins/theme';
import { runBootSequence } from './core/boot-sequence';

/**
 * Main entry point
 */
async function init(): Promise<void> {
  // Create theme manager and load saved theme
  const themeManager = new ThemeManager();
  
  // Create terminal app
  const app = new TerminalApp();
  
  // Register core commands
  registerCoreCommands(app);
  
  // Register plugins
  registerSysInfoPlugin(app);
  registerThemePlugin(app, themeManager);
  
  // Initialize terminal
  app.init();
  
  // Run boot sequence
  await runBootSequence(app);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}


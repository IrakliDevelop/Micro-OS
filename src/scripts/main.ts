import '../styles/main.scss';
import { TerminalApp } from './core/terminal-app';
import { registerCoreCommands } from './core/commands-core';
import { registerSysInfoPlugin } from './plugins/sysinfo';
import { ThemeManager } from './core/theme-manager';
import { registerThemePlugin } from './plugins/theme';
import { SoundManager } from './core/sound-manager';
import { registerSoundPlugin } from './plugins/sound';
import { runBootSequence } from './core/boot-sequence';

/**
 * Main entry point
 */
async function init(): Promise<void> {
  // Create theme manager and load saved theme
  const themeManager = new ThemeManager();
  
  // Create sound manager
  const soundManager = new SoundManager();
  
  // Create terminal app with sound manager
  const app = new TerminalApp(soundManager);
  
  // Register core commands
  registerCoreCommands(app);
  
  // Register plugins
  registerSysInfoPlugin(app);
  registerThemePlugin(app, themeManager);
  registerSoundPlugin(app, soundManager);
  
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


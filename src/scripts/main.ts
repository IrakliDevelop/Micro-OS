import '../styles/main.scss';
import { TerminalApp } from './core/terminal-app';
import { registerCoreCommands } from './core/commands-core';
import { registerSysInfoPlugin } from './plugins/sysinfo';
import { ThemeManager } from './core/theme-manager';
import { registerThemePlugin } from './plugins/theme';
import { SoundManager } from './core/sound-manager';
import { registerSoundPlugin } from './plugins/sound';
import { runBootSequence } from './core/boot-sequence';
import { FileSystem } from './core/file-system';
import { registerTextEditor } from './plugins/text-editor';
import { ManPageRegistry } from './core/man-registry';
import { registerManCommand } from './plugins/man';
import { registerFileCommands } from './plugins/file-commands';
import { loadManPages } from './core/man-page-loader';

/**
 * Main entry point
 */
async function init(): Promise<void> {
  // Create theme manager and load saved theme
  const themeManager = new ThemeManager();
  
  // Create sound manager
  const soundManager = new SoundManager();
  
  // Create file system
  const fileSystem = new FileSystem();
  
  // Create man page registry
  const manRegistry = new ManPageRegistry();
  
  // Auto-load all man pages from markdown files
  await loadManPages(manRegistry);
  
  // Create terminal app with sound manager
  const app = new TerminalApp(soundManager);
  
  // Register core commands (with man pages)
  registerCoreCommands(app, manRegistry);
  
  // Register plugins (with man pages)
  registerSysInfoPlugin(app, manRegistry);
  registerThemePlugin(app, themeManager, manRegistry);
  registerSoundPlugin(app, soundManager, manRegistry);
  registerTextEditor(app, fileSystem, manRegistry);
  registerFileCommands(app, fileSystem, manRegistry);
  registerManCommand(app, manRegistry);
  
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

import '../styles/main.scss';
import { TerminalApp } from './core/terminal-app';
import { registerCoreCommands } from './core/commands-core';
import { registerSysInfoPlugin } from './plugins/sysinfo';

/**
 * Main entry point
 */
function init(): void {
  // Create terminal app
  const app = new TerminalApp();
  
  // Register core commands
  registerCoreCommands(app);
  
  // Register plugins
  registerSysInfoPlugin(app);
  
  // Initialize terminal
  app.init();
  
  // Display welcome message
  displayWelcome(app);
}

/**
 * Display welcome message
 */
function displayWelcome(app: TerminalApp): void {
  app.printLine('');
  app.printLine('╔═══════════════════════════════════════════════════════════╗');
  app.printLine('║                                                           ║');
  app.printLine('║               RETRO MICRO-OS v1.0.0                       ║');
  app.printLine('║                                                           ║');
  app.printLine('║     Welcome to the nostalgic terminal experience          ║');
  app.printLine('║                                                           ║');
  app.printLine('╚═══════════════════════════════════════════════════════════╝');
  app.printLine('');
  app.printLine('Type "help" to see available commands.');
  app.printLine('');
  app.printLine('System initialized successfully.', 'hint');
  // display the current date and time and also the time zone
  app.printLine('The current date and time is: ' + new Date().toLocaleString() + ' ' + Intl.DateTimeFormat().resolvedOptions().timeZone);

  app.printLine('');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}


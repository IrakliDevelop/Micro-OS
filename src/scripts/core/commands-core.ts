import { TerminalApp } from './terminal-app';
import { runBootSequence } from './boot-sequence';
import type { ManPageRegistry } from './man-registry';

/**
 * Register core built-in commands
 */
export function registerCoreCommands(app: TerminalApp, _manRegistry: ManPageRegistry): void {
  // help command
  app.registerCommand(
    'help',
    'Display available commands',
    (_args: string[], app: TerminalApp) => {
      app.printLine('');
      app.printLine('Available Commands:', 'section-header');
      app.printLine('==================', 'section-header');
      app.printLine('');

      const commands = app.getCommands();
      commands.forEach(cmd => {
        const padding = ' '.repeat(Math.max(0, 15 - cmd.name.length));
        app.printLine(`  ${cmd.name}${padding}${cmd.description}`);
      });

      app.printLine('');
    },
    // Autocomplete handler - suggest command names
    (_args: string[], _currentWord: string, app: TerminalApp) => {
      const commands = app.getCommands();
      return commands.map(cmd => cmd.name);
    }
  );

  // clear command
  app.registerCommand(
    'clear',
    'Clear the terminal screen',
    (_args: string[], app: TerminalApp) => {
      app.clear();
    }
  );

  // history command
  app.registerCommand(
    'history',
    'Show command history',
    (_args: string[], app: TerminalApp) => {
      const history = app.getHistory();
      
      if (history.length === 0) {
        app.printLine('No command history.', 'hint');
        return;
      }

      app.printLine('');
      app.printLine('Command History:', 'section-header');
      app.printLine('================', 'section-header');
      app.printLine('');

      history.forEach((cmd, index) => {
        const lineNumber = String(index + 1).padStart(4, ' ');
        app.printLine(`${lineNumber}  ${cmd}`);
      });

      app.printLine('');
    }
  );

  // echo command
  app.registerCommand(
    'echo',
    'Echo text to the terminal',
    (args: string[], app: TerminalApp) => {
      app.printLine(args.join(' '));
    }
  );

  // boot command
  app.registerCommand(
    'boot',
    'Replay the boot sequence',
    async (_args: string[], app: TerminalApp) => {
      await runBootSequence(app);
    }
  );
}

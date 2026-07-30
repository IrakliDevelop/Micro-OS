import type { TerminalApp } from '../core/terminal-app';
import type { ManPageRegistry } from '../core/man-registry';

/**
 * Register man command plugin
 */
export function registerManCommand(app: TerminalApp, manRegistry: ManPageRegistry): void {
  app.registerCommand(
    'man',
    'Display manual pages for commands',
    (args: string[], app: TerminalApp) => {
      // No arguments: list all available man pages
      if (args.length === 0) {
        showManPageList(app, manRegistry);
        return;
      }

      // Check for -v flag (verbose/detailed mode)
      const isVerbose = args[0] === '-v';
      const commandName = isVerbose ? args[1] : args[0];

      if (!commandName) {
        app.printLine('Usage: man [-v] <command>', 'error');
        app.printLine('Try "man" to list all available manual pages.', 'hint');
        return;
      }

      // Get and display the man page
      const page = manRegistry.getManPage(commandName);
      if (!page) {
        app.printLine(`No manual entry for ${commandName}`, 'error');
        app.printLine('Try "man" to see available manual pages.', 'hint');
        return;
      }

      if (isVerbose) {
        showDetailedManPage(app, page);
      } else {
        showBriefManPage(app, page);
      }
    },
    // Autocomplete: suggest command names that have man pages
    (_args: string[], _currentWord: string, _app: TerminalApp) => {
      return manRegistry.getCommandNames();
    }
  );
}

/**
 * Show list of all available man pages
 */
function showManPageList(app: TerminalApp, manRegistry: ManPageRegistry): void {
  const pages = manRegistry.getAllPages();

  if (pages.length === 0) {
    app.printLine('No manual pages available.', 'hint');
    return;
  }

  app.printLine('');
  app.printLine('Available Manual Pages', 'section-header');
  app.printLine('======================', 'section-header');
  app.printLine('');
  app.printLine('Usage: man <command>        Show brief help');
  app.printLine('       man -v <command>     Show detailed help');
  app.printLine('');

  pages.forEach(page => {
    const padding = ' '.repeat(Math.max(0, 20 - page.name.length));
    app.printLine(`  ${page.name}${padding}${page.brief}`);
  });

  app.printLine('');
}

/**
 * Show brief man page (default)
 */
function showBriefManPage(app: TerminalApp, page: any): void {
  app.printLine('');
  app.printLine(`NAME`, 'section-header');
  app.printLine(`    ${page.name} - ${page.brief}`);
  app.printLine('');
  
  app.printLine(`USAGE`, 'section-header');
  app.printLine(`    ${page.usage}`);
  app.printLine('');
  
  app.printLine(`DESCRIPTION`, 'section-header');
  // Wrap description text
  const descLines = wrapText(page.description, 4);
  descLines.forEach(line => app.printLine(line));
  app.printLine('');

  if (page.examples && page.examples.length > 0) {
    app.printLine(`EXAMPLES`, 'section-header');
    page.examples.forEach((example: string) => {
      app.printLine(`    ${example}`);
    });
    app.printLine('');
  }

  app.printLine(`For more details, use: man -v ${page.name}`, 'hint');
  app.printLine('');
}

/**
 * Show detailed man page (verbose mode)
 */
function showDetailedManPage(app: TerminalApp, page: any): void {
  app.printLine('');
  app.printLine(`NAME`, 'section-header');
  app.printLine(`    ${page.name} - ${page.brief}`);
  app.printLine('');
  
  app.printLine(`USAGE`, 'section-header');
  app.printLine(`    ${page.usage}`);
  app.printLine('');
  
  app.printLine(`DESCRIPTION`, 'section-header');
  const descLines = wrapText(page.description, 4);
  descLines.forEach(line => app.printLine(line));
  app.printLine('');

  // Show detailed documentation
  app.printLine(`DETAILED INFORMATION`, 'section-header');
  const detailedLines = wrapText(page.detailed, 4);
  detailedLines.forEach(line => app.printLine(line));
  app.printLine('');

  if (page.examples && page.examples.length > 0) {
    app.printLine(`EXAMPLES`, 'section-header');
    page.examples.forEach((example: string) => {
      app.printLine(`    ${example}`);
    });
    app.printLine('');
  }
}

/**
 * Wrap text to fit terminal width
 * Adds indent spaces at the beginning of each line
 */
function wrapText(text: string, indent: number = 0): string[] {
  const indentStr = ' '.repeat(indent);
  const lines: string[] = [];
  
  // Split by explicit newlines first
  const paragraphs = text.split('\n');
  
  paragraphs.forEach((paragraph, idx) => {
    if (paragraph.trim() === '') {
      if (idx > 0) lines.push('');
      return;
    }

    const words = paragraph.split(' ');
    let currentLine = indentStr;

    words.forEach(word => {
      if (currentLine.length + word.length + 1 > 80) {
        lines.push(currentLine);
        currentLine = indentStr + word;
      } else {
        if (currentLine.length > indent) {
          currentLine += ' ' + word;
        } else {
          currentLine += word;
        }
      }
    });

    if (currentLine.length > indent) {
      lines.push(currentLine);
    }
  });

  return lines;
}

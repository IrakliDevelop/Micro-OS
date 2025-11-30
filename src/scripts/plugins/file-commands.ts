import type { TerminalApp } from '../core/terminal-app';
import type { FileSystem } from '../core/file-system';
import type { ManPageRegistry } from '../core/man-registry';

/**
 * Register file management commands
 */
export function registerFileCommands(
  app: TerminalApp, 
  fileSystem: FileSystem,
  _manRegistry: ManPageRegistry
): void {
  // ls command - list files and commands
  app.registerCommand(
    'ls',
    'List files and commands',
    (args: string[], app: TerminalApp) => {
      const isLongFormat = args.includes('-l');
      
      const files = fileSystem.listFiles();
      
      app.printLine('');
      
      // Show files
      if (files.length > 0) {
        app.printLine('Files:', 'section-header');
        files.forEach(filename => {
          if (isLongFormat) {
            const size = fileSystem.getFileSize(filename);
            const sizeStr = formatFileSize(size);
            const padding = ' '.repeat(Math.max(0, 30 - filename.length));
            app.printLine(`  ${filename}${padding}${sizeStr}`);
          } else {
            app.printLine(`  ${filename}`);
          }
        });
      } else {
        app.printLine('No files found.', 'hint');
        app.printLine('Create files using: edit <filename>', 'hint');
      }
      
      app.printLine('');
      
      // Show available commands
      app.printLine('Commands:', 'section-header');
      app.printLine('  Type "help" to see all available commands', 'hint');
      app.printLine('  Type "man <command>" for detailed help', 'hint');
      app.printLine('');
    }
  );

  // cat command - display file contents
  app.registerCommand(
    'cat',
    'Display file contents',
    (args: string[], app: TerminalApp) => {
      if (args.length === 0) {
        app.printLine('Usage: cat <filename>', 'error');
        app.printLine('Display the contents of a file.', 'hint');
        return;
      }

      const filename = args[0];
      
      if (!fileSystem.fileExists(filename)) {
        app.printLine(`cat: ${filename}: No such file`, 'error');
        app.printLine('Use "ls" to see available files.', 'hint');
        return;
      }

      const content = fileSystem.loadFile(filename);
      
      if (content === null || content === '') {
        app.printLine(`[Empty file]`, 'hint');
        return;
      }

      app.printLine('');
      // Display each line of the file
      const lines = content.split('\n');
      lines.forEach(line => {
        app.printLine(line);
      });
      app.printLine('');
    },
    // Autocomplete: suggest existing files
    (_args: string[], _currentWord: string, _app: TerminalApp) => {
      return fileSystem.listFiles();
    }
  );

  // rm command - remove files
  app.registerCommand(
    'rm',
    'Remove files',
    (args: string[], app: TerminalApp) => {
      if (args.length === 0) {
        app.printLine('Usage: rm [-f] <filename>', 'error');
        app.printLine('Remove a file from the virtual file system.', 'hint');
        app.printLine('  -f    Force removal without confirmation', 'hint');
        return;
      }

      // Check for force flag
      const hasForceFlag = args[0] === '-f';
      const filename = hasForceFlag ? args[1] : args[0];

      if (!filename) {
        app.printLine('Usage: rm [-f] <filename>', 'error');
        return;
      }

      if (!fileSystem.fileExists(filename)) {
        app.printLine(`rm: ${filename}: No such file`, 'error');
        app.printLine('Use "ls" to see available files.', 'hint');
        return;
      }

      // Confirm deletion unless force flag is used
      if (!hasForceFlag) {
        const confirmed = confirm(`Delete '${filename}'?`);
        if (!confirmed) {
          app.printLine('Deletion cancelled.', 'hint');
          return;
        }
      }

      // Delete the file
      const success = fileSystem.deleteFile(filename);
      
      if (success) {
        app.printLine(`Removed '${filename}'`);
      } else {
        app.printLine(`Failed to remove '${filename}'`, 'error');
      }
    },
    // Autocomplete: suggest existing files
    (_args: string[], _currentWord: string, _app: TerminalApp) => {
      return fileSystem.listFiles();
    }
  );
}

/**
 * Format file size in human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes < 0) return 'Unknown';
  if (bytes === 0) return '0 bytes';
  if (bytes === 1) return '1 byte';
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

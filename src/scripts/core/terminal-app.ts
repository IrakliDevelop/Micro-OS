/**
 * Command handler function signature
 */
export type CommandHandler = (args: string[], app: TerminalApp) => void;

/**
 * Autocomplete handler function signature
 * Returns array of possible completions based on current arguments and partial word
 */
export type AutocompleteHandler = (args: string[], currentWord: string, app: TerminalApp) => string[];

/**
 * Command registry entry
 */
interface Command {
  name: string;
  description: string;
  handler: CommandHandler;
  autocomplete?: AutocompleteHandler;
}

/**
 * Core Terminal Application
 * Manages command registry, input/output, and command history
 */
export class TerminalApp {
  private commands: Map<string, Command> = new Map();
  private history: string[] = [];
  private historyIndex: number = -1;
  private outputElement: HTMLElement | null = null;
  private inputElement: HTMLInputElement | null = null;
  private promptElement: HTMLElement | null = null;

  /**
   * Initialize the terminal application
   */
  public init(): void {
    // Get DOM elements
    this.outputElement = document.getElementById('terminal-output');
    this.inputElement = document.getElementById('terminal-input') as HTMLInputElement;
    this.promptElement = document.getElementById('terminal-prompt');

    if (!this.outputElement || !this.inputElement || !this.promptElement) {
      console.error('Required terminal elements not found');
      return;
    }

    // Set up input event handlers
    this.inputElement.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.inputElement.addEventListener('input', this.handleInput.bind(this));

    // Focus input
    this.inputElement.focus();

    // Ensure input stays focused
    document.addEventListener('click', () => {
      this.inputElement?.focus();
    });
  }

  /**
   * Register a command
   */
  public registerCommand(
    name: string, 
    description: string, 
    handler: CommandHandler,
    autocomplete?: AutocompleteHandler
  ): void {
    this.commands.set(name.toLowerCase(), { name, description, handler, autocomplete });
  }

  /**
   * Print a line to the terminal output
   */
  public printLine(text: string, className?: string): void {
    if (!this.outputElement) return;

    const line = document.createElement('div');
    line.className = 'terminal-line';
    if (className) {
      line.classList.add(className);
    }
    line.textContent = text;
    this.outputElement.appendChild(line);

    // Auto-scroll to bottom
    this.outputElement.scrollTop = this.outputElement.scrollHeight;
  }

  /**
   * Clear the terminal output
   */
  public clear(): void {
    if (this.outputElement) {
      this.outputElement.innerHTML = '';
    }
  }

  /**
   * Get all registered commands
   */
  public getCommands(): Command[] {
    return Array.from(this.commands.values());
  }

  /**
   * Get command history
   */
  public getHistory(): string[] {
    return [...this.history];
  }

  /**
   * Enable user input
   */
  public enableInput(): void {
    if (this.inputElement) {
      this.inputElement.disabled = false;
      this.inputElement.focus();
    }
  }

  /**
   * Disable user input
   */
  public disableInput(): void {
    if (this.inputElement) {
      this.inputElement.disabled = true;
    }
  }

  /**
   * Find matches from an array of options based on a partial string
   */
  private findMatches(partial: string, options: string[]): string[] {
    if (!partial) {
      return options;
    }
    const lowerPartial = partial.toLowerCase();
    return options.filter(option => option.toLowerCase().startsWith(lowerPartial));
  }

  /**
   * Get the longest common prefix from an array of strings
   */
  private getCommonPrefix(strings: string[]): string {
    if (strings.length === 0) return '';
    if (strings.length === 1) return strings[0];

    let prefix = strings[0];
    for (let i = 1; i < strings.length; i++) {
      while (strings[i].toLowerCase().indexOf(prefix.toLowerCase()) !== 0) {
        prefix = prefix.substring(0, prefix.length - 1);
        if (prefix === '') return '';
      }
    }
    return prefix;
  }

  /**
   * Display completion options in a formatted way
   */
  private displayCompletions(matches: string[]): void {
    if (matches.length === 0) return;

    // Group completions in rows of up to 4 items
    const itemsPerRow = 4;
    const columnWidth = 20;

    this.printLine('');
    for (let i = 0; i < matches.length; i += itemsPerRow) {
      const row = matches.slice(i, i + itemsPerRow);
      const formattedRow = row.map(item => item.padEnd(columnWidth)).join('');
      this.printLine(formattedRow.trimEnd(), 'hint');
    }
    this.printLine('');
  }

  /**
   * Handle tab completion
   */
  private handleTabCompletion(): void {
    if (!this.inputElement) return;

    const input = this.inputElement.value;
    const cursorPos = this.inputElement.selectionStart || input.length;
    
    // Get the part of the input up to the cursor
    const textBeforeCursor = input.substring(0, cursorPos);
    const textAfterCursor = input.substring(cursorPos);
    
    // Split input into parts
    const parts = textBeforeCursor.split(/\s+/);
    
    // Determine if we're completing a command name or arguments
    const hasSpace = textBeforeCursor.includes(' ');
    
    if (!hasSpace || parts.length === 1) {
      // Complete command name
      const partial = parts[0] || '';
      const commandNames = Array.from(this.commands.keys());
      const matches = this.findMatches(partial, commandNames);
      
      if (matches.length === 0) {
        // No matches, do nothing
        return;
      } else if (matches.length === 1) {
        // Single match: complete it with a space
        this.inputElement.value = matches[0] + ' ' + textAfterCursor;
        this.inputElement.setSelectionRange(matches[0].length + 1, matches[0].length + 1);
      } else {
        // Multiple matches: complete to common prefix and show options
        const commonPrefix = this.getCommonPrefix(matches);
        if (commonPrefix.length > partial.length) {
          this.inputElement.value = commonPrefix + textAfterCursor;
          this.inputElement.setSelectionRange(commonPrefix.length, commonPrefix.length);
        }
        this.displayCompletions(matches);
      }
    } else {
      // Complete command arguments
      const commandName = parts[0].toLowerCase();
      const command = this.commands.get(commandName);
      
      if (!command || !command.autocomplete) {
        // No autocomplete available for this command
        return;
      }
      
      // Get the current word being typed (last part)
      const currentWord = parts[parts.length - 1] || '';
      // Get the arguments before the current word
      const args = parts.slice(1, -1);
      
      // Call the command's autocomplete handler
      const suggestions = command.autocomplete(args, currentWord, this);
      const matches = this.findMatches(currentWord, suggestions);
      
      if (matches.length === 0) {
        // No matches
        return;
      } else if (matches.length === 1) {
        // Single match: complete it
        const completedText = parts.slice(0, -1).concat(matches[0]).join(' ') + ' ';
        this.inputElement.value = completedText + textAfterCursor;
        this.inputElement.setSelectionRange(completedText.length, completedText.length);
      } else {
        // Multiple matches: complete to common prefix and show options
        const commonPrefix = this.getCommonPrefix(matches);
        if (commonPrefix.length > currentWord.length) {
          const completedText = parts.slice(0, -1).concat(commonPrefix).join(' ');
          this.inputElement.value = completedText + textAfterCursor;
          this.inputElement.setSelectionRange(completedText.length, completedText.length);
        }
        this.displayCompletions(matches);
      }
    }
  }

  /**
   * Handle keyboard input
   */
  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.executeCommand();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.navigateHistory(-1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.navigateHistory(1);
    } else if (event.key === 'Tab') {
      event.preventDefault();
      this.handleTabCompletion();
    }
  }

  /**
   * Handle input changes
   */
  private handleInput(): void {
    // Future: could implement live suggestions here
  }

  /**
   * Execute the current command
   */
  private executeCommand(): void {
    if (!this.inputElement) return;

    const input = this.inputElement.value.trim();
    
    // Echo the command
    this.printLine(`> ${input}`, 'command-echo');

    // Add to history if not empty
    if (input) {
      this.history.push(input);
      this.historyIndex = this.history.length;
    }

    // Parse command and args
    const parts = input.split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Execute command
    if (commandName) {
      const command = this.commands.get(commandName);
      if (command) {
        try {
          command.handler(args, this);
        } catch (error) {
          this.printLine(`Error executing command: ${error}`, 'error');
        }
      } else {
        this.printLine(`Command not found: ${commandName}`, 'error');
        this.printLine('Type "help" for a list of available commands.', 'hint');
      }
    }

    // Clear input
    this.inputElement.value = '';
  }

  /**
   * Navigate command history
   */
  private navigateHistory(direction: number): void {
    if (!this.inputElement || this.history.length === 0) return;

    this.historyIndex += direction;

    if (this.historyIndex < 0) {
      this.historyIndex = 0;
    } else if (this.historyIndex >= this.history.length) {
      this.historyIndex = this.history.length;
      this.inputElement.value = '';
      return;
    }

    this.inputElement.value = this.history[this.historyIndex] || '';
  }
}


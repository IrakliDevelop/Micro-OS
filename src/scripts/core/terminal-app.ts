/**
 * Command handler function signature
 */
export type CommandHandler = (args: string[], app: TerminalApp) => void;

/**
 * Command registry entry
 */
interface Command {
  name: string;
  description: string;
  handler: CommandHandler;
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
  public registerCommand(name: string, description: string, handler: CommandHandler): void {
    this.commands.set(name.toLowerCase(), { name, description, handler });
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
      // Future: implement tab completion
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


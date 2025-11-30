import type { TerminalApp } from '../core/terminal-app';
import type { FileSystem } from '../core/file-system';
import type { ManPageRegistry } from '../core/man-registry';

/**
 * Editor mode type
 */
type EditorMode = 'normal' | 'insert';

/**
 * Text Editor
 * A minimal vim-like text editor for the browser terminal
 */
export class TextEditor {
  private app: TerminalApp;
  private fileSystem: FileSystem;
  
  // Editor state
  private mode: EditorMode = 'normal';
  private buffer: string[] = [''];
  private cursorX: number = 0;
  private cursorY: number = 0;
  private filename: string | null = null;
  private modified: boolean = false;
  
  // DOM elements
  private container: HTMLElement | null = null;
  private contentElement: HTMLElement | null = null;
  
  // Event handler bound to this instance
  private boundKeyHandler: ((e: KeyboardEvent) => void) | null = null;

  constructor(app: TerminalApp, fileSystem: FileSystem) {
    this.app = app;
    this.fileSystem = fileSystem;
    this.createEditorUI();
  }

  /**
   * Create the editor UI structure
   */
  private createEditorUI(): void {
    this.container = document.createElement('div');
    this.container.className = 'text-editor';
    this.container.innerHTML = `
      <div class="editor-header">
        <span class="editor-filename" id="editor-filename">New File</span>
        <span class="editor-modified" id="editor-modified"></span>
      </div>
      <div class="editor-content" id="editor-content"></div>
      <div class="editor-status">
        <span class="editor-mode" id="editor-mode">-- NORMAL --</span>
        <span class="editor-position" id="editor-position">1,1</span>
      </div>
    `;
    document.body.appendChild(this.container);

    // Get reference to content element
    this.contentElement = document.getElementById('editor-content');
  }

  /**
   * Open a file in the editor
   */
  public open(filename: string | null): void {
    this.filename = filename;
    this.modified = false;

    // Load file if it exists, otherwise start with empty buffer
    if (filename && this.fileSystem.fileExists(filename)) {
      const content = this.fileSystem.loadFile(filename);
      if (content !== null) {
        this.buffer = content.split('\n');
        if (this.buffer.length === 0) {
          this.buffer = [''];
        }
      } else {
        this.buffer = [''];
      }
    } else {
      this.buffer = [''];
    }

    // Reset cursor
    this.cursorX = 0;
    this.cursorY = 0;
    this.mode = 'normal';

    // Show editor
    this.show();
    this.attachEventListeners();
    this.render();
  }

  /**
   * Show the editor
   */
  private show(): void {
    if (this.container) {
      this.container.classList.add('active');
    }
    this.app.disableInput();
  }

  /**
   * Close the editor
   */
  public close(): void {
    if (this.container) {
      this.container.classList.remove('active');
    }
    this.detachEventListeners();
    this.app.enableInput();
  }

  /**
   * Render the editor content
   */
  private render(): void {
    if (!this.contentElement) return;

    // Clear content
    this.contentElement.innerHTML = '';

    // Render each line
    this.buffer.forEach((line, idx) => {
      const lineEl = document.createElement('div');
      lineEl.className = 'editor-line';

      if (idx === this.cursorY) {
        // Current line with cursor
        const before = this.escapeHtml(line.substring(0, this.cursorX));
        const cursorChar = line[this.cursorX] || ' ';
        const after = this.escapeHtml(line.substring(this.cursorX + 1));
        
        lineEl.innerHTML = `${before}<span class="editor-cursor">${this.escapeHtml(cursorChar)}</span>${after}`;
      } else {
        // Regular line
        lineEl.textContent = line || ' ';
      }

      this.contentElement!.appendChild(lineEl);
    });

    // Update header
    this.updateHeader();
    
    // Update status bar
    this.updateStatus();
  }

  /**
   * Update the header (filename and modified indicator)
   */
  private updateHeader(): void {
    const filenameEl = document.getElementById('editor-filename');
    const modifiedEl = document.getElementById('editor-modified');
    
    if (filenameEl) {
      filenameEl.textContent = this.filename || 'New File';
    }
    
    if (modifiedEl) {
      modifiedEl.textContent = this.modified ? '[+]' : '';
    }
  }

  /**
   * Update the status bar (mode and position)
   */
  private updateStatus(): void {
    const modeEl = document.getElementById('editor-mode');
    const positionEl = document.getElementById('editor-position');

    if (modeEl) {
      modeEl.textContent = `-- ${this.mode.toUpperCase()} --`;
    }

    if (positionEl) {
      positionEl.textContent = `${this.cursorY + 1},${this.cursorX + 1}`;
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Attach keyboard event listeners
   */
  private attachEventListeners(): void {
    this.boundKeyHandler = this.handleKeyDown.bind(this);
    document.addEventListener('keydown', this.boundKeyHandler);
  }

  /**
   * Detach keyboard event listeners
   */
  private detachEventListeners(): void {
    if (this.boundKeyHandler) {
      document.removeEventListener('keydown', this.boundKeyHandler);
      this.boundKeyHandler = null;
    }
  }

  /**
   * Main keyboard event handler
   */
  private handleKeyDown(e: KeyboardEvent): void {
    // Always prevent default to avoid browser shortcuts
    e.preventDefault();

    if (this.mode === 'normal') {
      this.handleNormalMode(e);
    } else if (this.mode === 'insert') {
      this.handleInsertMode(e);
    }

    // Re-render after each keystroke
    this.render();
  }

  /**
   * Handle normal mode keystrokes
   */
  private handleNormalMode(e: KeyboardEvent): void {
    const currentLine = this.buffer[this.cursorY];

    switch (e.key) {
      // Enter insert mode
      case 'i':
        this.mode = 'insert';
        break;

      // Navigation: h (left)
      case 'h':
        if (this.cursorX > 0) {
          this.cursorX--;
        }
        break;

      // Navigation: l (right)
      case 'l':
        if (this.cursorX < currentLine.length) {
          this.cursorX++;
        }
        break;

      // Navigation: j (down)
      case 'j':
        if (this.cursorY < this.buffer.length - 1) {
          this.cursorY++;
          // Keep cursor within line bounds
          this.cursorX = Math.min(this.cursorX, this.buffer[this.cursorY].length);
        }
        break;

      // Navigation: k (up)
      case 'k':
        if (this.cursorY > 0) {
          this.cursorY--;
          // Keep cursor within line bounds
          this.cursorX = Math.min(this.cursorX, this.buffer[this.cursorY].length);
        }
        break;

      // Command mode
      case ':':
        this.handleCommandMode();
        break;
    }
  }

  /**
   * Handle insert mode keystrokes
   */
  private handleInsertMode(e: KeyboardEvent): void {
    const line = this.buffer[this.cursorY];

    // Exit insert mode
    if (e.key === 'Escape') {
      this.mode = 'normal';
      // Move cursor back one if not at line start
      if (this.cursorX > 0) {
        this.cursorX--;
      }
      return;
    }

    // Mark as modified
    this.modified = true;

    // Handle Enter key (new line)
    if (e.key === 'Enter') {
      const before = line.substring(0, this.cursorX);
      const after = line.substring(this.cursorX);
      
      this.buffer[this.cursorY] = before;
      this.buffer.splice(this.cursorY + 1, 0, after);
      
      this.cursorY++;
      this.cursorX = 0;
      return;
    }

    // Handle Backspace
    if (e.key === 'Backspace') {
      if (this.cursorX > 0) {
        // Delete character before cursor
        this.buffer[this.cursorY] = 
          line.substring(0, this.cursorX - 1) + line.substring(this.cursorX);
        this.cursorX--;
      } else if (this.cursorY > 0) {
        // Join with previous line
        const prevLine = this.buffer[this.cursorY - 1];
        this.cursorX = prevLine.length;
        this.buffer[this.cursorY - 1] = prevLine + line;
        this.buffer.splice(this.cursorY, 1);
        this.cursorY--;
      }
      return;
    }

    // Handle regular character input
    if (e.key.length === 1) {
      this.buffer[this.cursorY] =
        line.substring(0, this.cursorX) + e.key + line.substring(this.cursorX);
      this.cursorX++;
    }
  }

  /**
   * Handle command mode (: commands)
   */
  private handleCommandMode(): void {
    const cmd = prompt(':');
    if (!cmd) return;

    const parts = cmd.trim().split(/\s+/);
    const command = parts[0];
    const arg = parts[1] || null;

    switch (command) {
      case 'w':
        // Save file
        this.saveFile(arg);
        break;

      case 'q':
        // Quit
        if (this.modified) {
          const confirm = window.confirm('File has unsaved changes. Quit anyway?');
          if (!confirm) return;
        }
        this.close();
        break;

      case 'wq':
        // Save and quit
        if (this.saveFile(arg)) {
          this.close();
        }
        break;

      case 'q!':
        // Force quit without saving
        this.close();
        break;

      default:
        alert(`Unknown command: ${command}`);
    }
  }

  /**
   * Save the current buffer to a file
   * Returns true if successful, false otherwise
   */
  private saveFile(newFilename: string | null): boolean {
    const targetFilename = newFilename || this.filename;

    if (!targetFilename) {
      alert('No filename specified. Use :w filename');
      return false;
    }

    try {
      const content = this.buffer.join('\n');
      this.fileSystem.saveFile(targetFilename, content);
      
      this.filename = targetFilename;
      this.modified = false;
      
      this.app.printLine(`"${targetFilename}" written (${content.length} characters)`);
      return true;
    } catch (error) {
      alert(`Error saving file: ${error}`);
      return false;
    }
  }
}

/**
 * Register text editor plugin
 */
export function registerTextEditor(
  app: TerminalApp, 
  fileSystem: FileSystem,
  _manRegistry: ManPageRegistry
): void {
  const editor = new TextEditor(app, fileSystem);

  // Register the edit command
  app.registerCommand(
    'edit',
    'Open text editor',
    (args: string[]) => {
      const filename = args[0] || null;
      editor.open(filename);
    },
    // Autocomplete: suggest existing files
    (_args: string[], _currentWord: string) => {
      return fileSystem.listFiles();
    }
  );

  // Register alias: vim
  app.registerCommand(
    'vim',
    'Alias for edit',
    (args: string[]) => {
      const filename = args[0] || null;
      editor.open(filename);
    },
    (_args: string[], _currentWord: string) => {
      return fileSystem.listFiles();
    }
  );

  // Register alias: vi
  app.registerCommand(
    'vi',
    'Alias for edit',
    (args: string[]) => {
      const filename = args[0] || null;
      editor.open(filename);
    },
    (_args: string[], _currentWord: string) => {
      return fileSystem.listFiles();
    }
  );
}


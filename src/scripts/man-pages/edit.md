# edit

## BRIEF
Open vim-like text editor

## USAGE
edit [filename]

## DESCRIPTION
Opens a modal text editor for creating and editing text files. The editor supports basic vim-like commands with NORMAL and INSERT modes.

## DETAILED
The text editor is a minimal vim-inspired editor that runs in your browser terminal.

**MODES:**
- NORMAL mode - Navigate and execute commands (default mode)
- INSERT mode - Type and edit text

**NORMAL MODE COMMANDS:**
- h, j, k, l - Move cursor left, down, up, right
- i - Enter INSERT mode at cursor position
- : - Enter command mode

**INSERT MODE:**
- Type normally to insert text
- Enter - Create new line
- Backspace - Delete character before cursor
- Escape - Return to NORMAL mode

**COMMAND MODE** (press : in NORMAL mode):
- :w - Save file with current filename
- :w filename - Save file with new filename
- :q - Quit (warns if unsaved changes)
- :wq - Save and quit
- :q! - Force quit without saving

**FILES:**
Files are stored in the browser's localStorage and persist across sessions. Use 'ls' to see all saved files.

The editor displays:
- File name and modification status in the header
- Current mode and cursor position in the status bar
- A blinking cursor showing your position in the text

## EXAMPLES
```
edit notes.txt
vim myfile.md
vi config.json
```


# cat

## BRIEF
Display file contents

## USAGE
cat <filename>

## DESCRIPTION
Displays the contents of a file to the terminal. Useful for quickly viewing files without opening the editor.

## DETAILED
The cat command reads a file from the virtual file system and displays its contents in the terminal.

**USAGE:**
cat <filename> - Display the contents of the specified file

**BEHAVIOR:**
- If the file doesn't exist, shows an error message
- If the file is empty, shows "[Empty file]"
- Otherwise, displays the full file contents line by line

This command is read-only and won't modify the file. Use 'edit' if you want to modify the file.

**TAB COMPLETION:**
The cat command supports tab completion for filenames. Press Tab to cycle through available files.

## EXAMPLES
```
cat notes.txt
cat config.json
```


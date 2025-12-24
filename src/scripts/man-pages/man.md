# man

## BRIEF
Display manual pages for commands

## USAGE
man [-v] [command]

## DESCRIPTION
Display documentation for commands. Without arguments, lists all available manual pages. With a command name, shows brief help. With -v flag, shows detailed documentation.

## DETAILED
The man command provides Unix-style manual pages for all commands in the terminal.

**USAGE MODES:**

1. List all manuals:
   man
   Shows a list of all commands that have documentation.

2. Brief help (default):
   man <command>
   Shows NAME, USAGE, DESCRIPTION, and EXAMPLES sections.
   This is perfect for a quick reminder of how to use a command.

3. Detailed help (verbose):
   man -v <command>
   Shows all sections including detailed documentation.
   Use this when you need comprehensive information.

**SECTIONS:**
- NAME - Command name and brief description
- USAGE - Command syntax and options
- DESCRIPTION - Short explanation of what the command does
- DETAILED - Comprehensive documentation (verbose only)
- EXAMPLES - Common usage examples

**TAB COMPLETION:**
The man command supports tab completion for command names. Start typing and press Tab to complete.

**TIPS:**
- Start with 'man' alone to see what's available
- Use brief mode (no -v) for quick reference
- Use verbose mode (with -v) when learning a new command

## EXAMPLES
```
man
man edit
man -v edit
```


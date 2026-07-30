# help

## BRIEF
Display available commands

## USAGE
help

## DESCRIPTION
Lists all registered commands with their brief descriptions. This is a quick way to see what commands are available.

## DETAILED
The help command displays a formatted list of all commands registered in the terminal.

**OUTPUT FORMAT:**
Each command is shown with:
- Command name (left-aligned)
- Brief description (right side)

The list includes:
- Core commands (help, clear, history, echo, boot)
- File commands (ls, cat, rm, edit, vim, vi)
- Plugin commands (sysinfo, theme, sound, man)

**ALTERNATIVE:**
For detailed information about a specific command, use:
- man <command> - Brief help
- man -v <command> - Detailed help

The man command provides more comprehensive documentation including usage examples and detailed explanations.

## EXAMPLES
```
help
```


# ls

## BRIEF
List files and commands

## USAGE
ls [-l]

## DESCRIPTION
Lists all files in the virtual file system. With -l flag, shows detailed information including file sizes.

## DETAILED
The ls command displays files stored in the browser's virtual file system.

**OPTIONS:**
- -l - Long format, shows file sizes in human-readable format

**OUTPUT:**
The command shows two sections:
1. Files: All files created with the editor
2. Commands: Reminder about available commands

**FILES LOCATION:**
All files are stored in browser localStorage with the 'vfs:' prefix. Files persist across browser sessions but are cleared if you clear site data.

**RELATED COMMANDS:**
- edit <file> - Open or create a file
- cat <file> - View file contents
- rm <file> - Delete a file

## EXAMPLES
```
ls
ls -l
```


# rm

## BRIEF
Remove files

## USAGE
rm [-f] <filename>

## DESCRIPTION
Removes a file from the virtual file system. By default, asks for confirmation before deletion.

## DETAILED
The rm command permanently deletes files from the virtual file system.

**OPTIONS:**
- -f - Force deletion without confirmation prompt

**BEHAVIOR:**
Without -f flag:
- Prompts for confirmation before deleting
- Can cancel the operation

With -f flag:
- Deletes immediately without asking
- Use with caution!

**WARNING:**
Deleted files cannot be recovered. The deletion is permanent. Consider using 'cat' to review file contents before deletion.

**TAB COMPLETION:**
Supports tab completion for filenames.

## EXAMPLES
```
rm oldfile.txt
rm -f junk.md
```


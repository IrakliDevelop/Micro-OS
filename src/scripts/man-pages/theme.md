# theme

## BRIEF
Manage terminal themes

## USAGE
theme [list|current|set <name>]

## DESCRIPTION
Manage and switch between different terminal color themes. Changes the phosphor color and overall appearance.

## DETAILED
The theme command allows you to customize the terminal's visual appearance.

**SUBCOMMANDS:**

theme list
- Shows all available themes with color previews
- Indicates which theme is currently active

theme current
- Displays the name of the currently active theme

theme set <name>
- Switches to the specified theme
- Theme preference is saved in localStorage
- Takes effect immediately

**AVAILABLE THEMES:**
- Green Phosphor (classic terminal green)
- Amber Monitor (warm amber/orange)
- Blue Screen (cool blue)
- White Terminal (high contrast white)
- Red Alert (red warning style)

**PERSISTENCE:**
Your theme choice is saved and will persist across browser sessions.

**TAB COMPLETION:**
The theme command supports tab completion for subcommands and theme names.

## EXAMPLES
```
theme
theme list
theme current
theme set amber
```


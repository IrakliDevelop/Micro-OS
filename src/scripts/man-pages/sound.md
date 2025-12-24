# sound

## BRIEF
Manage terminal sound effects

## USAGE
sound [status|on|off|test]

## DESCRIPTION
Control terminal sound effects including keystroke sounds, error notifications, and other audio feedback.

## DETAILED
The sound command manages audio feedback in the terminal.

**SUBCOMMANDS:**

sound status
- Shows whether sound is currently enabled or disabled
- Displays sound effect availability

sound on
- Enables all sound effects
- Preference is saved in localStorage

sound off
- Disables all sound effects
- Preference is saved in localStorage

sound test
- Plays a test sequence of different sound effects
- Useful for checking if sounds are working
- Includes keypress, error, and success sounds

**SOUND EFFECTS:**
- Keypress sounds - Subtle feedback when typing
- Error sounds - Alert when commands fail
- Success sounds - Confirmation for completed actions

**PERSISTENCE:**
Your sound preference is saved and persists across browser sessions.

**BROWSER SUPPORT:**
Sound effects use the Web Audio API. Most modern browsers support this, but some may require user interaction before playing sounds.

## EXAMPLES
```
sound
sound status
sound on
sound off
sound test
```


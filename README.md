# Retro Micro-OS

A lightweight, browser-based “operating system” inspired by 70s/80s green-phosphor terminals.
Runs entirely in the browser. No frameworks, no heavy libraries — just **vanilla TypeScript, HTML, and SCSS**, bundled with a minimal Webpack setup.

This project aims to recreate the nostalgic feeling of interacting with an old machine while providing actual utility, extensibility, and a clean, modern underlying architecture.

---

## 🚀 Project Goals

### 1. **Nostalgic Terminal Experience**
- Green on black CRT-like interface  
- Scanlines, glow, retro font  
- Command prompt with history navigation  
- Everything feels like an old machine booting up

### 2. **Micro-OS Architecture**
- A core `TerminalApp` that:
  - Handles input/output
  - Maintains command history
  - Manages a command registry
  - Provides a stable API for extensions

### 3. **Plugin System**
Commands are implemented as independent, modular “plugins.”

Examples:
- `notes` – localStorage note manager  
- `todo` – todo list manager  
- `sysinfo` – OS info  
- `theme` – switch CRT colors  
- Future: games, text adventures, hacker sim, D&D tools, etc.

Plugins are pure functions that take `app` and register new commands.

### 4. **Maximum Performance**
- No React, Vue, Angular, jQuery, etc.  
- Zero dependencies at runtime  
- Fast startup, tiny bundles  
- Efficient DOM usage (append-only terminal output)

### 5. **Developer Experience**
- TypeScript for safety and maintainability  
- Minimal Webpack config  
- Clean modular folder structure  
- Cursor rules ensure code consistency  

---

## 📂 Project Structure

```text
.
├─ README.md
├─ .cursor/rules.mdc
├─ package.json
├─ webpack.config.js
└─ /src
   ├─ index.html
   ├─ /styles
   │  ├─ main.scss
   │  └─ _variables.scss
   └─ /scripts
      ├─ main.ts
      ├─ /core
      │  ├─ terminal-app.ts
      │  └─ commands-core.ts
      └─ /plugins
         ├─ notes.ts
         ├─ todo.ts
         └─ ...future plugins...
```

---

## 🧠 Architecture Philosophy

### 1. Single Source of Truth for Terminal
Everything goes through `TerminalApp`.  
Plugins must not manipulate DOM directly — they print via `app.printLine()`.

### 2. Command Registry
Commands follow:

```
(name, description, handler(args, app))
```

### 3. Plugin Isolation
- Each plugin in its own file  
- Pure registration functions  
- No global state  

### 4. Reusability First
- One input component  
- One modal system (if needed later)  
- No duplicate components or DOM fragments  

### 5. Extensibility
New features plug in cleanly:

```ts
registerMyPlugin(app);
```

---

## 🔮 Future Scope

### Core Enhancements
- Themes  
- Boot sequence  
- ASCII logo generator  
- Aliases  

### Advanced Plugins
- Text adventure engine  
- Hacker simulation  
- D&D assistant tools  
- Productivity suite  

---

## ❤️ Personal Motivation

A nostalgic and extensible micro-OS built with clean architecture and minimal tooling.


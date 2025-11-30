import { TerminalApp } from './terminal-app';

/**
 * Boot sequence configuration
 */
interface BootConfig {
  memorySpeed: number;
  lineDelay: number;
  logoDelay: number;
}

const DEFAULT_CONFIG: BootConfig = {
  memorySpeed: 500,
  lineDelay: 300,
  logoDelay: 100,
};

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Animate memory counter
 */
async function animateMemoryCount(app: TerminalApp, config: BootConfig): Promise<void> {
  const target = 640;
  const steps = 20;
  const increment = target / steps;
  const delay = config.memorySpeed / steps;

  for (let i = 0; i <= steps; i++) {
    const current = Math.floor(i * increment);
    app.clear();
    app.printLine(`Memory Test: ${current}K OK`);
    await sleep(delay);
  }
}

/**
 * ASCII Logo
 */
const LOGO = [
  '╔═══════════════════════════════════════════════════════════╗',
  '║                                                           ║',
  '║          ██████╗ ███████╗████████╗██████╗  ██████╗        ║',
  '║          ██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗       ║',
  '║          ██████╔╝█████╗     ██║   ██████╔╝██║   ██║       ║',
  '║          ██╔══██╗██╔══╝     ██║   ██╔══██╗██║   ██║       ║',
  '║          ██║  ██║███████╗   ██║   ██║  ██║╚██████╔╝       ║',
  '║          ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝        ║',
  '║                                                           ║',
  '║                    MICRO-OS v1.0.0                        ║',
  '║                                                           ║',
  '╚═══════════════════════════════════════════════════════════╝',
];

/**
 * Run the full boot sequence
 */
export async function runBootSequence(app: TerminalApp, config: BootConfig = DEFAULT_CONFIG): Promise<void> {
  // Disable input during boot
  app.disableInput();
  
  // Clear screen
  app.clear();
  
  // Memory check
  await animateMemoryCount(app, config);
  await sleep(config.lineDelay);
  
  // Hardware initialization
  app.printLine('');
  app.printLine('Initializing hardware...');
  await sleep(config.lineDelay);
  app.printLine('  CPU: 8086 @ 4.77 MHz');
  await sleep(config.lineDelay);
  app.printLine('  RAM: 640K');
  await sleep(config.lineDelay);
  app.printLine('  Display: CRT Monochrome');
  await sleep(config.lineDelay);
  
  // System loading
  app.printLine('');
  app.printLine('Loading system...');
  await sleep(config.lineDelay);
  app.printLine('  [OK] Kernel loaded');
  await sleep(config.lineDelay);
  app.printLine('  [OK] Command processor initialized');
  await sleep(config.lineDelay);
  app.printLine('  [OK] File system mounted');
  await sleep(config.lineDelay);
  
  // Display logo
  app.printLine('');
  for (const line of LOGO) {
    app.printLine(line);
    await sleep(config.logoDelay);
  }
  
  // Welcome message
  app.printLine('');
  app.printLine('Welcome to Retro Micro-OS');
  app.printLine('Type "help" for available commands.');
  app.printLine('');
  app.printLine('System ready.', 'hint');
  app.printLine('');
  
  // Re-enable input
  app.enableInput();
}


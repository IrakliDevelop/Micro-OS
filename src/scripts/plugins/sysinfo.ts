import { TerminalApp } from '../core/terminal-app';
import type { ManPageRegistry } from '../core/man-registry';

/**
 * Register system information plugin
 */
export function registerSysInfoPlugin(app: TerminalApp, _manRegistry: ManPageRegistry): void {
  app.registerCommand(
    'sysinfo',
    'Display system information',
    (_args: string[], app: TerminalApp) => {
      app.printLine('');
      app.printLine('System Information', 'section-header');
      app.printLine('==================', 'section-header');
      app.printLine('');

      // Browser info
      const browserName = getBrowserName();
      app.printLine(`Browser:        ${browserName}`);
      app.printLine(`User Agent:     ${navigator.userAgent}`);
      app.printLine(`Platform:       ${navigator.platform}`);
      app.printLine(`Language:       ${navigator.language}`);
      
      // Screen info
      app.printLine(`Screen:         ${screen.width}x${screen.height}`);
      app.printLine(`Color Depth:    ${screen.colorDepth}-bit`);
      
      // Window info
      app.printLine(`Viewport:       ${window.innerWidth}x${window.innerHeight}`);
      
      // Device info
      app.printLine(`Cores:          ${navigator.hardwareConcurrency || 'Unknown'}`);
      app.printLine(`Online:         ${navigator.onLine ? 'Yes' : 'No'}`);
      
      // Memory (if available)
      const memory = (navigator as any).deviceMemory;
      if (memory) {
        app.printLine(`Memory:         ${memory} GB`);
      }
      
      // Connection (if available)
      const connection = (navigator as any).connection;
      if (connection) {
        app.printLine(`Connection:     ${connection.effectiveType || 'Unknown'}`);
      }

      app.printLine('');
    }
  );
}

/**
 * Detect browser name
 */
function getBrowserName(): string {
  const ua = navigator.userAgent;
  
  if (ua.includes('Firefox/')) {
    return 'Mozilla Firefox';
  } else if (ua.includes('Edg/')) {
    return 'Microsoft Edge';
  } else if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
    return 'Google Chrome';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    return 'Apple Safari';
  } else if (ua.includes('Opera/') || ua.includes('OPR/')) {
    return 'Opera';
  }
  
  return 'Unknown Browser';
}

/**
 * Manual Page Interface
 * Represents documentation for a command
 */
export interface ManPage {
  name: string;           // Command name
  brief: string;          // One-line description for help listing
  usage: string;          // Command syntax (e.g., "edit [filename]")
  description: string;    // Short description paragraph
  detailed: string;       // Full documentation with multiple paragraphs
  examples?: string[];    // Optional usage examples
}

/**
 * Man Page Registry
 * Central repository for all command documentation
 */
export class ManPageRegistry {
  private pages: Map<string, ManPage> = new Map();

  /**
   * Register a manual page for a command
   */
  public registerManPage(page: ManPage): void {
    this.pages.set(page.name.toLowerCase(), page);
  }

  /**
   * Get a manual page by command name
   * Returns null if not found
   */
  public getManPage(name: string): ManPage | null {
    return this.pages.get(name.toLowerCase()) || null;
  }

  /**
   * Get all registered manual pages
   * Returns array of all pages sorted by name
   */
  public getAllPages(): ManPage[] {
    return Array.from(this.pages.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }

  /**
   * Check if a manual page exists for a command
   */
  public hasManPage(name: string): boolean {
    return this.pages.has(name.toLowerCase());
  }

  /**
   * Get list of all command names that have man pages
   */
  public getCommandNames(): string[] {
    return Array.from(this.pages.keys()).sort();
  }
}

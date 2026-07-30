/**
 * Virtual File System
 * Manages file storage using localStorage
 */
export class FileSystem {
  private readonly storagePrefix = 'vfs:';

  /**
   * Save a file to the virtual file system
   */
  public saveFile(filename: string, content: string): void {
    if (!filename) {
      throw new Error('Filename cannot be empty');
    }
    localStorage.setItem(this.storagePrefix + filename, content);
  }

  /**
   * Load a file from the virtual file system
   * Returns null if file doesn't exist
   */
  public loadFile(filename: string): string | null {
    if (!filename) {
      return null;
    }
    return localStorage.getItem(this.storagePrefix + filename);
  }

  /**
   * List all files in the virtual file system
   * Returns array of filenames (without prefix)
   */
  public listFiles(): string[] {
    const files: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.storagePrefix)) {
        files.push(key.substring(this.storagePrefix.length));
      }
    }
    return files.sort();
  }

  /**
   * Delete a file from the virtual file system
   * Returns true if file was deleted, false if it didn't exist
   */
  public deleteFile(filename: string): boolean {
    if (!filename) {
      return false;
    }
    const key = this.storagePrefix + filename;
    if (localStorage.getItem(key) !== null) {
      localStorage.removeItem(key);
      return true;
    }
    return false;
  }

  /**
   * Check if a file exists in the virtual file system
   */
  public fileExists(filename: string): boolean {
    if (!filename) {
      return false;
    }
    return localStorage.getItem(this.storagePrefix + filename) !== null;
  }

  /**
   * Get the size of a file in characters
   * Returns -1 if file doesn't exist
   */
  public getFileSize(filename: string): number {
    const content = this.loadFile(filename);
    return content !== null ? content.length : -1;
  }
}


import type { ManPage, ManPageRegistry } from './man-registry';

/**
 * Man Page Loader
 * Loads and parses markdown files into ManPage objects
 */

/**
 * Parse a markdown file into a ManPage object
 */
function parseMarkdownManPage(content: string): ManPage {
  const lines = content.split('\n');
  
  let name = '';
  let brief = '';
  let usage = '';
  let description = '';
  let detailed = '';
  const examples: string[] = [];
  
  let currentSection = '';
  let currentContent: string[] = [];
  let inCodeBlock = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Handle command name (first h1)
    if (line.startsWith('# ') && !name) {
      name = line.substring(2).trim();
      continue;
    }
    
    // Handle section headers
    if (line.startsWith('## ')) {
      // Save previous section
      if (currentSection && currentContent.length > 0) {
        saveSection(currentSection, currentContent.join('\n').trim());
      }
      
      currentSection = line.substring(3).trim().toUpperCase();
      currentContent = [];
      continue;
    }
    
    // Handle code blocks for examples
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      // If closing code block and we're in examples, save the content
      if (!inCodeBlock && currentSection === 'EXAMPLES' && currentContent.length > 0) {
        const exampleLines = currentContent.join('\n').trim();
        if (exampleLines) {
          exampleLines.split('\n').forEach(ex => {
            if (ex.trim()) examples.push(ex.trim());
          });
        }
        currentContent = [];
      }
      continue;
    }
    
    // Collect content
    if (currentSection) {
      currentContent.push(line);
    }
  }
  
  // Save last section
  if (currentSection && currentContent.length > 0) {
    saveSection(currentSection, currentContent.join('\n').trim());
  }
  
  function saveSection(section: string, content: string) {
    switch (section) {
      case 'BRIEF':
        brief = content;
        break;
      case 'USAGE':
        usage = content;
        break;
      case 'DESCRIPTION':
        description = content;
        break;
      case 'DETAILED':
        detailed = content;
        break;
    }
  }
  
  // Validate required fields
  if (!name) {
    throw new Error('Man page must have a name (# heading)');
  }
  if (!brief) {
    throw new Error(`Man page ${name} must have a BRIEF section`);
  }
  if (!usage) {
    throw new Error(`Man page ${name} must have a USAGE section`);
  }
  if (!description) {
    throw new Error(`Man page ${name} must have a DESCRIPTION section`);
  }
  
  return {
    name,
    brief,
    usage,
    description,
    detailed: detailed || description, // Fallback to description if no detailed section
    examples: examples.length > 0 ? examples : undefined
  };
}

/**
 * Load all man pages from the man-pages directory
 */
export async function loadManPages(manRegistry: ManPageRegistry): Promise<void> {
  // Import all markdown files
  // Note: These will be bundled at build time by webpack
  const manPageFiles: Record<string, string> = {
    'edit': (await import('../man-pages/edit.md')).default,
    'vim': (await import('../man-pages/vim.md')).default,
    'vi': (await import('../man-pages/vi.md')).default,
    'ls': (await import('../man-pages/ls.md')).default,
    'cat': (await import('../man-pages/cat.md')).default,
    'rm': (await import('../man-pages/rm.md')).default,
    'man': (await import('../man-pages/man.md')).default,
    'help': (await import('../man-pages/help.md')).default,
    'clear': (await import('../man-pages/clear.md')).default,
    'history': (await import('../man-pages/history.md')).default,
    'echo': (await import('../man-pages/echo.md')).default,
    'boot': (await import('../man-pages/boot.md')).default,
    'sysinfo': (await import('../man-pages/sysinfo.md')).default,
    'theme': (await import('../man-pages/theme.md')).default,
    'sound': (await import('../man-pages/sound.md')).default,
  };
  
  // Parse and register each man page
  for (const [filename, content] of Object.entries(manPageFiles)) {
    try {
      const manPage = parseMarkdownManPage(content);
      manRegistry.registerManPage(manPage);
    } catch (error) {
      console.error(`Error loading man page ${filename}:`, error);
    }
  }
}


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
export function loadManPages(manRegistry: ManPageRegistry): void {
  // Use webpack's require.context to dynamically import all .md files
  // This allows adding new man pages without code changes
  const manPagesContext = require.context('../man-pages', false, /\.md$/);
  
  // Parse and register each man page
  for (const key of manPagesContext.keys()) {
    try {
      const content = manPagesContext(key);
      const manPage = parseMarkdownManPage(content);
      manRegistry.registerManPage(manPage);
    } catch (error) {
      const filename = key.replace(/^\.\//, '').replace(/\.md$/, '');
      console.error(`Error loading man page ${filename}:`, error);
    }
  }
}


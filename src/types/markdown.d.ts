// Type declarations for raw markdown imports
declare module '*.md' {
  const content: string;
  export default content;
}

// Type declaration for webpack's require.context
interface RequireContext {
  keys(): string[];
  (id: string): { default: string };
  resolve(id: string): string;
  id: string;
}

declare global {
  const require: NodeRequire & {
    context(
      directory: string,
      useSubdirectories?: boolean,
      regExp?: RegExp,
      mode?: 'sync' | 'eager' | 'weak' | 'lazy' | 'lazy-once'
    ): RequireContext;
  };
}

export {};


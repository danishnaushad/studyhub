export function getCategoryColor(color: string | undefined): string {
  if (!color) return 'hsl(var(--muted-foreground))';
  
  // Legacy support for hex values
  if (color.startsWith('#') || color.startsWith('rgb')) {
    return color;
  }
  
  // Semantic category color
  return `hsl(var(--cat-${color}))`;
}

export function getCategoryColorClass(color: string | undefined, prefix: 'bg' | 'text' | 'border' | 'ring' = 'bg'): string {
  if (!color) return `${prefix}-muted-foreground`;
  
  if (color.startsWith('#') || color.startsWith('rgb')) {
    return ''; // Inline styles must be used instead for legacy colors
  }
  
  return `${prefix}-cat-${color}`;
}

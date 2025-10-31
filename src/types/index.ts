export interface ElementData {
  id: string;
  type: 'container' | 'button' | 'header' | 'footer' | 'sidebar' | 'nav' | 'box' | 'grid' | 'list' | 'flex';
  x: number;
  y: number;
  width: number;
  height: number;
  children: string[];
  parentId?: string;
  styles: {
    // Layout
    display?: string;
    position?: 'absolute' | 'relative';
    zIndex?: number;
    
    // Sizing & Spacing
    padding?: string;
    margin?: string;
    
    // Appearance
    backgroundColor?: string;
    color?: string;
    borderRadius?: string;
    border?: string;
    boxShadow?: string;

    // Typography
    fontSize?: string;
    fontWeight?: string;
    
    // Flexbox & Grid
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gridTemplateColumns?: string;
    gap?: string;
  };
}

export interface ComponentConfig {
  defaultWidth: number;
  defaultHeight: number;
  defaultStyles: Partial<ElementData['styles']>;
  isContainer?: boolean;
}

export interface ComponentPaletteItem {
  type: ElementData['type'];
  label: string;
  icon: string;
}

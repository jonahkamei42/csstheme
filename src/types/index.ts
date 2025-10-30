export interface ElementData {
  id: string;
  type: 'container' | 'button' | 'header' | 'footer' | 'sidebar' | 'nav' | 'box' | 'grid' | 'list' | 'flex';
  x: number;
  y: number;
  width: number;
  height: number;
  children?: string[];
  parentId?: string;
  styles: {
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    display?: string;
    flexDirection?: string;
    gridTemplateColumns?: string;
    gap?: string;
    borderRadius?: string;
    border?: string;
  };
}

export interface ComponentPaletteItem {
  type: ElementData['type'];
  label: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultStyles: ElementData['styles'];
}

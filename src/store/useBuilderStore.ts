import { create } from 'zustand';
import { produce } from 'immer';
import { ElementData, ComponentConfig } from '../types';

export const componentsConfig: Record<ElementData['type'], ComponentConfig> = {
  container: { defaultWidth: 400, defaultHeight: 300, defaultStyles: { backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '8px', display: 'block' }, isContainer: true },
  box: { defaultWidth: 150, defaultHeight: 100, defaultStyles: { backgroundColor: '#dbeafe', padding: '16px', borderRadius: '6px' } },
  button: { defaultWidth: 120, defaultHeight: 40, defaultStyles: { backgroundColor: '#3b82f6', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', border: 'none' } },
  header: { defaultWidth: 800, defaultHeight: 80, defaultStyles: { backgroundColor: '#1f2937', padding: '20px', display: 'flex', alignItems: 'center' }, isContainer: true },
  footer: { defaultWidth: 800, defaultHeight: 60, defaultStyles: { backgroundColor: '#374151', padding: '16px' }, isContainer: true },
  sidebar: { defaultWidth: 250, defaultHeight: 500, defaultStyles: { backgroundColor: '#1e293b', padding: '20px' }, isContainer: true },
  nav: { defaultWidth: 600, defaultHeight: 50, defaultStyles: { backgroundColor: '#0f172a', padding: '12px', display: 'flex', gap: '16px', alignItems: 'center' }, isContainer: true },
  flex: { defaultWidth: 400, defaultHeight: 200, defaultStyles: { backgroundColor: '#fef3c7', padding: '16px', display: 'flex', gap: '12px', flexDirection: 'row' }, isContainer: true },
  grid: { defaultWidth: 400, defaultHeight: 300, defaultStyles: { backgroundColor: '#e9d5ff', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }, isContainer: true },
  list: { defaultWidth: 300, defaultHeight: 200, defaultStyles: { backgroundColor: '#fce7f3', padding: '16px' } },
};

type ElementsMap = Record<string, ElementData>;

interface BuilderState {
  elements: ElementsMap;
  selectedId: string | null;
  showCSSOutput: boolean;
  history: ElementsMap[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
}

interface BuilderActions {
  addElement: (type: ElementData['type'], position: { x?: number; y?: number }, parentId?: string) => void;
  updateElement: (id: string, updates: Partial<Omit<ElementData, 'styles'>> | { styles: Partial<ElementData['styles']> }, commit?: boolean) => void;
  deleteElement: (id: string) => void;
  setSelectedId: (id: string | null) => void;
  setShowCSSOutput: (show: boolean) => void;
  clearCanvas: () => void;
  commitHistory: () => void;
  undo: () => void;
  redo: () => void;
}

const useBuilderStore = create<BuilderState & BuilderActions>((set, get) => ({
  elements: {},
  selectedId: null,
  showCSSOutput: false,
  history: [{}],
  historyIndex: 0,
  canUndo: false,
  canRedo: false,

  addElement: (type, position, parentId) => {
    const config = componentsConfig[type];
    const newElement: ElementData = {
      id: `${type}-${Date.now()}`,
      type,
      x: position.x ?? 10,
      y: position.y ?? 10,
      width: config.defaultWidth,
      height: config.defaultHeight,
      children: [],
      parentId,
      styles: { ...config.defaultStyles },
    };

    set(produce((draft: BuilderState) => {
      draft.elements[newElement.id] = newElement;
      if (parentId) {
        draft.elements[parentId]?.children.push(newElement.id);
      }
      draft.selectedId = newElement.id;
    }));
    get().commitHistory();
  },

  updateElement: (id, updates, commit = true) => {
    set(produce((draft: BuilderState) => {
      const element = draft.elements[id];
      if (element) {
        if ('styles' in updates) {
          Object.assign(element.styles, updates.styles);
        } else {
          Object.assign(element, updates);
        }
      }
    }));
    if (commit) {
      get().commitHistory();
    }
  },

  deleteElement: (id) => {
    set(produce((draft: BuilderState) => {
      const elementToDelete = draft.elements[id];
      if (!elementToDelete) return;

      const queue = [...elementToDelete.children];
      while (queue.length > 0) {
        const childId = queue.shift()!;
        const child = draft.elements[childId];
        if (child) {
          queue.push(...child.children);
          delete draft.elements[childId];
        }
      }

      if (elementToDelete.parentId) {
        const parent = draft.elements[elementToDelete.parentId];
        if (parent) {
          parent.children = parent.children.filter(childId => childId !== id);
        }
      }
      
      delete draft.elements[id];
      if (draft.selectedId === id) {
        draft.selectedId = null;
      }
    }));
    get().commitHistory();
  },
  
  setSelectedId: (id) => set({ selectedId: id }),
  setShowCSSOutput: (show) => set({ showCSSOutput: show }),

  clearCanvas: () => {
    set({ elements: {}, selectedId: null });
    get().commitHistory();
  },

  commitHistory: () => {
    const currentElements = get().elements;
    set(produce(draft => {
        const newHistory = draft.history.slice(0, draft.historyIndex + 1);
        // Prevent pushing identical state
        if (JSON.stringify(newHistory[draft.historyIndex]) === JSON.stringify(currentElements)) {
          return;
        }
        newHistory.push(JSON.parse(JSON.stringify(currentElements)));
        draft.history = newHistory;
        draft.historyIndex = newHistory.length - 1;
        draft.canUndo = draft.historyIndex > 0;
        draft.canRedo = false;
    }));
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      set(produce(draft => {
        draft.historyIndex--;
        draft.elements = JSON.parse(JSON.stringify(draft.history[draft.historyIndex]));
        draft.selectedId = null;
        draft.canUndo = draft.historyIndex > 0;
        draft.canRedo = true;
      }));
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      set(produce(draft => {
        draft.historyIndex++;
        draft.elements = JSON.parse(JSON.stringify(draft.history[draft.historyIndex]));
        draft.selectedId = null;
        draft.canUndo = true;
        draft.canRedo = draft.historyIndex < draft.history.length - 1;
      }));
    }
  },
}));

// Initialize history on load
useBuilderStore.getState().commitHistory();

export { useBuilderStore };

import type { ModuleNavigation } from '~~/types/module';

interface NavigationState {
  menuItems: ModuleNavigation[];
  moduleMenuItems: Map<string, ModuleNavigation[]>;
}

export const useNavigationStore = defineStore('navigation', {
  state: (): NavigationState => ({
    menuItems: [],
    moduleMenuItems: new Map()
  }),

  getters: {
    allMenuItems: (state) => {
      const allItems = [...state.menuItems];
      
      // Add module menu items
      for (const [moduleId, items] of state.moduleMenuItems) {
        allItems.push(...items);
      }
      
      // Sort by order if specified
      return allItems.sort((a, b) => {
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;
        return orderA - orderB;
      });
    },

    getMenuItemsByModule: (state) => (moduleId: string) => {
      return state.moduleMenuItems.get(moduleId) || [];
    }
  },

  actions: {
    addMenuItem(item: ModuleNavigation, moduleId?: string) {
      if (moduleId) {
        const moduleItems = this.moduleMenuItems.get(moduleId) || [];
        moduleItems.push(item);
        this.moduleMenuItems.set(moduleId, moduleItems);
      } else {
        this.menuItems.push(item);
      }
    },

    removeMenuItem(itemId: string, moduleId?: string) {
      if (moduleId) {
        const moduleItems = this.moduleMenuItems.get(moduleId) || [];
        const index = moduleItems.findIndex(item => item.id === itemId);
        if (index !== -1) {
          moduleItems.splice(index, 1);
          this.moduleMenuItems.set(moduleId, moduleItems);
        }
      } else {
        const index = this.menuItems.findIndex(item => item.id === itemId);
        if (index !== -1) {
          this.menuItems.splice(index, 1);
        }
      }
    },

    removeModuleMenuItems(moduleId: string) {
      this.moduleMenuItems.delete(moduleId);
    },

    clearAllMenuItems() {
      this.menuItems = [];
      this.moduleMenuItems.clear();
    }
  }
}); 
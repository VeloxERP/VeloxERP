interface ModuleNavigation {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  children?: ModuleNavigation[];
  permission?: string;
  order?: number;
}

export default defineNuxtPlugin(() => {
  const navigation = {
    addMenuItem(item: ModuleNavigation) {
      // This will be implemented with the navigation store
      console.log('Adding menu item:', item);
    },
    
    removeMenuItem(itemId: string) {
      console.log('Removing menu item:', itemId);
    }
  };

  return {
    provide: {
      navigation
    }
  };
}); 
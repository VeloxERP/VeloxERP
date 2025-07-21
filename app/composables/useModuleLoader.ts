// Module types
interface ModuleManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  dependencies?: string[];
  routes?: ModuleRoute[];
  navigation?: ModuleNavigation[];
  apiRoutes?: ModuleApiRoute[];
  stores?: ModuleStore[];
  components?: ModuleComponent[];
  permissions?: string[];
}

interface ModuleRoute {
  path: string;
  component: string;
  name?: string;
  meta?: Record<string, any>;
  middleware?: string[];
}

interface ModuleNavigation {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  children?: ModuleNavigation[];
  permission?: string;
  order?: number;
}

interface ModuleApiRoute {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  handler: string;
  middleware?: string[];
}

interface ModuleStore {
  name: string;
  path: string;
}

interface ModuleComponent {
  name: string;
  path: string;
  global?: boolean;
}

interface ModuleInstance {
  manifest: ModuleManifest;
  register: () => Promise<void>;
  unregister: () => Promise<void>;
  isActive: boolean;
}

export const useModuleLoader = () => {
  const activeModules = useState<Map<string, ModuleInstance>>('active-modules', () => new Map());
  const moduleRegistry = useState<Map<string, ModuleManifest>>('module-registry', () => new Map());

  const loadModule = async (moduleId: string): Promise<ModuleInstance> => {
    try {
      // Check if module is already loaded
      if (activeModules.value.has(moduleId)) {
        return activeModules.value.get(moduleId)!;
      }

      // Load module manifest
      const manifest = await loadModuleManifest(moduleId);
      if (!manifest) {
        throw new Error(`Module manifest not found for ${moduleId}`);
      }

      // Check dependencies
      if (manifest.dependencies) {
        for (const dep of manifest.dependencies) {
          if (!activeModules.value.has(dep)) {
            await loadModule(dep);
          }
        }
      }

      // Create module instance
      const moduleInstance: ModuleInstance = {
        manifest,
        isActive: false,
        register: async () => {
          await registerModule(moduleInstance);
          moduleInstance.isActive = true;
        },
        unregister: async () => {
          await unregisterModule(moduleInstance);
          moduleInstance.isActive = false;
        }
      };

      // Register module
      await moduleInstance.register();
      activeModules.value.set(moduleId, moduleInstance);
      moduleRegistry.value.set(moduleId, manifest);

      return moduleInstance;
    } catch (error) {
      console.error(`Failed to load module ${moduleId}:`, error);
      throw error;
    }
  };

  const unloadModule = async (moduleId: string): Promise<void> => {
    const module = activeModules.value.get(moduleId);
    if (!module) {
      return;
    }

    // Check if other modules depend on this one
    for (const [id, instance] of activeModules.value) {
      if (instance.manifest.dependencies?.includes(moduleId)) {
        throw new Error(`Cannot unload module ${moduleId} - module ${id} depends on it`);
      }
    }

    await module.unregister();
    activeModules.value.delete(moduleId);
    moduleRegistry.value.delete(moduleId);
  };

  const getActiveModules = (): string[] => {
    return Array.from(activeModules.value.keys());
  };

  const isModuleActive = (moduleId: string): boolean => {
    return activeModules.value.has(moduleId);
  };

  const getModuleManifest = (moduleId: string): ModuleManifest | undefined => {
    return moduleRegistry.value.get(moduleId);
  };

  return {
    loadModule,
    unloadModule,
    getActiveModules,
    isModuleActive,
    getModuleManifest,
    activeModules: readonly(activeModules),
    moduleRegistry: readonly(moduleRegistry)
  };
};

async function loadModuleManifest(moduleId: string): Promise<ModuleManifest | null> {
  try {
    // Try to load from API first
    const response = await $fetch(`/api/modules/${moduleId}/manifest`) as any;
    return response.data;
  } catch {
    // Fallback to local file system
    try {
      const manifest = await import(`~/modules/${moduleId}/manifest.ts`);
      return manifest.default;
    } catch {
      return null;
    }
  }
}

async function registerModule(module: ModuleInstance): Promise<void> {
  const nuxtApp = useNuxtApp();
  const navigation = nuxtApp.$navigation as any;
  
  // Register routes
  if (module.manifest.routes) {
    for (const route of module.manifest.routes) {
      await registerModuleRoute(module.manifest.id, route);
    }
  }

  // Register navigation
  if (module.manifest.navigation && navigation) {
    for (const nav of module.manifest.navigation) {
      navigation.addMenuItem(nav);
    }
  }

  // Register API routes (server-side only)
  if (process.server && module.manifest.apiRoutes) {
    for (const apiRoute of module.manifest.apiRoutes) {
      await registerModuleApiRoute(module.manifest.id, apiRoute);
    }
  }

  // Register stores
  if (module.manifest.stores) {
    for (const store of module.manifest.stores) {
      await registerModuleStore(module.manifest.id, store);
    }
  }

  // Register components
  if (module.manifest.components) {
    for (const component of module.manifest.components) {
      await registerModuleComponent(module.manifest.id, component);
    }
  }
}

async function unregisterModule(module: ModuleInstance): Promise<void> {
  const nuxtApp = useNuxtApp();
  const navigation = nuxtApp.$navigation as any;

  // Unregister navigation
  if (module.manifest.navigation && navigation) {
    for (const nav of module.manifest.navigation) {
      navigation.removeMenuItem(nav.id);
    }
  }

  // Unregister routes
  if (module.manifest.routes) {
    for (const route of module.manifest.routes) {
      await unregisterModuleRoute(module.manifest.id, route);
    }
  }

  // Unregister API routes
  if (process.server && module.manifest.apiRoutes) {
    for (const apiRoute of module.manifest.apiRoutes) {
      await unregisterModuleApiRoute(module.manifest.id, apiRoute);
    }
  }
}

async function registerModuleRoute(moduleId: string, route: any): Promise<void> {
  // This would be handled by Nuxt's dynamic route system
  // Routes are automatically registered when placed in the pages directory
  console.log(`Registering route for module ${moduleId}:`, route);
}

async function unregisterModuleRoute(moduleId: string, route: any): Promise<void> {
  console.log(`Unregistering route for module ${moduleId}:`, route);
}

async function registerModuleApiRoute(moduleId: string, apiRoute: any): Promise<void> {
  console.log(`Registering API route for module ${moduleId}:`, apiRoute);
}

async function unregisterModuleApiRoute(moduleId: string, apiRoute: any): Promise<void> {
  console.log(`Unregistering API route for module ${moduleId}:`, apiRoute);
}

async function registerModuleStore(moduleId: string, store: any): Promise<void> {
  console.log(`Registering store for module ${moduleId}:`, store);
}

async function registerModuleComponent(moduleId: string, component: any): Promise<void> {
  console.log(`Registering component for module ${moduleId}:`, component);
} 
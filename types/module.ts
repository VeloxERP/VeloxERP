export interface ModuleManifest {
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

export interface ModuleRoute {
  path: string;
  component: string;
  name?: string;
  meta?: Record<string, any>;
  middleware?: string[];
}

export interface ModuleNavigation {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  children?: ModuleNavigation[];
  permission?: string;
  order?: number;
}

export interface ModuleApiRoute {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  handler: string;
  middleware?: string[];
}

export interface ModuleStore {
  name: string;
  path: string;
}

export interface ModuleComponent {
  name: string;
  path: string;
  global?: boolean;
}

export interface ModuleInstance {
  manifest: ModuleManifest;
  register: () => Promise<void>;
  unregister: () => Promise<void>;
  isActive: boolean;
}

export interface ModuleLoader {
  loadModule: (moduleId: string) => Promise<ModuleInstance>;
  unloadModule: (moduleId: string) => Promise<void>;
  getActiveModules: () => string[];
  isModuleActive: (moduleId: string) => boolean;
} 
<template>
  <div class="container mx-auto py-6 dark:text-white">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Module Management</h1>
        <p class="text-muted-foreground">Manage ERP modules and features</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Available Modules -->
      <Card>
        <CardHeader>
          <CardTitle>Available Modules</CardTitle>
          <CardDescription>
            All modules that can be activated in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="module in availableModules" :key="module.id" class="flex items-center justify-between p-4 border rounded-lg">
              <div class="flex-1">
                <h3 class="font-medium">{{ module.name }}</h3>
                <p class="text-sm text-muted-foreground">{{ module.description }}</p>
                <div class="flex items-center mt-2 space-x-4 text-xs text-muted-foreground">
                  <span>v{{ module.version }}</span>
                  <span>by {{ module.author }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <Badge v-if="isModuleActive(module.id)" variant="default">
                  Active
                </Badge>
                <Badge v-else variant="secondary">
                  Inactive
                </Badge>
                <Button
                  v-if="!isModuleActive(module.id)"
                  size="sm"
                  @click="activateModule(module.id)"
                  :disabled="loading"
                >
                  Activate
                </Button>
                <Button
                  v-else
                  size="sm"
                  variant="destructive"
                  @click="deactivateModule(module.id)"
                  :disabled="loading"
                >
                  Deactivate
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Active Modules -->
      <Card>
        <CardHeader>
          <CardTitle>Active Modules</CardTitle>
          <CardDescription>
            Currently loaded and running modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-if="activeModules.length === 0" class="text-center py-8 text-muted-foreground">
              <Package class="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No modules are currently active</p>
            </div>
            <div v-else v-for="moduleId in activeModules" :key="moduleId" class="flex items-center justify-between p-4 border rounded-lg">
              <div class="flex-1">
                <h3 class="font-medium">{{ getModuleName(moduleId) }}</h3>
                <p class="text-sm text-muted-foreground">Module ID: {{ moduleId }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <Badge variant="default">Active</Badge>
                <Button
                  size="sm"
                  variant="outline"
                  @click="showModuleDetails(moduleId)"
                >
                  Details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Module Details Dialog -->
    <Dialog v-model:open="detailsDialogOpen">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Module Details</DialogTitle>
          <DialogDescription>
            Detailed information about the selected module
          </DialogDescription>
        </DialogHeader>
        <div v-if="selectedModule" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium">Name</label>
              <p class="text-sm text-muted-foreground">{{ selectedModule.name }}</p>
            </div>
            <div>
              <label class="text-sm font-medium">Version</label>
              <p class="text-sm text-muted-foreground">{{ selectedModule.version }}</p>
            </div>
            <div>
              <label class="text-sm font-medium">Author</label>
              <p class="text-sm text-muted-foreground">{{ selectedModule.author }}</p>
            </div>
            <div>
              <label class="text-sm font-medium">ID</label>
              <p class="text-sm text-muted-foreground">{{ selectedModule.id }}</p>
            </div>
          </div>
          
          <div>
            <label class="text-sm font-medium">Description</label>
            <p class="text-sm text-muted-foreground">{{ selectedModule.description }}</p>
          </div>

          <div v-if="selectedModule.routes && selectedModule.routes.length > 0">
            <label class="text-sm font-medium">Routes</label>
            <div class="space-y-2">
              <div v-for="route in selectedModule.routes" :key="route.path" class="text-sm text-muted-foreground">
                {{ route.path }} → {{ route.component }}
              </div>
            </div>
          </div>

          <div v-if="selectedModule.permissions && selectedModule.permissions.length > 0">
            <label class="text-sm font-medium">Permissions</label>
            <div class="flex flex-wrap gap-1">
              <Badge v-for="permission in selectedModule.permissions" :key="permission" variant="outline" class="text-xs">
                {{ permission }}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#components';
import { Button } from '#components';
import { Badge } from '#components';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '#components';
import { Package } from 'lucide-vue-next';

interface Module {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  permissions?: string[];
  routes?: any[];
}

const { loadModule, unloadModule, getActiveModules, isModuleActive, getModuleManifest } = useModuleLoader();

const availableModules = ref<Module[]>([]);
const activeModules = ref<string[]>([]);
const loading = ref(false);
const detailsDialogOpen = ref(false);
const selectedModule = ref<Module | null>(null);

const loadModules = async () => {
  try {
    const response = await $fetch('/api/modules') as any;
    availableModules.value = response.body || [];
    activeModules.value = getActiveModules();
  } catch (error) {
    console.error('Failed to load modules:', error);
  }
};

const activateModule = async (moduleId: string) => {
  loading.value = true;
  try {
    await loadModule(moduleId);
    activeModules.value = getActiveModules();
    console.log(`Module ${moduleId} activated successfully`);
  } catch (error) {
    console.error(`Failed to activate module ${moduleId}:`, error);
  } finally {
    loading.value = false;
  }
};

const deactivateModule = async (moduleId: string) => {
  loading.value = true;
  try {
    await unloadModule(moduleId);
    activeModules.value = getActiveModules();
    console.log(`Module ${moduleId} deactivated successfully`);
  } catch (error) {
    console.error(`Failed to deactivate module ${moduleId}:`, error);
  } finally {
    loading.value = false;
  }
};

const showModuleDetails = (moduleId: string) => {
  const manifest = getModuleManifest(moduleId);
  if (manifest) {
    selectedModule.value = manifest;
    detailsDialogOpen.value = true;
  }
};

const getModuleName = (moduleId: string) => {
  const module = availableModules.value.find(m => m.id === moduleId);
  return module?.name || moduleId;
};

onMounted(() => {
  loadModules();
});
</script> 
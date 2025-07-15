<template>
  <div class="container mx-auto py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Product Properties</h1>
      <Button @click="showCreatePropertyDialog = true">
        <Plus class="mr-2 h-4 w-4"/>
        Create Property
      </Button>
    </div>

    <div v-if="status === 'error'" class="rounded-md border border-red-200 bg-red-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <XCircle class="h-5 w-5 text-red-400" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error loading properties</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ error?.message || 'An error occurred while loading the properties.' }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Properties Table -->
    <div v-if="status === 'pending'" class="space-y-3">
      <div v-for="i in 5" :key="i" class="flex items-center space-x-4">
        <div class="h-12 w-12 rounded-full bg-muted animate-pulse"></div>
        <div class="space-y-2 flex-1">
          <div class="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
          <div class="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
        </div>
        <div class="h-8 w-8 bg-muted rounded animate-pulse"></div>
      </div>
    </div>
    <DataTable
        v-else-if="status === 'success'"
        :columns="columns"
        :data="properties"
    />

    <!-- Create/Edit Property Dialog -->
    <Dialog :open="showCreatePropertyDialog" @update:open="showCreatePropertyDialog = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ editingProperty ? 'Edit Property' : 'Create Property' }}</DialogTitle>
          <DialogDescription>
            {{ editingProperty ? 'Update property details' : 'Add a new product property' }}
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="saveProperty" class="space-y-4">
          <div class="space-y-2">
            <Label for="name">Name</Label>
            <Input id="name" v-model="propertyForm.name" required/>
          </div>

          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <Label for="code">Code</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle class="h-4 w-4 text-muted-foreground"/>
                  </TooltipTrigger>
                  <TooltipContent side="right" delayDuration={200}>
                    <p>A unique technical identifier for the property. Used for system integration and API references.
                      Must be unique and contain only letters, numbers, and underscores.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input id="code" v-model="propertyForm.code" required/>
          </div>

          <div class="space-y-2">
            <Label for="type">Type</Label>
            <Select v-model="propertyForm.type">
              <SelectTrigger>
                <SelectValue placeholder="Select type"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="select">Select</SelectItem>
                <SelectItem value="multiselect">Multi-select</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="description">Description</Label>
            <Textarea id="description" v-model="description"/>
          </div>

          <div v-if="errorMessage" class="text-sm text-red-500">
            {{ errorMessage }}
          </div>

          <DialogFooter>
            <Button variant="outline" @click="showCreatePropertyDialog = false">
              Cancel
            </Button>
            <Button type="submit" :disabled="isSaving">
              <Loader2 v-if="isSaving" class="mr-2 h-4 w-4 animate-spin"/>
              {{ editingProperty ? 'Update' : 'Create' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import {Button} from '~/components/ui/button'
import {Card, CardContent, CardTitle} from "~/components/ui/card";
import DataTable from '~/components/ui/data-table.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '~/components/ui/dropdown-menu'
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from '~/components/ui/dialog'
import {Input} from '~/components/ui/input'
import {Label} from '~/components/ui/label'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '~/components/ui/select'
import {Textarea} from '~/components/ui/textarea'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '~/components/ui/tooltip'
import {HelpCircle, Loader2, List, Pencil, Plus, Trash2, XCircle} from 'lucide-vue-next'

import {computed, onMounted, ref} from 'vue';
import type {
  NewProductProperty,
  ProductProperty,
  PropertyValue
} from '~/server/database/schema/product-properties.schema';
import type {ColumnDef} from '@tanstack/vue-table'
import {useRouter} from 'vue-router'
import {useLazyFetch} from '#imports'
import type {ApiResponse} from '~/types/ApiResponse'

const router = useRouter()

// Extend ProductProperty type to include values
interface ProductPropertyWithValues extends ProductProperty {
  values?: PropertyValue[];
}

// State
const showCreatePropertyDialog = ref(false);
const isSaving = ref(false);
const editingProperty = ref<ProductPropertyWithValues | null>(null);
const errorMessage = ref<string | null>(null);

// TODO: validate with zod
const propertyForm = ref<NewProductProperty>({
  name: '',
  code: '',
  type: 'text',
  description: ''
});

// Computed property for description
const description = computed({
  get: () => propertyForm.value.description || '',
  set: (value) => {
    propertyForm.value.description = value;
  }
});

// Fetch data using useAsyncData
const { data: propertiesData, refresh: refreshProperties, status, error } = useLazyFetch<ApiResponse>('/api/properties', {
  key: 'product-properties',
  transform: (response: ApiResponse) => {
    return {
      status: response.status,
      message: response.message,
      body: (response.body as ProductPropertyWithValues[])?.map((property: ProductPropertyWithValues) => ({
        ...property,
        values: property.values || []
      })) || []
    };
  }
});

// Create a computed property to handle the data
const properties = computed(() => propertiesData.value?.body || []);

// Column definitions
const columns: ColumnDef<ProductPropertyWithValues>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({row}) => h('div', {class: 'font-medium'}, row.getValue('name'))
  },
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({row}) => h('div', {class: 'font-mono text-sm'}, row.getValue('code'))
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({row}) => h('div', {class: 'capitalize'}, row.getValue('type'))
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({row}) => row.original.description || '-'
  },
  {
    id: 'values',
    header: 'Values',
    cell: ({row}) => {
      const property = row.original;
      return h(Button, {
        variant: 'ghost',
        onClick: () => router.push(`/products/properties/${property.id}`)
      }, () => `${property.values?.length || 0} values`);
    }
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-right' }, ''),
    cell: ({ row }) => {
      const property = row.original;
      return h('div', { class: 'flex justify-end space-x-2' }, [
        h(Button, {
          title: 'Edit Values',
          variant: 'ghost',
          size: 'icon',
          onClick: () => router.push(`/products/properties/${property.id}`)
        }, () => h(List, { class: 'h-4 w-4' })),
        h(Button, {
          title: 'Edit Propertie',
          variant: 'ghost',
          size: 'icon',
          onClick: () => editProperty(property)
        }, () => h(Pencil, { class: 'h-4 w-4' })),
        h(Button, {
          title: 'Delete',
          variant: 'ghost',
          size: 'icon',
          onClick: () => deleteProperty(property)
        }, () => h(Trash2, { class: 'h-4 w-4' }))
      ]);
    }
  }
];

// Property management
function createProperty() {
  editingProperty.value = null;
  propertyForm.value = {
    name: '',
    code: '',
    type: 'text',
    description: ''
  };
  showCreatePropertyDialog.value = true;
}

function editProperty(property: ProductPropertyWithValues) {
  editingProperty.value = property;
  propertyForm.value = {
    ...property,
    description: property.description || ''
  };
  showCreatePropertyDialog.value = true;
}

async function saveProperty() {
  if (!propertyForm.value.name || !propertyForm.value.code) return;

  isSaving.value = true;
  errorMessage.value = null;

  try {
    const url = editingProperty.value
        ? `/api/properties/${editingProperty.value.id}`
        : '/api/properties';

    const method = editingProperty.value ? 'PUT' : 'POST';

    const response = await $fetch(url, {
      method,
      body: propertyForm.value
    });

    if (response) {
      await refreshProperties();
      showCreatePropertyDialog.value = false;
    }
  } catch (error: any) {
    console.error('Failed to save property:', error);
    if (error.status === 409) {
      errorMessage.value = 'A property with this code already exists. Please use a different code.';
    } else {
      errorMessage.value = error.data?.message || 'Failed to save property. Please try again.';
    }
  } finally {
    isSaving.value = false;
  }
}

async function deleteProperty(property: ProductPropertyWithValues) {
  if (!confirm('Are you sure you want to delete this property?')) return;

  try {
    const response = await $fetch(`/api/properties/${property.id}`, {
      method: 'DELETE'
    });

    if (response) {
      await refreshProperties();
    }
  } catch (error) {
    console.error('Failed to delete property:', error);
  }
}

// Lifecycle
onMounted(() => {
  refreshProperties();
});
</script> 
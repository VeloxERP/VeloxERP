<template>
  <div class="container mx-auto py-6">
    <div class="flex justify-between items-center mb-6">
      <div class="space-y-1">
        <h1 class="text-3xl font-bold">{{ property?.name }} Values</h1>
        <p class="text-muted-foreground">Manage values for this property</p>
      </div>
      <Button @click="showAddValueDialog = true">
        <Plus class="mr-2 h-4 w-4"/>
        Add Value
      </Button>
    </div>

    <!-- Values Table -->
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
      :data="values"
    />

    <!-- Add/Edit Value Dialog -->
    <Dialog :open="showAddValueDialog" @update:open="showAddValueDialog = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ editingValue ? 'Edit Value' : 'Add Value' }}</DialogTitle>
          <DialogDescription>
            {{ editingValue ? 'Update value details' : 'Add a new value for this property' }}
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="saveValue" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="value">Value</Label>
              <template v-if="property?.type === 'color'">
                <div class="flex gap-2">
                  <Input id="value" v-model="valueForm.value" required/>
                  <Input 
                    type="color" 
                    v-model="colorCode" 
                    class="w-12 h-10 p-1"
                  />
                </div>
              </template>
              <template v-else-if="property?.type === 'number'">
                <Input 
                  id="value" 
                  type="number" 
                  v-model="valueForm.value" 
                  required
                />
              </template>
              <template v-else-if="property?.type === 'boolean'">
                <Select v-model="valueForm.value">
                  <SelectTrigger>
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectContent>
                </Select>
              </template>
              <template v-else>
                <Input id="value" v-model="valueForm.value" required/>
              </template>
            </div>

            <div class="space-y-2">
              <Label for="displayName">Display Name</Label>
              <Input id="displayName" v-model="displayName"/>
            </div>
          </div>

          <div v-if="errorMessage" class="text-sm text-red-500">
            {{ errorMessage }}
          </div>

          <DialogFooter>
            <Button variant="outline" @click="showAddValueDialog = false">
              Cancel
            </Button>
            <Button type="submit" :disabled="isSaving">
              <Loader2 v-if="isSaving" class="mr-2 h-4 w-4 animate-spin"/>
              {{ editingValue ? 'Update' : 'Add' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import {Loader2, MoreHorizontal, Pencil, Plus, Trash2} from 'lucide-vue-next'
import DataTable from '~/components/ui/data-table.vue'
import { Button } from '~/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '~/components/ui/dropdown-menu'
import type { ColumnDef } from '@tanstack/vue-table'
import type { NewPropertyValue, PropertyValue, ProductProperty } from '~/server/database/schema/product-properties.schema'
import type { ApiResponse } from '@/types/ApiResponse'

const route = useRoute()
const router = useRouter()

// State
const showAddValueDialog = ref(false)
const isSaving = ref(false)
const editingValue = ref<PropertyValue | null>(null)
const errorMessage = ref<string | null>(null)

const valueForm = ref<NewPropertyValue>({
  value: '',
  displayName: '',
  position: 0,
  propertyId: '',
  colorCode: '' as string
})

// Computed property for displayName
const displayName = computed({
  get: () => valueForm.value.displayName || '',
  set: (value) => {
    valueForm.value.displayName = value;
  }
})

// Computed property for colorCode
const colorCode = computed({
  get: () => valueForm.value.colorCode || '',
  set: (value) => {
    valueForm.value.colorCode = value;
  }
})

// Watch color code changes to update value for color type
watch(() => valueForm.value.colorCode, (newColor) => {
  if (property.value?.type === 'color' && newColor) {
    valueForm.value.value = newColor;
  }
})

// Watch value changes to update color code for color type
watch(() => valueForm.value.value, (newValue) => {
  if (property.value?.type === 'color' && newValue) {
    valueForm.value.colorCode = newValue;
  }
})

// Fetch data using useLazyFetch
const { data: propertyData, refresh: refreshProperty, status: propertyStatus, error: propertyError } = useLazyFetch<ApiResponse>(`/api/properties/${route.params.id}`, {
  key: 'property',
  transform: (response: ApiResponse) => {
    return {
      status: response.status,
      message: response.message,
      body: response.body as ProductProperty
    };
  }
});

const { data: valuesData, refresh: refreshValues, status: valuesStatus, error: valuesError } = useLazyFetch<ApiResponse>(`/api/properties/${route.params.id}/values`, {
  key: 'property-values',
  transform: (response: ApiResponse) => {
    return {
      status: response.status,
      message: response.message,
      body: response.body as PropertyValue[]
    };
  }
});

// Computed properties for the transformed data
const property = computed(() => propertyData.value?.body || null);
const values = computed(() => valuesData.value?.body || []);

// Computed status to handle both data loading states
const status = computed(() => {
  if (propertyStatus.value === 'pending' || valuesStatus.value === 'pending') return 'pending';
  if (propertyStatus.value === 'error' || valuesStatus.value === 'error') return 'error';
  return 'success';
});

// Error handling
const error = computed(() => {
  return propertyError.value || valuesError.value;
});

// Lifecycle
onMounted(() => {
  refreshProperty();
  refreshValues();
});

// Column definitions
const columns: ColumnDef<PropertyValue>[] = [
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('value'))
  },
  {
    accessorKey: 'displayName',
    header: 'Display Name',
    cell: ({ row }) => row.original.displayName || row.original.value
  },
  {
    accessorKey: 'position',
    header: 'Position',
    cell: ({ row }) => row.getValue('position')
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const value = row.original
      return h(DropdownMenu, null, {
        trigger: () => h(Button, {
          variant: 'ghost',
          class: 'h-8 w-8 p-0'
        }, () => h(MoreHorizontal, { class: 'h-4 w-4' })),
        content: () => h(DropdownMenuContent, { align: 'end' }, [
          h(DropdownMenuItem, {
            onClick: () => editValue(value)
          }, () => [
            h(Pencil, { class: 'mr-2 h-4 w-4' }),
            'Edit'
          ]),
          h(DropdownMenuItem, {
            onClick: () => deleteValue(value)
          }, () => [
            h(Trash2, { class: 'mr-2 h-4 w-4' }),
            'Delete'
          ])
        ])
      })
    }
  }
]

// Value management
function editValue(value: PropertyValue) {
  editingValue.value = value
  valueForm.value = {...value}
  showAddValueDialog.value = true
}

async function saveValue() {
  if (!property.value || !valueForm.value.value) return

  isSaving.value = true
  errorMessage.value = null

  try {
    const url = editingValue.value
      ? `/api/property-values/${editingValue.value.id}`
      : `/api/properties/${property.value.id}/values`

    const method = editingValue.value ? 'PUT' : 'POST'

    // Ensure we're sending a valid property value object
    const data = {
      ...valueForm.value,
      propertyId: property.value.id,
      position: valueForm.value.position || values.value.length,
      value: String(valueForm.value.value) // Ensure value is a string
    }
    
    console.log('Sending data:', data)
    
    // Validate required fields
    if (!data.value || !data.propertyId) {
      errorMessage.value = 'Value and property ID are required'
      isSaving.value = false
      return
    }

    // Use $fetch which handles HTTP errors better than useFetch
    const response = await $fetch<ApiResponse>(url, {
      method,
      body: data
    })

    console.log('API Response:', response)

    if (response && response.status >= 200 && response.status < 300) {
      await refreshValues()
      showAddValueDialog.value = false
      valueForm.value = {
        value: '',
        displayName: '',
        position: values.value.length,
        propertyId: property.value.id,
        colorCode: ''
      }
      editingValue.value = null
    } else {
      errorMessage.value = response?.message || 'Failed to save value'
    }
  } catch (error: any) {
    console.error('Failed to save value:', error)
    errorMessage.value = error.data?.message || 'Failed to save value. Please try again.'
  } finally {
    isSaving.value = false
  }
}

async function deleteValue(value: PropertyValue) {
  if (!confirm('Are you sure you want to delete this value?')) return

  try {
    const response = await $fetch<ApiResponse>(`/api/property-values/${value.id}`, {
      method: 'DELETE'
    })

    if (response && response.status >= 200 && response.status < 300) {
      await refreshValues()
    } else {
      console.error('Failed to delete value:', response)
    }
  } catch (error) {
    console.error('Failed to delete value:', error)
  }
}
</script> 
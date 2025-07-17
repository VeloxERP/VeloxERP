<!--
https://www.shadcn-vue.com/docs/components/data-table.html#row-actions
-->
<template>
  <div class="container mx-auto py-6 dark:text-white">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Product Categories</h1>
      <Dialog v-model:open="dialogOpen">
        <DialogTrigger asChild>
          <Button>
            Add Category
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Add a new product category.
            </DialogDescription>
          </DialogHeader>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label for="name">Name</Label>
              <Input id="name" v-model="form.name" required />
              <p v-if="formErrors.name" class="text-sm text-red-500">{{ formErrors.name }}</p>
            </div>
            <div class="space-y-2">
              <Label for="description">Description</Label>
              <Textarea id="description" v-model="form.description" />
              <p v-if="formErrors.description" class="text-sm text-red-500">{{ formErrors.description }}</p>
            </div>
            <div class="space-y-2">
              <Label for="parent">Parent Category</Label>
              <Select v-model="form.parentId">
                <SelectTrigger>
                  <SelectValue :placeholder="form.parentId === 'none' ? 'None' : data?.body?.find(c => c.id === form.parentId)?.name || 'Select a parent category'" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span>None</span>
                  </SelectItem>
                  <template v-for="parent in data?.body?.filter(c => !c.parentId)" :key="parent.id">
                    <SelectItem :value="parent.id">
                      <span>{{ parent.name }}</span>
                    </SelectItem>
                    <template v-for="child in data?.body?.filter(c => c.parentId === parent.id)" :key="child.id">
                      <SelectItem :value="child.id">
                        <span class="ml-4">{{ child.name }}</span>
                      </SelectItem>
                    </template>
                  </template>
                </SelectContent>
              </Select>
            </div>
            <div class="flex justify-end space-x-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" :disabled="status === 'pending'">
                Add Category
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <div class="rounded-md border">
      <DataTable
        :columns="columns"
        :data="sortedCategories"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuContent } from "~/components/ui/dropdown-menu";
import { MoreHorizontal } from 'lucide-vue-next';
import type { ColumnDef } from '@tanstack/vue-table';
import DataTable from '~/components/ui/data-table.vue';
import { z } from 'zod';
import { useLazyFetch } from '#imports';

interface Category {
  id: string;
  name: string;
  description: string;
  parentId?: string;
}

interface ApiResponse {
  status: number;
  message?: string;
  body?: Category[];
}

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  parentId: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const category = row.original;
      const parent = data.value?.body?.find(c => c.id === category.parentId);
      const isLastChild = (() => {
        if (!parent) return false;
        const children = data.value?.body?.filter(c => c.parentId === parent.id) || [];
        return children[children.length - 1].id === category.id;
      })();
      
      return h('div', { class: 'flex items-center' }, [
        h('span', null, [
          parent ? h('span', { class: 'mr-1' }, isLastChild ? '└─' : '├─') : null,
          category.name
        ]),
        parent ? h('span', { class: 'ml-2 text-sm text-muted-foreground' }, `(${parent.name})`) : null
      ]);
    }
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-right' }, ''),
    cell: ({ row }) => {
      const category = row.original;
      return h('div', { class: 'flex justify-end space-x-2' }, [
        h(DropdownMenu, null, [
          h(DropdownMenuTrigger, { asChild: true }, () =>
            h(Button, { variant: 'ghost', class: 'w-8 h-8 p-0' }, [
              h('span', { class: 'sr-only' }, 'Open menu'),
              h(MoreHorizontal, { class: 'w-4 h-4' })
            ])
          ),
          h(DropdownMenuContent, { align: 'end' }, [
            h(DropdownMenuLabel, null, 'Actions'),
            h(DropdownMenuItem, { onClick: () => editCategory(category) }, 'Edit'),
            h(DropdownMenuSeparator),
            h(DropdownMenuItem, { onClick: () => deleteCategory(category) }, 'Delete')
          ])
        ])
      ]);
    }
  }
];

const dialogOpen = ref(false);
const form = ref<CategoryFormData>({
  name: '',
  description: '',
  parentId: 'none',
});

const formErrors = ref<Partial<Record<keyof CategoryFormData, string>>>({});

// Use key for proper caching and data sharing
const { status, data, refresh, error } = useLazyFetch<ApiResponse>('/api/product-categories', {
  key: 'product-categories',
  transform: (response) => {
    // Transform response to ensure type safety
    return {
      status: response.status,
      message: response.message,
      body: response.body || []
    };
  }
});

const validateForm = () => {
  try {
    categoryFormSchema.parse(form.value);
    formErrors.value = {};
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      formErrors.value = error.formErrors.fieldErrors as Partial<Record<keyof CategoryFormData, string>>;
    }
    return false;
  }
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const submitData = {
      ...form.value,
      parentId: form.value.parentId === 'none' ? undefined : form.value.parentId
    };

    const { data: response } = await useFetch<ApiResponse>('/api/product-categories', {
      method: 'POST',
      body: submitData,
    });
    
    if (response.value?.status === 201) {
      form.value = {
        name: '',
        description: '',
        parentId: 'none',
      };
      formErrors.value = {};
      dialogOpen.value = false;
      refresh();
    }
  } catch (error) {
    console.error('Error adding category:', error);
  }
};

const editCategory = (category: Category) => {
  // TODO: Implement edit functionality
};

const deleteCategory = async (category: Category) => {
  // TODO: Implement delete functionality
};

// Add this computed property to sort categories
const sortedCategories = computed(() => {
  if (!data.value?.body) return [];
  
  const parents = data.value.body.filter(c => !c.parentId);
  const sorted: Category[] = [];
  
  // For each parent, add it and its children
  parents.forEach(parent => {
    sorted.push(parent);
    const children = data.value?.body?.filter(c => c.parentId === parent.id) || [];
    sorted.push(...children);
  });
  
  return sorted;
});
</script> 
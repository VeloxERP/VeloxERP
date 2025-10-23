<template>
  <div class="container mx-auto py-6 dark:text-white">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Permission Groups</h1>
      <Dialog v-model:open="dialogOpen">
        <DialogTrigger asChild>
          <Button>
            Add Role
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Permission Group</DialogTitle>
            <DialogDescription>
              Create a new permission group (role) for users.
            </DialogDescription>
          </DialogHeader>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label for="name">Role Name</Label>
              <Input id="name" v-model="form.name" placeholder="e.g., admin, manager, user" required />
              <p v-if="formErrors.name" class="text-sm text-red-500">{{ formErrors.name }}</p>
            </div>
            <div class="flex justify-end space-x-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" :disabled="status === 'pending'">
                Add Role
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <div class="rounded-md border">
      <DataTable
        :columns="columns"
        :data="roles"
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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuContent } from "~/components/ui/dropdown-menu";
import { MoreHorizontal, Users, Trash2 } from 'lucide-vue-next';
import type { ColumnDef } from '@tanstack/vue-table';
import DataTable from '~/components/ui/data-table.vue';
import { z } from 'zod';
import { useLazyFetch } from '#imports';

interface Role {
  name: string;
}

interface ApiResponse {
  status: number;
  message?: string;
  body?: Role[];
}

const roleFormSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(32, 'Role name must be less than 32 characters'),
});

type RoleFormData = z.infer<typeof roleFormSchema>;

const columns: ColumnDef<Role>[] = [
  {
    accessorKey: 'name',
    header: 'Role Name',
    cell: ({ row }) => {
      const role = row.original;
      return h('div', { class: 'flex items-center space-x-2' }, [
        h(Users, { class: 'w-4 h-4 text-muted-foreground' }),
        h('span', { class: 'font-medium' }, role.name)
      ]);
    }
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-right' }, ''),
    cell: ({ row }) => {
      const role = row.original;
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
            h(DropdownMenuSeparator),
            h(DropdownMenuItem, { onClick: () => deleteRole(role) }, [
              h(Trash2, { class: 'w-4 h-4 mr-2' }),
              'Delete'
            ])
          ])
        ])
      ]);
    }
  }
];

const dialogOpen = ref(false);
const form = ref<RoleFormData>({
  name: '',
});

const formErrors = ref<Partial<Record<keyof RoleFormData, string>>>({});

// Fetch roles
const { status, data, refresh, error } = useLazyFetch<ApiResponse>('/api/roles', {
  key: 'roles',
  transform: (response) => {
    return {
      status: response.status,
      message: response.message,
      body: response.body || []
    };
  }
});

const roles = computed(() => data.value?.body || []);

const validateForm = () => {
  try {
    roleFormSchema.parse(form.value);
    formErrors.value = {};
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      formErrors.value = error.formErrors.fieldErrors as Partial<Record<keyof RoleFormData, string>>;
    }
    return false;
  }
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const { data: response } = await useFetch<ApiResponse>('/api/roles', {
      method: 'POST',
      body: form.value,
    });
    
    if (response.value?.status === 201) {
      form.value = {
        name: '',
      };
      formErrors.value = {};
      dialogOpen.value = false;
      refresh();
    }
  } catch (error) {
    console.error('Error adding role:', error);
  }
};

const deleteRole = async (role: Role) => {
  // TODO: Implement delete functionality
  console.log('Delete role:', role);
};
</script> 
<template>
  <div class="container mx-auto py-6 dark:text-white">
    <div class="flex flex-col">
      <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Users Overview</h1>
          <div class="flex space-x-2">
            <Button variant="outline" @click="navigateToCreate">
              Create User
            </Button>
            <Dialog v-model:open="dialogOpen">
              <DialogTrigger asChild>
                <Button>
                  Quick Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add User</DialogTitle>
                  <DialogDescription>
                    Create a new user account.
                  </DialogDescription>
                </DialogHeader>
                <form @submit.prevent="handleSubmit" class="space-y-4">
                  <div class="space-y-2">
                    <Label for="username">Username</Label>
                    <Input id="username" v-model="form.username" required />
                    <p v-if="formErrors.username" class="text-sm text-red-500">{{ formErrors.username }}</p>
                  </div>
                  <div class="space-y-2">
                    <Label for="email">Email</Label>
                    <Input id="email" type="email" v-model="form.email" required />
                    <p v-if="formErrors.email" class="text-sm text-red-500">{{ formErrors.email }}</p>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <Label for="firstname">First Name</Label>
                      <Input id="firstname" v-model="form.firstname" required />
                      <p v-if="formErrors.firstname" class="text-sm text-red-500">{{ formErrors.firstname }}</p>
                    </div>
                    <div class="space-y-2">
                      <Label for="lastname">Last Name</Label>
                      <Input id="lastname" v-model="form.lastname" required />
                      <p v-if="formErrors.lastname" class="text-sm text-red-500">{{ formErrors.lastname }}</p>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <Label for="role">Role</Label>
                    <Select v-model="form.role">
                      <SelectTrigger>
                        <SelectValue :placeholder="form.role || 'Select a role'" />
                      </SelectTrigger>
                      <SelectContent>
                        <template v-for="role in roles" :key="role.name">
                          <SelectItem :value="role.name">
                            <span>{{ role.name }}</span>
                          </SelectItem>
                        </template>
                      </SelectContent>
                    </Select>
                    <p v-if="formErrors.role" class="text-sm text-red-500">{{ formErrors.role }}</p>
                  </div>
                  <div class="flex justify-end space-x-2">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" :disabled="status === 'pending'">
                      Add User
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
      </div>

      <div class="rounded-md border">
        <DataTable
            :columns="columns"
            :data="users"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuContent } from "~/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from 'lucide-vue-next';
import type { ColumnDef } from '@tanstack/vue-table';
import { DataTable } from '@components/ui/data-table';
import { z } from 'zod';
import { useLazyFetch } from '#imports';

interface User {
  id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
}

interface Role {
  name: string;
}

interface ApiResponse {
  status: number;
  message?: string;
  body?: User[];
}

interface RolesApiResponse {
  status: number;
  message?: string;
  body?: Role[];
}

const userFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(64, 'Username must be less than 64 characters'),
  email: z.string().email('Invalid email address'),
  firstname: z.string().max(64, 'First name must be less than 64 characters'),
  lastname: z.string().max(64, 'Last name must be less than 64 characters'),
  role: z.string().min(1, 'Role is required'),
});

type UserFormData = z.infer<typeof userFormSchema>;

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'username',
    header: 'Username',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'firstname',
    header: 'First Name',
  },
  {
    accessorKey: 'lastname',
    header: 'Last Name',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return date.toLocaleDateString();
    }
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-right' }, ''),
    cell: ({ row }) => {
      const user = row.original;
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
            h(DropdownMenuItem, { onClick: () => editUser(user) }, [
              h(Edit, { class: 'w-4 h-4 mr-2' }),
              'Edit'
            ]),
            h(DropdownMenuSeparator),
            h(DropdownMenuItem, { onClick: () => deleteUser(user) }, [
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
const form = ref<UserFormData>({
  username: '',
  email: '',
  firstname: '',
  lastname: '',
  role: '',
});

const formErrors = ref<Partial<Record<keyof UserFormData, string>>>({});

// Fetch users
const { status, data, refresh, error } = useLazyFetch<ApiResponse>('/api/users', {
  key: 'users',
  transform: (response) => {
    return {
      status: response.status,
      message: response.message,
      body: response.body || []
    };
  }
});

// Fetch roles
const { data: rolesData } = useLazyFetch<RolesApiResponse>('/api/roles', {
  key: 'roles',
  transform: (response) => {
    return {
      status: response.status,
      message: response.message,
      body: response.body || []
    };
  }
});

const users = computed(() => data.value?.body || []);
const roles = computed(() => rolesData.value?.body || []);

const validateForm = () => {
  try {
    userFormSchema.parse(form.value);
    formErrors.value = {};
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      formErrors.value = error.formErrors.fieldErrors as Partial<Record<keyof UserFormData, string>>;
    }
    return false;
  }
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const { data: response } = await useFetch<ApiResponse>('/api/user', {
      method: 'POST',
      body: form.value,
    });
    
    if (response.value?.status === 201) {
      form.value = {
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        role: '',
      };
      formErrors.value = {};
      dialogOpen.value = false;
      refresh();
    }
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

const editUser = (user: User) => {
  navigateTo(`/dashboard/administration/users/${user.id}/edit`);
};

const deleteUser = async (user: User) => {
  // TODO: Implement delete functionality
  console.log('Delete user:', user);
};

const navigateToCreate = () => {
  navigateTo('/dashboard/administration/users/create');
};
</script> 
<template>
  <div class="container mx-auto py-6 dark:text-white">
    <div class="flex items-center mb-6">
      <Button variant="outline" size="sm" @click="goBack" class="mr-4">
        ← Back
      </Button>
      <h1 class="text-2xl font-bold">Edit User</h1>
    </div>

    <div v-if="pending" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
    </div>

    <div v-else-if="error" class="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
      <p class="text-red-800 dark:text-red-200">Error loading user: {{ error }}</p>
    </div>

    <div v-else-if="user" class="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Update user details and permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
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

            <div class="space-y-2">
              <Label for="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" type="date" v-model="form.dateOfBirth" />
              <p v-if="formErrors.dateOfBirth" class="text-sm text-red-500">{{ formErrors.dateOfBirth }}</p>
            </div>

            <div class="flex justify-end space-x-2">
              <Button type="button" variant="outline" @click="goBack">
                Cancel
              </Button>
              <Button type="submit" :disabled="updateStatus === 'pending'">
                {{ updateStatus === 'pending' ? 'Updating...' : 'Update User' }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
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
  body?: User;
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
  dateOfBirth: z.string().optional(),
});

type UserFormData = z.infer<typeof userFormSchema>;

const route = useRoute();
const userId = route.params.id as string;

const form = ref<UserFormData>({
  username: '',
  email: '',
  firstname: '',
  lastname: '',
  role: '',
  dateOfBirth: '',
});

const formErrors = ref<Partial<Record<keyof UserFormData, string>>>({});

// Fetch user data
const { data: userData, pending, error } = useLazyFetch<ApiResponse>(`/api/users/${userId}`, {
  key: `user-${userId}`,
  transform: (response) => {
    return {
      status: response.status,
      message: response.message,
      body: response.body
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

// Update user
const { status: updateStatus } = useFetch<ApiResponse>(`/api/users/${userId}`, {
  method: 'PUT',
  immediate: false,
});

const user = computed(() => userData.value?.body);
const roles = computed(() => rolesData.value?.body || []);

// Populate form when user data is loaded
watch(user, (newUser) => {
  if (newUser) {
    form.value = {
      username: newUser.username,
      email: newUser.email,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      role: newUser.role,
      dateOfBirth: newUser.dateOfBirth ? newUser.dateOfBirth.split('T')[0] : '',
    };
  }
}, { immediate: true });

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
    const { data: response } = await useFetch<ApiResponse>(`/api/users/${userId}`, {
      method: 'PUT',
      body: form.value,
    });
    
    if (response.value?.status === 200) {
      // Show success message or redirect
      goBack();
    }
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

const goBack = () => {
  navigateTo('/dashboard/administration/users');
};
</script> 
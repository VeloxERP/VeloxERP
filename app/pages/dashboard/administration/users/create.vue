<template>
  <div class="container mx-auto py-6 dark:text-white">
    <div class="flex items-center mb-6">
      <Button variant="outline" size="sm" @click="goBack" class="mr-4">
        ← Back
      </Button>
      <h1 class="text-2xl font-bold">Create New User</h1>
    </div>

    <div>
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Create a new user account with the required information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="username">Username *</Label>
                <Input id="username" v-model="form.username" required />
                <p v-if="formErrors.username" class="text-sm text-red-500">{{ formErrors.username }}</p>
              </div>
              <div class="space-y-2">
                <Label for="email">Email *</Label>
                <Input id="email" type="email" v-model="form.email" required />
                <p v-if="formErrors.email" class="text-sm text-red-500">{{ formErrors.email }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="firstname">First Name *</Label>
                <Input id="firstname" v-model="form.firstname" required />
                <p v-if="formErrors.firstname" class="text-sm text-red-500">{{ formErrors.firstname }}</p>
              </div>
              <div class="space-y-2">
                <Label for="lastname">Last Name *</Label>
                <Input id="lastname" v-model="form.lastname" required />
                <p v-if="formErrors.lastname" class="text-sm text-red-500">{{ formErrors.lastname }}</p>
              </div>
            </div>

            <div class="space-y-2">
              <Label for="role">Role *</Label>
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

            <Separator />

            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 class="font-medium text-blue-900 dark:text-blue-100 mb-2">Account Creation Note</h3>
              <p class="text-sm text-blue-700 dark:text-blue-300">
                A secure password will be automatically generated and sent to the user's email address. 
                The user will be able to change their password upon first login.
              </p>
            </div>

            <div class="flex justify-end space-x-2">
              <Button type="button" variant="outline" @click="goBack">
                Cancel
              </Button>
              <Button type="submit" :disabled="status === 'pending'">
                {{ status === 'pending' ? 'Creating...' : 'Create User' }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Separator } from '~/components/ui/separator';
import { z } from 'zod';
import { useLazyFetch } from '#imports';

interface Role {
  name: string;
}

interface ApiResponse {
  status: number;
  message?: string;
  body?: { id: string };
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

const form = ref<UserFormData>({
  username: '',
  email: '',
  firstname: '',
  lastname: '',
  role: '',
  dateOfBirth: '',
});

const formErrors = ref<Partial<Record<keyof UserFormData, string>>>({});

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

// Create user
const { status } = useFetch<ApiResponse>('/api/user', {
  method: 'POST',
  immediate: false,
});

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
      // Show success message and redirect
      goBack();
    }
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

const goBack = () => {
  navigateTo('/dashboard/administration/users');
};
</script> 
<template>
  <div class="container mx-auto py-6 dark:text-white">
    <div class="mb-6">
      <h1 class="text-3xl font-bold">Administration Dashboard</h1>
      <p class="text-muted-foreground mt-2">Manage users, roles, and system settings</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Users Overview Card -->
      <Card class="hover:shadow-lg transition-shadow cursor-pointer" @click="navigateToUsers">
        <CardHeader>
          <div class="flex items-center space-x-2">
            <Users class="w-5 h-5 text-blue-600" />
            <CardTitle>Users Overview</CardTitle>
          </div>
          <CardDescription>
            View and manage all user accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold">{{ userCount }}</span>
            <span class="text-sm text-muted-foreground">Total Users</span>
          </div>
        </CardContent>
      </Card>

      <!-- Create User Card -->
      <Card class="hover:shadow-lg transition-shadow cursor-pointer" @click="navigateToCreateUser">
        <CardHeader>
          <div class="flex items-center space-x-2">
            <UserPlus class="w-5 h-5 text-green-600" />
            <CardTitle>Create User</CardTitle>
          </div>
          <CardDescription>
            Add new user accounts to the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            Create new user accounts with automatic password generation
          </p>
        </CardContent>
      </Card>

      <!-- Permission Groups Card -->
      <Card class="hover:shadow-lg transition-shadow cursor-pointer" @click="navigateToRoles">
        <CardHeader>
          <div class="flex items-center space-x-2">
            <Shield class="w-5 h-5 text-purple-600" />
            <CardTitle>Permission Groups</CardTitle>
          </div>
          <CardDescription>
            Manage user roles and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold">{{ roleCount }}</span>
            <span class="text-sm text-muted-foreground">Total Roles</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Activity Section -->
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
      <Card>
        <CardContent class="p-6">
          <div v-if="recentUsers.length === 0" class="text-center py-8 text-muted-foreground">
            <Users class="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recent user activity</p>
          </div>
          <div v-else class="space-y-4">
            <div v-for="user in recentUsers" :key="user.id" class="flex items-center justify-between p-3 rounded-lg border">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {{ user.firstname.charAt(0) }}{{ user.lastname.charAt(0) }}
                  </span>
                </div>
                <div>
                  <p class="font-medium">{{ user.firstname }} {{ user.lastname }}</p>
                  <p class="text-sm text-muted-foreground">{{ user.email }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium">{{ user.role }}</p>
                <p class="text-xs text-muted-foreground">{{ formatDate(user.createdAt) }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Users, UserPlus, Shield } from 'lucide-vue-next';
import { useLazyFetch } from '#imports';

interface User {
  id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  createdAt: string;
}

interface Role {
  name: string;
}

interface UsersApiResponse {
  status: number;
  message?: string;
  body?: User[];
}

interface RolesApiResponse {
  status: number;
  message?: string;
  body?: Role[];
}

// Fetch users
const { data: usersData } = useLazyFetch<UsersApiResponse>('/api/users', {
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

const users = computed(() => usersData.value?.body || []);
const roles = computed(() => rolesData.value?.body || []);

const userCount = computed(() => users.value.length);
const roleCount = computed(() => roles.value.length);

// Get recent users (last 5 created)
const recentUsers = computed(() => {
  return users.value
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const navigateToUsers = () => {
  navigateTo('/dashboard/administration/users');
};

const navigateToCreateUser = () => {
  navigateTo('/dashboard/administration/users/create');
};

const navigateToRoles = () => {
  navigateTo('/dashboard/administration/roles');
};
</script> 
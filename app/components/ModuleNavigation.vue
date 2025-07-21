<template>
  <nav class="space-y-2">
    <div v-for="item in navigationItems" :key="item.id" class="space-y-1">
      <NuxtLink
        :to="item.route"
        class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
        :class="[
          $route.path === item.route
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        ]"
      >
        <component
          v-if="item.icon"
          :is="getIconComponent(item.icon)"
          class="mr-3 h-4 w-4"
        />
        {{ item.label }}
      </NuxtLink>
      
      <!-- Sub-menu items -->
      <div v-if="item.children && item.children.length > 0" class="ml-6 space-y-1">
        <NuxtLink
          v-for="child in item.children"
          :key="child.id"
          :to="child.route"
          class="flex items-center px-3 py-2 text-sm rounded-md transition-colors"
          :class="[
            $route.path === child.route
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          ]"
        >
          <component
            v-if="child.icon"
            :is="getIconComponent(child.icon)"
            class="mr-3 h-4 w-4"
          />
          {{ child.label }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Calculator,
  Receipt,
  BookOpen,
  Package,
  Box,
  Clock,
  Home,
  Users,
  Settings
} from 'lucide-vue-next';

interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  children?: NavigationItem[];
  permission?: string;
  order?: number;
}

// Sample navigation items - in a real app this would come from the navigation store
const navigationItems = computed<NavigationItem[]>(() => [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'Home',
    route: '/',
    order: 1
  },
  {
    id: 'accounting-dashboard',
    label: 'Accounting',
    icon: 'Calculator',
    route: '/accounting',
    order: 10
  },
  {
    id: 'accounting-transactions',
    label: 'Transactions',
    icon: 'Receipt',
    route: '/accounting/transactions',
    order: 11
  },
  {
    id: 'accounting-chart-of-accounts',
    label: 'Chart of Accounts',
    icon: 'BookOpen',
    route: '/accounting/chart-of-accounts',
    order: 12
  },
  {
    id: 'inventory-dashboard',
    label: 'Inventory',
    icon: 'Package',
    route: '/inventory',
    order: 20
  },
  {
    id: 'inventory-products',
    label: 'Products',
    icon: 'Box',
    route: '/inventory/products',
    order: 21
  },
  {
    id: 'timetracking-dashboard',
    label: 'Time Tracking',
    icon: 'Clock',
    route: '/timetracking',
    order: 30
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'Users',
    route: '/users',
    order: 90
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    route: '/settings',
    order: 100
  }
]);

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    Home,
    Calculator,
    Receipt,
    BookOpen,
    Package,
    Box,
    Clock,
    Users,
    Settings
  };
  
  return iconMap[iconName] || Home;
};
</script> 
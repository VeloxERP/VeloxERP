<template>
  <div class="container mx-auto py-6 dark:text-white">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Inventory Dashboard</h1>
        <p class="text-muted-foreground">Warehouse and inventory management</p>
      </div>
      <div class="flex space-x-2">
        <Button @click="navigateTo('/inventory/products')">
          Manage Products
        </Button>
        <Button @click="navigateTo('/inventory/stock')">
          Stock Levels
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Products</CardTitle>
          <Package class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">1,234</div>
          <p class="text-xs text-muted-foreground">
            +12 new this month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Low Stock Items</CardTitle>
          <AlertTriangle class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">23</div>
          <p class="text-xs text-muted-foreground">
            Need reordering
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Value</CardTitle>
          <DollarSign class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">€89,456.78</div>
          <p class="text-xs text-muted-foreground">
            +5.2% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Warehouses</CardTitle>
          <Warehouse class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">3</div>
          <p class="text-xs text-muted-foreground">
            Active locations
          </p>
        </CardContent>
      </Card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Stock Movements</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="movement in stockMovements" :key="movement.id" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-2 h-2 rounded-full" :class="movement.type === 'in' ? 'bg-green-500' : 'bg-red-500'"></div>
                <div>
                  <p class="font-medium">{{ movement.product }}</p>
                  <p class="text-sm text-muted-foreground">{{ movement.warehouse }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-medium" :class="movement.type === 'in' ? 'text-green-600' : 'text-red-600'">
                  {{ movement.type === 'in' ? '+' : '-' }}{{ movement.quantity }}
                </p>
                <p class="text-sm text-muted-foreground">{{ movement.date }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Products by Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="product in topProducts" :key="product.id" class="flex items-center justify-between">
              <div>
                <p class="font-medium">{{ product.name }}</p>
                <p class="text-sm text-muted-foreground">SKU: {{ product.sku }}</p>
              </div>
              <div class="text-right">
                <p class="font-medium">€{{ product.value }}</p>
                <p class="text-sm text-muted-foreground">{{ product.quantity }} units</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Package, AlertTriangle, DollarSign, Warehouse } from 'lucide-vue-next';

// Sample data - in a real app this would come from the inventory store
const stockMovements = ref([
  {
    id: 1,
    product: 'Laptop Dell XPS 13',
    warehouse: 'Main Warehouse',
    quantity: 5,
    type: 'in',
    date: '2024-01-15'
  },
  {
    id: 2,
    product: 'Wireless Mouse',
    warehouse: 'Main Warehouse',
    quantity: 12,
    type: 'out',
    date: '2024-01-14'
  },
  {
    id: 3,
    product: 'USB-C Cable',
    warehouse: 'Secondary Warehouse',
    quantity: 50,
    type: 'in',
    date: '2024-01-13'
  },
  {
    id: 4,
    product: 'Monitor 27"',
    warehouse: 'Main Warehouse',
    quantity: 2,
    type: 'out',
    date: '2024-01-12'
  }
]);

const topProducts = ref([
  {
    id: 1,
    name: 'Laptop Dell XPS 13',
    sku: 'LAP-DELL-XPS13',
    value: '12,500.00',
    quantity: 15
  },
  {
    id: 2,
    name: 'Monitor 27" 4K',
    sku: 'MON-27-4K',
    value: '8,750.00',
    quantity: 8
  },
  {
    id: 3,
    name: 'Wireless Keyboard',
    sku: 'KB-WIRELESS',
    value: '3,200.00',
    quantity: 40
  },
  {
    id: 4,
    name: 'USB-C Hub',
    sku: 'HUB-USB-C',
    value: '2,100.00',
    quantity: 35
  }
]);
</script> 
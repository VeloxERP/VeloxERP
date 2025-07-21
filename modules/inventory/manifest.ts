export default {
  id: 'inventory',
  name: 'Inventory Management',
  version: '1.0.0',
  description: 'Warehouse and inventory management system',
  author: 'VeloxERP',
  routes: [
    {
      path: '/inventory',
      component: 'inventory/index',
      name: 'inventory-dashboard'
    },
    {
      path: '/inventory/products',
      component: 'inventory/products',
      name: 'inventory-products'
    },
    {
      path: '/inventory/stock',
      component: 'inventory/stock',
      name: 'inventory-stock'
    }
  ],
  navigation: [
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
      id: 'inventory-stock',
      label: 'Stock Levels',
      icon: 'BarChart3',
      route: '/inventory/stock',
      order: 22
    }
  ],
  apiRoutes: [
    {
      path: '/api/inventory/products',
      method: 'GET',
      handler: 'inventory/products'
    },
    {
      path: '/api/inventory/products',
      method: 'POST',
      handler: 'inventory/products'
    },
    {
      path: '/api/inventory/stock',
      method: 'GET',
      handler: 'inventory/stock'
    }
  ],
  stores: [
    {
      name: 'inventory',
      path: 'modules/inventory/stores/inventory'
    }
  ],
  components: [
    {
      name: 'ProductForm',
      path: 'modules/inventory/components/ProductForm',
      global: false
    },
    {
      name: 'StockLevel',
      path: 'modules/inventory/components/StockLevel',
      global: false
    }
  ],
  permissions: ['inventory.view', 'inventory.edit', 'inventory.delete']
}; 
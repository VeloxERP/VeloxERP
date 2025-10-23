export default {
  id: 'accounting',
  name: 'Accounting',
  version: '1.0.0',
  description: 'Financial accounting and bookkeeping module',
  author: 'VeloxERP',
  routes: [
    {
      path: '/accounting',
      component: 'accounting/index',
      name: 'accounting-dashboard'
    },
    {
      path: '/accounting/transactions',
      component: 'accounting/transactions',
      name: 'accounting-transactions'
    },
    {
      path: '/accounting/chart-of-accounts',
      component: 'accounting/chart-of-accounts',
      name: 'accounting-chart-of-accounts'
    }
  ],
  navigation: [
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
    }
  ],
  apiRoutes: [
    {
      path: '/api/accounting/transactions',
      method: 'GET',
      handler: 'accounting/transactions'
    },
    {
      path: '/api/accounting/transactions',
      method: 'POST',
      handler: 'accounting/transactions'
    },
    {
      path: '/api/accounting/accounts',
      method: 'GET',
      handler: 'accounting/accounts'
    }
  ],
  stores: [
    {
      name: 'accounting',
      path: 'modules/accounting/stores/accounting'
    }
  ],
  components: [
    {
      name: 'TransactionForm',
      path: 'modules/accounting/components/TransactionForm',
      global: false
    },
    {
      name: 'AccountSelector',
      path: 'modules/accounting/components/AccountSelector',
      global: false
    }
  ],
  permissions: ['accounting.view', 'accounting.edit', 'accounting.delete']
}; 
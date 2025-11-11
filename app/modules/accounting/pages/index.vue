<script setup lang="ts">
import { Button, Card, CardContent, CardHeader, CardTitle } from '#components'

import { Clock, DollarSign, Receipt, TrendingUp } from 'lucide-vue-next'

// Sample data - in a real app this would come from the accounting store
const recentTransactions = ref([
  {
    id: 1,
    description: 'Client Payment - Project Alpha',
    account: 'Accounts Receivable',
    amount: '5,000.00',
    type: 'income',
    date: '2024-01-15',
  },
  {
    id: 2,
    description: 'Office Supplies',
    account: 'Office Expenses',
    amount: '234.56',
    type: 'expense',
    date: '2024-01-14',
  },
  {
    id: 3,
    description: 'Software License',
    account: 'Technology Expenses',
    amount: '1,200.00',
    type: 'expense',
    date: '2024-01-13',
  },
  {
    id: 4,
    description: 'Consulting Fee',
    account: 'Professional Services',
    amount: '2,500.00',
    type: 'income',
    date: '2024-01-12',
  },
])

const accountBalances = ref([
  {
    id: 1,
    name: 'Cash',
    number: '1000',
    balance: '15,234.56',
    type: 'Asset',
  },
  {
    id: 2,
    name: 'Accounts Receivable',
    number: '1100',
    balance: '8,456.78',
    type: 'Asset',
  },
  {
    id: 3,
    name: 'Accounts Payable',
    number: '2000',
    balance: '3,234.56',
    type: 'Liability',
  },
  {
    id: 4,
    name: 'Retained Earnings',
    number: '3000',
    balance: '32,997.33',
    type: 'Equity',
  },
])
</script>

<template>
  <div class="container mx-auto py-6 dark:text-white">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">
          Accounting Dashboard
        </h1>
        <p class="text-muted-foreground">
          Financial overview and management
        </p>
      </div>
      <div class="flex space-x-2">
        <Button @click="navigateTo('/accounting/transactions')">
          View Transactions
        </Button>
        <Button @click="navigateTo('/accounting/chart-of-accounts')">
          Chart of Accounts
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            Total Revenue
          </CardTitle>
          <DollarSign class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            €45,231.89
          </div>
          <p class="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            Total Expenses
          </CardTitle>
          <Receipt class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            €12,234.56
          </div>
          <p class="text-xs text-muted-foreground">
            +10.5% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            Net Profit
          </CardTitle>
          <TrendingUp class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            €32,997.33
          </div>
          <p class="text-xs text-muted-foreground">
            +15.2% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            Pending Transactions
          </CardTitle>
          <Clock class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            23
          </div>
          <p class="text-xs text-muted-foreground">
            €8,456.78 total value
          </p>
        </CardContent>
      </Card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="transaction in recentTransactions" :key="transaction.id" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-2 h-2 rounded-full" :class="transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'" />
                <div>
                  <p class="font-medium">
                    {{ transaction.description }}
                  </p>
                  <p class="text-sm text-muted-foreground">
                    {{ transaction.account }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-medium" :class="transaction.type === 'income' ? 'text-green-600' : 'text-red-600'">
                  {{ transaction.type === 'income' ? '+' : '-' }}€{{ transaction.amount }}
                </p>
                <p class="text-sm text-muted-foreground">
                  {{ transaction.date }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="account in accountBalances" :key="account.id" class="flex items-center justify-between">
              <div>
                <p class="font-medium">
                  {{ account.name }}
                </p>
                <p class="text-sm text-muted-foreground">
                  {{ account.number }}
                </p>
              </div>
              <div class="text-right">
                <p class="font-medium">
                  €{{ account.balance }}
                </p>
                <p class="text-sm text-muted-foreground">
                  {{ account.type }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

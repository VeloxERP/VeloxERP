<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'sku', label: 'SKU' },
  { key: 'price', label: 'Price' },
  { key: 'cost', label: 'Cost' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'actions', label: 'Actions' },
]

const products = ref([])
const categories = ref([])
const loading = ref(false)
const showAddProductDialog = ref(false)

const form = ref({
  name: '',
  description: '',
  sku: '',
  categoryId: '',
  price: 0,
  cost: 0,
  quantity: 0,
})

async function fetchProducts() {
  loading.value = true
  try {
    const response = await fetch('/api/products')
    products.value = await response.json()
  }
  catch (error) {
    console.error('Error fetching products:', error)
  }
  finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    const response = await fetch('/api/product-categories')
    categories.value = await response.json()
  }
  catch (error) {
    console.error('Error fetching categories:', error)
  }
}

async function handleSubmit() {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    })

    if (response.ok) {
      showAddProductDialog.value = false
      form.value = {
        name: '',
        description: '',
        sku: '',
        categoryId: '',
        price: 0,
        cost: 0,
        quantity: 0,
      }
      await fetchProducts()
    }
  }
  catch (error) {
    console.error('Error adding product:', error)
  }
}

function editProduct(product) {
  // TODO: Implement edit functionality
}

async function deleteProduct(product) {
  // TODO: Implement delete functionality
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>

<template>
  <div class="container mx-auto py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">
        Products
      </h1>
      <Button @click="showAddProductDialog = true">
        Add Product
      </Button>
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead v-for="column in columns" :key="column.key">
              {{ column.label }}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="loading">
            <TableCell :colspan="columns.length" class="text-center py-4">
              Loading...
            </TableCell>
          </TableRow>
          <TableRow v-else-if="products.length === 0">
            <TableCell :colspan="columns.length" class="text-center py-4">
              No products found
            </TableCell>
          </TableRow>
          <TableRow v-for="product in products" :key="product.id">
            <TableCell>{{ product.name }}</TableCell>
            <TableCell>{{ product.sku }}</TableCell>
            <TableCell>{{ product.price }}</TableCell>
            <TableCell>{{ product.cost }}</TableCell>
            <TableCell>{{ product.quantity }}</TableCell>
            <TableCell>
              <div class="flex space-x-2">
                <Button variant="ghost" size="sm" @click="editProduct(product)">
                  Edit
                </Button>
                <Button variant="ghost" size="sm" @click="deleteProduct(product)">
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <Dialog v-model="showAddProductDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Add a new product to your inventory.
          </DialogDescription>
        </DialogHeader>
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <Label for="name">Name</Label>
            <Input id="name" v-model="form.name" required />
          </div>
          <div class="space-y-2">
            <Label for="description">Description</Label>
            <Textarea id="description" v-model="form.description" />
          </div>
          <div class="space-y-2">
            <Label for="sku">SKU</Label>
            <Input id="sku" v-model="form.sku" required />
          </div>
          <div class="space-y-2">
            <Label for="category">Category</Label>
            <Select v-model="form.categoryId">
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="price">Price</Label>
            <Input id="price" v-model="form.price" type="number" step="0.01" required />
          </div>
          <div class="space-y-2">
            <Label for="cost">Cost</Label>
            <Input id="cost" v-model="form.cost" type="number" step="0.01" />
          </div>
          <div class="space-y-2">
            <Label for="quantity">Quantity</Label>
            <Input id="quantity" v-model="form.quantity" type="number" required />
          </div>
          <div class="flex justify-end space-x-2">
            <Button type="button" variant="outline" @click="showAddProductDialog = false">
              Cancel
            </Button>
            <Button type="submit">
              Add Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

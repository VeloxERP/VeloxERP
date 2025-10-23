<script setup lang="ts">
import { ChevronsUpDown, Plus } from 'lucide-vue-next'

import { type Component, ref } from 'vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@components/ui/sidebar"

import {
  Clock,
  LayoutDashboard
} from 'lucide-vue-next';

const props = defineProps<{
  activeModule: 'velox-timetracking'
}>();

const { isMobile } = useSidebar()

//TODO: Get data over composable
const moduleLoader = useModuleLoader();
const loadedModules = Array.from(moduleLoader.activeModules.value.values());
const activeModule = ref(loadedModules.at(0));

</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
              size="lg"
              class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <!-- TODO: Richtiges Icon -->
              <component :is="Clock" class="size-4" />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">
                {{ activeModule?.manifest.name }}
              </span>
              <span class="truncate text-xs">PLAN??</span>
            </div>
            <ChevronsUpDown class="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
            class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            :side="isMobile ? 'bottom' : 'right'"
            :side-offset="4"
        >
          <DropdownMenuLabel class="text-xs text-muted-foreground">
            Module
          </DropdownMenuLabel>

          <NuxtLink to="/dashboard">
            <DropdownMenuItem class="cursor-pointer">
                <div class="flex size-6 items-center justify-center rounded-sm border">
                  <LayoutDashboard class="size-4 shrink-0"/>
                </div>
                Dashbaord
            </DropdownMenuItem>
          </NuxtLink>


          <DropdownMenuItem
              v-for="(mod, index) in loadedModules"
              :key="mod.id"
              class="gap-2 p-2"
              @click="activeModule = mod"
          >
            <div class="flex size-6 items-center justify-center rounded-sm border">
              <component :is="mod.icon" class="size-4 shrink-0" />
            </div>
            {{ mod.name }}
            <DropdownMenuShortcut>⌘{{ index + 1 }}</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>

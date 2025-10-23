<template>
    <Sidebar v-bind="props">
      <SidebarHeader>
        <LayoutSidebarNavModules/>
      </SidebarHeader>
      <SidebarContent>
        <LayoutSidebarNavMain/>
      </SidebarContent>
      <SidebarFooter>
        <LayoutSidebarNavUser/>
      </SidebarFooter>
    </Sidebar>
</template>

<script setup lang="ts">
import {
  Sidebar,
  type SidebarProps
} from "@components/ui/sidebar";

const props = withDefaults(defineProps<SidebarProps>(), {
  variant: 'inset',
})
</script>
<template>
  <div>
    <SidebarGroup>
      <SidebarGroupLabel>
        Administration
      </SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible>
          <SidebarMenuItem>
            <CollapsibleTrigger as-child>
              <SidebarMenuButton tooltip="Administration">
                <Boxes></Boxes>
                <span>Modules</span>
                <ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton as-child>
                    <span>Test</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>

        <Collapsible>
          <SidebarMenuItem>
            <CollapsibleTrigger as-child>
              <SidebarMenuButton tooltip="Benutzer">
                <User/>
                <span>Benutzer</span>
                <ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton as-child>

                    <NuxtLink :to="`/dashboard/administration/users`">
                      <span>Übersicht</span>
                    </NuxtLink>

                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>

        <Collapsible>
          <SidebarMenuItem>
            <CollapsibleTrigger as-child>
              <SidebarMenuButton tooltip="Administration">
                <Wrench/>
                <span>Einstellungen</span>
                <ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton as-child>
                    <span>Test</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>

        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  </div>
</template>

<script setup lang="ts">

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@components/ui/sidebar";
import {CollapsibleContent, CollapsibleTrigger} from "@components/ui/collapsible";
import {ChevronRight,Boxes,User,Wrench} from "lucide-vue-next";
</script>

<style scoped>

</style>
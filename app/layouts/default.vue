<script setup lang="ts">
//TODO why not look like https://www.shadcn-vue.com/blocks/sidebar.html#Sidebar08
import AppSidebar from '@/components/AppSidebar.vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
</script>
<template>


  <div id="app" class="relative min-h-svh flex flex-col bg-background">
    <SidebarProvider>
      <LayoutSidebar/>
      <SidebarInset>
        <main class="inner">
          <header class="flex h-16 shrink-0 items-center gap-2">
            <div class="flex items-center gap-2 px-4">
              <SidebarTrigger class="-ml-1 cursor-pointer" />
              <Separator orientation="vertical" class="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem class="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator class="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
            <NuxtPage/>
          </div>
        </main>


      </SidebarInset>
    </SidebarProvider>
  </div>


  <!--<SidebarProvider>
    
    <AppSidebar />
    
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1 dark:text-white" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
<!--        <div class="dark:text-white">-->
<!--          {{useRoute()}}-->
<!--        </div>-->
<!--
        <slot></slot>
        <!--        <div class="grid auto-rows-min gap-4 md:grid-cols-3">-->
        <!--          <div class="aspect-video rounded-xl bg-muted/50" />-->
        <!--          <div class="aspect-video rounded-xl bg-muted/50" />-->
        <!--          <div class="aspect-video rounded-xl bg-muted/50" />-->
        <!--        </div>-->
        <!--        <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />-->
      <!--</div>
    </SidebarInset>
  </SidebarProvider>-->
</template>
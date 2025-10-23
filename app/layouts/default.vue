<script setup lang="ts">
//TODO why not look like https://www.shadcn-vue.com/blocks/sidebar.html#Sidebar08
</script>
<template>
  <div>
    <SidebarProvider>
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
<!--        <div class="flex flex-1 flex-col gap-4 p-4 pt-0">-->
<!--          &lt;!&ndash;        <div class="dark:text-white">&ndash;&gt;-->
<!--          &lt;!&ndash;          {{useRoute()}}&ndash;&gt;-->
<!--          &lt;!&ndash;        </div>&ndash;&gt;-->

<!--          <slot></slot>-->
<!--          &lt;!&ndash;        <div class="grid auto-rows-min gap-4 md:grid-cols-3">&ndash;&gt;-->
<!--          &lt;!&ndash;          <div class="aspect-video rounded-xl bg-muted/50" />&ndash;&gt;-->
<!--          &lt;!&ndash;          <div class="aspect-video rounded-xl bg-muted/50" />&ndash;&gt;-->
<!--          &lt;!&ndash;          <div class="aspect-video rounded-xl bg-muted/50" />&ndash;&gt;-->
<!--          &lt;!&ndash;        </div>&ndash;&gt;-->
<!--          &lt;!&ndash;        <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />&ndash;&gt;-->
<!--        </div>-->
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>
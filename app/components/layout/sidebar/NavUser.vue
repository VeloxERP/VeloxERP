<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
              size="lg"
              class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage v-if="avatarSrc" :src="avatarSrc" :alt="displayName" />
              <AvatarFallback class="rounded-lg">
                {{ initials }}
              </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{{ displayName }}</span>
              <span class="truncate text-xs">{{ secondaryText }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
            class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            :side="isMobile ? 'bottom' : 'right'"
            align="end"
            :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage v-if="avatarSrc" :src="avatarSrc" :alt="displayName" />
                <AvatarFallback class="rounded-lg">
                  {{ initials }}
                </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ displayName }}</span>
                <span class="truncate text-xs">{{ secondaryText }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <BadgeCheck />
              {{t('navigation.user.user')}}
              Benutzer
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell />
              {{t('navigation.user.notifications')}}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Cog />
              {{t('navigation.user.settings')}}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="text-red-400 hover:text-red-500" @click="handleSignOut">
            <LogOut />
            {{t('navigation.user.logout')}}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>

<script setup lang="ts">
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  Cog
} from 'lucide-vue-next'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@components/ui/sidebar'

import { authClient } from "~/lib/auth-client";

const session = authClient.useSession();

const user = computed(() => session.value?.user ?? null);

const displayName = computed(() =>
  user.value?.name || user.value?.username || user.value?.email || "User"
);

const secondaryText = computed(() =>
  user.value?.email || user.value?.username || ""
);

const initials = computed(() => {
  const source = displayName.value.trim();
  return source ? source.charAt(0).toUpperCase() : "?";
});

const avatarSrc = computed(() => user.value?.image || undefined);

async function handleSignOut() {
  const { error } = await authClient.signOut();
  if (error) {
    console.error("Failed to sign out", error);
    return;
  }

  await navigateTo("/login");
}

const { isMobile } = useSidebar()
const { t } = useI18n()
</script>

<style scoped>

</style>
<script setup lang="ts">
import type {SidebarProps} from '@/components/ui/sidebar'
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader,} from '@/components/ui/sidebar'
import NavMain from '@/components/NavMain.vue'
import NavUser from '@/components/NavUser.vue'
import TeamSwitcher from '@/components/TeamSwitcher.vue'
import NavAdmin from "@/components/NavAdmin.vue";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,

  Users,
  Barcode,
  PackageSearch,
    BookUser
} from 'lucide-vue-next'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})
// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Adressen',
      url: '#',
      icon: BookUser,
      isActive: true,
      items: [
        {
          title: 'Kunden',
          url: '#'
        },
        {
          title: 'Lieferanten',
          url: '#'
        },
        {
          title: 'Hersteller',
          url: '#'
        },
        {
          title: 'Mitarbeiter',
          url: '#'
        }
      ]
    },
    {
      title: 'Produkte',
      url: '#',
      icon: Barcode,
      items: [
        {
          title: 'Eigenschaften',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Logistik',
      url: '#',
      icon: PackageSearch,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Administration',
      url: '#',
      icon: Users,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  adminRoutes: [
    {
      title: 'Users',
      url: '#',
      icon: Users,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
    {
      title: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      title: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
}
</script>
<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <TeamSwitcher :teams="data.teams"/>
    </SidebarHeader>
    <SidebarContent>
      <template v-for="item in useNavigation()">
        <component :is="item.type" v-bind="item" v-if="item.show == undefined || item.show()"/>
      </template>
<!--      <NavMain :items="data.navMain" name="Platform"/>-->
<!--      <NavMain :items="data.adminRoutes" name="Administration"/>-->
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user"/>
    </SidebarFooter>
    <!--    <SidebarRail />-->
  </Sidebar>
</template>

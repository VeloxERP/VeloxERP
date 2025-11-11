<template>
  <div>

    <div class="grid grid-cols-4 gap-4">
      <Item variant="outline" as-child>
        <NuxtLink to="/user/settings/authentification">
          <ItemMedia>
            <Fingerprint class="size-10" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Authentification</ItemTitle>
            <ItemDescription>
              Opens in a new tab with security attributes.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <ExternalLinkIcon class="size-4"/>
          </ItemActions>
        </NuxtLink>
      </Item>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ExternalLinkIcon, Fingerprint} from 'lucide-vue-next'
</script>

<style scoped>

</style>
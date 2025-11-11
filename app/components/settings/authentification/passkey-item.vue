<template>
  <Item variant="outline">
    <ItemMedia>
      <Avatar class="size-10">
        <KeyRound/>
      </Avatar>
    </ItemMedia>
    <ItemContent>
      <template v-if="editMode">
        <Input v-model="passkeyName"/>
      </template>
      <template v-else>
        <ItemTitle>{{ passkeyName }}</ItemTitle>
        <ItemDescription>Created seen 5 months ago</ItemDescription>
      </template>
    </ItemContent>
    <ItemActions>
      <Button
          size="icon-sm"
          variant="outline"
          class="rounded-full"
          aria-label="Invite"
          v-if="!editMode"
          @click="enableEdit"
      >
        <Pen/>
      </Button>

      <Button
          size="icon-sm"
          variant="outline"
          class="rounded-full"
          aria-label="Invite"
          v-if="editMode"
          @click="updatePasskey"
      >
        <Spinner v-if="loadEdit"/>
        <Check v-else/>
      </Button>

      <Button
          size="icon-sm"
          variant="destructive"
          class="rounded-full"
          aria-label="Invite"
          v-if="editMode"
          @click="deletePasskey"
      >
        <Trash/>
      </Button>
    </ItemActions>
  </Item>
</template>

<script setup lang="ts">
import {Check, KeyRound, Pen, Trash} from "lucide-vue-next";
import type {Passkey} from "better-auth/plugins/passkey";
import {authClient} from "~/lib/auth-client";
import {Spinner} from "@components/ui/spinner";

const loadEdit = ref(false);
const editMode = ref(false);
const passkeyName = ref("");
const props = defineProps<{
  passkey: Passkey
}>();

function enableEdit() {
  editMode.value = true;
}

async function deletePasskey() {
  await authClient.passkey.deletePasskey({
    id: props.passkey.id,
  });
}

async function updatePasskey() {
  if (loadEdit.value) return;
  loadEdit.value = true;

  const name = passkeyName.value.trim();
  if (props.passkey.name !== name) {
    await authClient.passkey.updatePasskey({
      id: props.passkey.id,
      name: passkeyName.value,
    })
        .then(() => {
          passkeyName.value = name;
          editMode.value = false;
          loadEdit.value = false;
        });
    return
  }

  editMode.value = false;
  loadEdit.value = false;
}

onMounted(() => {
  if (props.passkey.name) {
    passkeyName.value = props.passkey.name;
  }
})
</script>
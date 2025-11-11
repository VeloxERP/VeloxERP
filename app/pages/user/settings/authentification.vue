<template>
  <div class="grid grid-cols-2 gap-4">

    <section>
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsAuthentificationAccountDetails />
        </CardContent>
      </Card>
    </section>

    <section>
      <Card>
        <CardHeader>
          <CardTitle>Passkeys</CardTitle>
        </CardHeader>
        <CardContent>
          <Empty v-if="!passkeys || passkeys.length === 0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ShieldUser />
              </EmptyMedia>
              <EmptyTitle>No passkeys created</EmptyTitle>
              <EmptyDescription>
                Create a passkey to securely access your account.
              </EmptyDescription>
            </EmptyHeader>

            <EmptyContent>
              <Button variant="outline" size="sm" @click="addPasskey">
                Add passkey to account
              </Button>
            </EmptyContent>
          </Empty>


          <div class="space-y-4">

            <div v-if="passkeys" class="grid gap-4">
              <template v-for="passkey in passkeys" :key="passkey.id">
                <SettingsAuthentificationPasskeyItem :passkey="passkey"/>
              </template>
            </div>

          </div>
        </CardContent>

        <CardFooter class="flex justify-end" v-if="passkeys && passkeys.length < 5">
          <Button variant="outline" size="sm" @click="addPasskey">
            Add passkey to account
          </Button>
        </CardFooter>
      </Card>

    </section>
  </div>
</template>

<script setup lang="ts">
import {Pen, ShieldUser} from 'lucide-vue-next'
import {authClient} from "~/lib/auth-client";

const runtime = useRuntimeConfig();
const { data: passkeys, error } = await authClient.passkey.listUserPasskeys();

async function addPasskey() {
  const { data, error } = await authClient.passkey.addPasskey({
    name: runtime.public.appName,
  });
}
</script>

<style scoped>

</style>
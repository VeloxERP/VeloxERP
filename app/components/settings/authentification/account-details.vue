<template>
  <div>
    <FieldGroup>
      <FieldSet>
        <FieldLabel>Responses</FieldLabel>
        <FieldDescription>
          Get notified when ChatGPT responds to requests that take time, like
          research or image generation.
        </FieldDescription>

        <FieldGroup>
          <Field>
            <FieldLabel for="checkout-7j9-card-name-43j">
              Email
            </FieldLabel>
            <Input
                id="checkout-7j9-card-name-43j"
                placeholder="Evil Rabbit"
                :value="user?.email"
                disabled
            />
          </Field>
          <Field>
            <FieldLabel for="checkout-7j9-card-name-43j">
              Username
            </FieldLabel>
            <Input
                id="checkout-7j9-card-name-43j"
                placeholder="Evil Rabbit"
                :value="user?.name"
                disabled
            />
          </Field>
          <Field>
            <FieldLabel for="checkout-7j9-card-name-43j">
              Displayname
            </FieldLabel>
            <Input
                id="checkout-7j9-card-name-43j"
                placeholder="Evil Rabbit"
                :value="user?.displayUsername"
                disabled
            />
          </Field>
        </FieldGroup>
      </FieldSet>

        <FieldSeparator />

      <FieldSet>
        <FieldLabel>Your Data</FieldLabel>
        <FieldDescription>
          Manage your account settings and set e-mail preferences.
        </FieldDescription>
        <FieldGroup>
          <div class="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel for="checkout-7j9-card-name-43j">
                Name
              </FieldLabel>
              <Input
                  id="checkout-7j9-card-name-43j"
                  placeholder="Evil Rabbit"
                  :value="user?.name"
                  required
              />
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  </div>
</template>

<script setup lang="ts">
import {authClient} from "~/lib/auth-client";

const session = authClient.useSession();
const user = computed(() => session.value.data?.user ?? null)

</script>

<style scoped>

</style>
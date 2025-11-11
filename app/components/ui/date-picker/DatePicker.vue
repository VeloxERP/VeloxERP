<script setup lang="ts">
import { Popover } from '@components/ui/popover'
</script>

<template>
  <div>
    <input type="text">

    <Popover>
      <PopoverTrigger as-child>
        <FormControl>
          <Button
            variant="outline" :class="cn(
              'w-[240px] ps-3 text-start font-normal',
              !value && 'text-muted-foreground',
            )"
          >
            <span>{{ value ? df.format(toDate(value)) : "Pick a date" }}</span>
            <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
          </Button>
          <input hidden>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <Calendar
          v-model:placeholder="placeholder"
          :model-value="value"
          calendar-label="Date of birth"
          initial-focus
          :min-value="new CalendarDate(1900, 1, 1)"
          :max-value="today(getLocalTimeZone())"
          @update:model-value="(v) => {
            if (v) {
              setFieldValue('dob', v.toString())
            }
            else {
              setFieldValue('dob', undefined)
            }
          }"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>

<style scoped>

</style>

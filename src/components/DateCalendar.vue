<template>
  <div class="vue-calendar">
    <button
      v-for="slot in slots"
      :key="slot.id"
      class="calendar-slot"
      :class="{ selected: selectedIds.includes(slot.id), unavailable: slot.unavailable }"
      :disabled="slot.unavailable"
      @click="pickSlot(slot)"
    >
      <span class="slot-day">{{ slot.day }}</span>
      <span class="slot-date">{{ slot.date }}</span>
      <span class="slot-time">{{ slot.time }}</span>
      <strong>{{ slot.title }}</strong>
      <small>{{ slot.note }}</small>
      <em>{{ slot.status }}</em>
    </button>
  </div>
</template>

<script setup>
defineProps({
  slots: {
    type: Array,
    required: true,
  },
  selectedIds: {
    type: Array,
    default: () => [],
  },
  pickSlot: {
    type: Function,
    required: true,
  },
});
</script>

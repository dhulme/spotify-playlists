<script setup lang="ts">
withDefaults(defineProps<{ icon: string, color?: string }>(), {
  color: 'currentColor'
})
</script>

<template>
  <svg  width="20" height="17" :fill="color">
    <path :d="icon" />
  </svg>
</template>
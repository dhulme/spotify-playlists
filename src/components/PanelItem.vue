<script lang="ts" setup>
const props = defineProps<{
  borderLeft?: boolean;
  borderTop?: boolean;
  }>()
</script>


<template>
<div :class="['pane', { borderLeft, borderTop }]">
  <slot />
</div>
</template>

<style scoped>
.pane {
  height: 100%;
  position: relative;
  overflow: auto;
  padding: 0.5rem 1rem;
  border-right: 1px solid rgba(255,255,255,0.1);
  min-width: 20rem;
  max-width: 25rem;
}

.borderLeft {
  border-left: 1px solid rgba(255,255,255,0.1)
}

.borderTop {
  border-top: 1px solid rgba(255,255,255,0.1)
}

.pane::-webkit-scrollbar {
  width: 10px;
}

.pane::-webkit-scrollbar-track {
  background: transparent;
}

.pane::-webkit-scrollbar-thumb {
  background: transparent;
}

.pane:hover::-webkit-scrollbar-thumb {
  background: #4a4a4a;
}
</style>
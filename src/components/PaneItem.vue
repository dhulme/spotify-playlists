<template>
<div class="pane">
  <slot />
</div>
</template>

<style scoped>
.pane {
  height: 100%;
  position: relative;
  overflow: auto;
  padding: 0 1rem;
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
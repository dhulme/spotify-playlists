<template>
  <li>
    <slot />
  </li>
</template>

<style scoped>
li {
  margin: 0;
  padding: 0.3rem 0;
  cursor: default;
  list-style: none;
}
li:hover {
  background: #444;
}
li :global(em) {
  margin-left: 0.5rem;
}
</style>
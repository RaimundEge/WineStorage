<script setup>
import Display from './components/Display.vue'
</script>

<template>
  <header>
    <div class="nav-bar">
      <li class="banner">Temperature Readings in current Wine Storage</li>
    </div>
  </header>

  <main>
    <div class="content">
      <display></display>
    </div> 
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>

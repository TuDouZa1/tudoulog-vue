<script lang="ts" setup></script>

<template>
  <section class="not-found">
    <div class="not-found-content">
      <h1>404 NotFound</h1>
      <p>空空如也</p>
    </div>
  </section>
</template>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  color: var(--dark-gray);
  padding: var(--spacing-xl);
}

.not-found-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing);
}

.not-found h1 {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1;
  color: var(--dark-gray);
  text-align: center;
}

.not-found p {
  font-size: 1.5rem;
  color: var(--mid-gray);
  margin: 0;
}
</style>

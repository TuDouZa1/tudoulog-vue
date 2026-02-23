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
  text-align: center;
  color: var(--dark-gray);
}

.not-found-content {
  padding: 2rem;
}

.not-found h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
  color: var(--dark-gray);
  text-align: center;
}

.not-found p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: var(--mid-gray);
}
</style>

<script lang="ts" setup>
const baseUrl = import.meta.env.BASE_URL
</script>

<template>
  <div class="home">
    <section class="hero">
      <transition-group appear class="hero-content" name="list" tag="div">
        <h1 key="1">土豆仔</h1>
        <p key="2">这是一个纯静态个人博客</p>
        <img key="3" :src="`${baseUrl}img/tudouzai.jpeg`" alt="土豆仔" />
      </transition-group>
    </section>
  </div>
</template>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--dark-gray);
}

.list-enter-active:nth-child(1) {
  transition-delay: 0s;
}

.list-enter-active:nth-child(2) {
  transition-delay: 0.1s;
}

.list-enter-active:nth-child(3) {
  transition-delay: 0.2s;
}

.hero-content {
  padding: 2rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
  color: var(--dark-gray);
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: var(--mid-gray);
}

.hero img {
  margin-top: 1.5rem;
  width: 400px;
  border-radius: 12px;
  box-shadow:
    0 4px 8px 0 rgba(0, 0, 0, 0.2),
    0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

@media screen and (max-width: 600px) {
  .hero img {
    width: 300px;
  }
}
</style>

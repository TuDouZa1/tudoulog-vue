<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1>土豆仔</h1>
        <p>这是一个纯静态个人博客</p>
        <img src="../assets/img/tudouzai.jpeg">
      </div>
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
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>

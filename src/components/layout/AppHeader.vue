<script lang="ts" setup>

</script>

<template>
  <div class="header-component">
    <div class="header">
      <div class="nav">
        <router-link class="nav-item" exact-active-class="nav-item-active" to="/">
          首页
        </router-link>
        <router-link active-class="nav-item-active" class="nav-item" to="/article">
          文章
        </router-link>
        <router-link active-class="nav-item-active" class="nav-item" to="/about">
          关于
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-component {
  //position: fixed;
  //top: 0;
  //left: 50%;
  //transform: translateX(-50%);
  //z-index: 100;
}

.header {
  padding: 0.5rem;
  background: var(--off-white);
  backdrop-filter: blur(20px);
  margin: 0.5rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-evenly;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: var(--border);
}

.nav {
  display: flex;
  justify-content: space-evenly;
  gap: 10px;
}

.nav-item {
  background: var(--white);
  color: var(--dark-gray);
  text-decoration: none;
  border: none;
  padding: 0.25rem 1rem;
  text-align: center;
  border-radius: 8px;
  transition: var(--transition);
}

.nav-item:hover {
  cursor: pointer;
  background: color-mix(in oklch, var(--teal) 80%, white);
  color: #fff;
  font-weight: bold;
}

.nav-item-active {
  background: var(--teal) !important;
  color: #fff !important;
  box-shadow: var(--teal-shadow);
  font-weight: bold;
}
</style>

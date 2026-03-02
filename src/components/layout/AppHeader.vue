<script lang="ts" setup></script>

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
  width: 100%;
  display: flex;
  justify-content: center;
  padding: var(--spacing-sm);
}

.header {
  padding: var(--spacing-sm);
  background: var(--off-white);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius);
  display: flex;
  justify-content: center;
  box-shadow: var(--shadow);
  border: var(--border);
}

.nav {
  display: flex;
  justify-content: space-evenly;
  gap: var(--spacing-sm);
}

.nav-item {
  background: var(--white);
  color: var(--dark-gray);
  text-decoration: none;
  border: none;
  padding: 0.25rem 1rem;
  text-align: center;
  border-radius: var(--border-radius-sm);
  transition: var(--transition);
}

.nav-item:hover {
  cursor: pointer;
  background: color-mix(in oklch, var(--main) 80%, white);
  color: #fff;
  font-weight: bold;
}

.nav-item:focus-visible {
  outline: 2px solid var(--main);
  outline-offset: 2px;
}

.nav-item-active {
  background: var(--main) !important;
  color: #fff !important;
  box-shadow: var(--shadow-main);
  font-weight: bold;
}
</style>

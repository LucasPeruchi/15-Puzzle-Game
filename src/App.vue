<script setup lang="ts">
import { useHead } from '@vueuse/head'

useHead({
  title: '15 Puzzle Game',
  meta: [
    { name: 'description', content: '15 Puzzle Game' },
  ],
})
</script>

<template>
  <router-view />
</template>

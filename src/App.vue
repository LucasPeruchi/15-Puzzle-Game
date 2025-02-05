<script setup lang="ts">
import { useHead } from '@vueuse/head'

useHead({
  title: 'Teermo',
  meta: [
    { name: 'description', content: 'Teermo' },
  ],
})
</script>

<template>
  <router-view />
</template>

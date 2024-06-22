<template>
  <h1 class="font-bold text-3xl pb-4">My Vike app</h1>

  This page is:
  <ul>
    <li>Rendered to HTML.</li>
    <li>Interactive. <Counter /></li>
  </ul>

  <button @click="setB()">setB</button>

  alert? {{  $alert?.success }}

  error? {{  $alert?.error }}
</template>

<script lang="ts" setup>
import Counter from "../../components/Counter.vue";
import { onMounted } from 'vue';
import { useAlertStore } from '@/store/alert'
import { storeToRefs } from 'pinia'
// import { useAclStore } from '@/store/acl'

// const $acl = useAclStore();
// const currentUser = $acl.currentUser

const $alert = useAlertStore();

const setB = () => {
  $alert.setError('BBB');
}

onMounted(() => {
  $alert.setSuccess('elo!');
})
</script>

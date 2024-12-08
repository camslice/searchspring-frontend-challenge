<template>
  <div class="text-center p-10">
    <form name="search" @submit.prevent="getProducts()" class="mx-auto">
      <input v-model="keyword" type="search" class="input input-bordered" />
      <button type="submit" class="btn btn-primary">Search</button>
    </form>
  </div>
</template>

<script setup>
import { ref, watchEffect, computed } from 'vue';
import axios from 'axios';

const API_URL = 'http://api.searchspring.net/api/search/search.json';
const SITE_ID = 'scmq7n';
const PER_PAGE = 8;
let page = 1;

const loading = ref(true);
const keyword = ref('');

async function getProducts() {
  const params = {
    siteId: SITE_ID,
    resultsFormat: 'native',
    q: keyword.value,
    page: page,
    // limit: PER_PAGE,
  };
  try {
    loading.value = true;
    const { data } = await axios.get(API_URL, { params });
    console.log(data);
    const { breadcrumbs, facets, filterSummary, merchandising, pagination, resultLayout, results, sorting } = data;
    page = pagination.nextPage;
    loading.value = false;
  } catch (error) {
    console.warn(error.response || error);
  } finally {
    loading.value = false;
  }
}
</script>

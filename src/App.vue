<template>
  <div class="text-center bg-base-100 fixed top-0 w-full py-2 z-10">
    <div class="max-w-7xl px-4 mx-auto navbar">
      <div class="flex-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
      </div>
      <form name="search" @submit.prevent="getProducts()" class="flex mr-8">
        <div class="form-control">
          <input v-model="keyword" type="search" class="input input-bordered mr-2" />
        </div>
        <button type="submit" class="btn btn-neutral btn-square">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
      </form>
      <div class="indicator">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span class="badge badge-primary badge-sm indicator-item">{{ cartTotal }}</span>
      </div>
    </div>
  </div>
  <div class="text-center mt-20 p-4">
    <div class="max-w-7xl mx-auto flex flex-wrap -mx-4">
      <div v-for="({ thumbnailImageUrl, name, price, msrp = 0 }) in items" class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
        <div class="card bg-white h-full">
          <figure class="loader">
            <div class="responsive-9x16 relative w-full bg-cover bg-center bg-no-repeat conceal">
              <img v-if="!thumbnailErrors.includes(thumbnailImageUrl)" :src="thumbnailImageUrl" :alt="name" @load="({ target }) => imgLoadedBg(target)" @error="({ target }) => handleThumbnailError(target, thumbnailImageUrl)" class="sr-only" />
              <span v-else class="center absolute text-neutral/50">No image</span>
            </div>
          </figure>
          <div class="card-body flex-col items-center p-4">
            <h2 class="card-title text-lg font-medium text-primary-content mb-2 leading-6">{{ name }}</h2>
            <div class="card-actions mt-auto justify-between w-full">
              <div>
                <div v-if="msrp > price" class="line-through text-neutral/50 mr-1 text-sm">{{ formatCurrency({ amount: msrp }) }}</div>
                <div class="text-primary font-medium">{{ formatCurrency({ amount: price }) }}</div>
              </div>
              <button class="btn btn-neutral">Add to cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, computed } from 'vue';
import axios from 'axios';
import { imgLoadedBg, formatCurrency } from '@/utils.js';

const API_URL = 'http://api.searchspring.net/api/search/search.json';
const SITE_ID = 'scmq7n';
const PER_PAGE = 8;
let page = 1;

const loading = ref(true);
const keyword = ref('');
const items = ref([]);
const cartTotal = ref(0);
const thumbnailErrors = ref([]);

function handleThumbnailError(target, url) {
  imgLoadedBg(target);
  thumbnailErrors.value.push(url);
}

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
    const { breadcrumbs, facets, filterSummary, merchandising, pagination, resultLayout, results, sorting } = data;
    page = pagination.nextPage;
    items.value = [
      ...items.value,
      ...results,
    ];
  } catch (error) {
    console.warn(error.response || error);
  } finally {
    loading.value = false;
  }
}

getProducts();
</script>

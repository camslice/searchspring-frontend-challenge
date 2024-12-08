<template>
  <div class="fixed top-0 z-10 w-full border-b bg-base-100 text-center">
    <div class="navbar mx-auto max-w-7xl px-4">
      <div class="flex-1">
        <svg class="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
      </div>
      <form class="mr-8 flex" name="search" @submit.prevent="getProducts()">
        <div class="form-control relative mr-2">
          <input class="input input-bordered pr-12" v-model="keyword" type="search" />
          <button class="btn btn-square btn-ghost absolute inset-y-0 right-0" v-if="keyword" @click="getProducts({ clear: true })" type="button">
            <svg class="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <button class="btn btn-square btn-neutral" type="submit">
          <span class="loading loading-spinner" v-if="keyword && loading"></span>
          <svg class="size-6" v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
      </form>
      <div class="indicator">
        <svg class="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span class="badge indicator-item badge-primary badge-sm">{{ cartTotal }}</span>
      </div>
    </div>
  </div>
  <div class="mt-16 p-4 text-center">
    <div class="relative mx-auto max-w-7xl">
      <div class="center-x absolute bottom-0 top-0 z-10 w-full bg-white bg-opacity-80 pt-28" v-if="loading">
        <div class="loading loading-infinity loading-lg text-primary"></div>
        <div>Loading products</div>
      </div>
      <div class="flex flex-wrap" v-if="resultsData.length">
        <Pagination v-bind="paginationData" :keyword="keyword" @change-page="changePage" />
        <div class="w-full p-4 sm:w-1/2 md:w-1/3 lg:w-1/4" v-for="{ id, thumbnailImageUrl, name, price, msrp = 0 } in resultsData" :key="id">
          <div class="card h-full border bg-base-100">
            <figure class="loader border-b">
              <div class="responsive-9x16 conceal relative w-full bg-cover bg-center bg-no-repeat">
                <img class="sr-only" v-if="!thumbnailErrors.includes(thumbnailImageUrl)" :src="thumbnailImageUrl" :alt="name" @load="({ target }) => imgLoadedBg(target)" @error="({ target }) => handleThumbnailError(target, thumbnailImageUrl)" />
                <span class="center absolute text-neutral/50" v-else>No image</span>
              </div>
            </figure>
            <div class="card-body flex-col items-center p-4">
              <h2 class="card-title mb-2 text-lg font-medium leading-6 text-base-content">{{ name }}</h2>
              <div class="card-actions mt-auto w-full items-center justify-between">
                <div>
                  <div class="mr-1 text-neutral/50 line-through" v-if="msrp > price">{{ formatCurrency({ amount: msrp }) }}</div>
                  <div class="text-lg font-medium text-primary">{{ formatCurrency({ amount: price }) }}</div>
                </div>
                <button class="btn btn-neutral">Add to cart</button>
              </div>
            </div>
          </div>
        </div>
        <Pagination v-bind="paginationData" :keyword="keyword" @change-page="changePage" />
      </div>
      <div class="w-full" v-else-if="!loading">
        <svg class="mx-auto my-4 size-12" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 32 32">
          <path fill="currentColor" d="M17.5 13c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5zm-9 0c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5z" />
          <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10">
            <g stroke="currentColor">
              <path d="m23.4 23.4-2.2-2.2M30 27l-3.6-3.4a2 2 0 0 0-2.8 0 2 2 0 0 0 0 2.8L27 30a2 2 0 0 0 2.8 0 2 2 0 0 0 0-2.8z" />
              <circle cx="13" cy="13" r="11.5" />
              <path d="M12 15.5c0-.5.5-1 1-1s1 .5 1 1m3.5-2.5c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5zm-9 0c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5z" />
            </g>
            <g stroke="currentColor">
              <path d="m23.4 23.4-2.2-2.2M30 27l-3.6-3.4a2 2 0 0 0-2.8 0 2 2 0 0 0 0 2.8L27 30a2 2 0 0 0 2.8 0 2 2 0 0 0 0-2.8z" />
              <circle cx="13" cy="13" r="11.5" />
              <path d="M12 15.5c0-.5.5-1 1-1s1 .5 1 1m3.5-2.5c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5zm-9 0c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5z" />
            </g>
          </g>
        </svg>
        <div>No results</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, computed, reactive } from 'vue';
import axios from 'axios';
import { imgLoadedBg, formatCurrency } from '@/utils.js';
import Pagination from '@/components/pagination.vue';

const API_URL = 'http://api.searchspring.net/api/search/search.json';
const SITE_ID = 'scmq7n';
const PAGE_DEFAULT = 1;
const KEYWORD_DEFAULT = '';

const loading = ref(true);
const cartTotal = ref(0);
const thumbnailErrors = ref([]);

const keyword = ref(KEYWORD_DEFAULT);
const page = ref(PAGE_DEFAULT);
const paginationData = ref(null);
const resultsData = ref([]);

function handleThumbnailError(target, url) {
  imgLoadedBg(target);
  thumbnailErrors.value.push(url);
}

function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlKeyword = urlParams.get('q');
  if (urlKeyword) {
    keyword.value = urlKeyword;
  }
  const urlPage = urlParams.get('page');
  if (urlPage) {
    page.value = Number(urlPage);
  }
}

async function getProducts({ clear = false } = {}) {
  const urlParams = new URLSearchParams(window.location.search);
  if (clear) {
    keyword.value = KEYWORD_DEFAULT;
    page.value = PAGE_DEFAULT;
    urlParams.delete('q');
    urlParams.delete('page');
  } else {
    if (keyword.value) {
      urlParams.set('q', keyword.value);
    }
    if (page.value) {
      urlParams.set('page', page.value);
    }
  }
  history.replaceState(null, '', urlParams.size ? `?${urlParams.toString()}` : '/');

  const params = {
    siteId: SITE_ID,
    resultsFormat: 'native',
    ...(!clear && {
      q: keyword.value,
      page: page.value,
    }),
  };
  try {
    loading.value = true;
    const { data } = await axios.get(API_URL, { params });
    const { breadcrumbs, facets, filterSummary, merchandising, pagination, resultLayout, results, sorting } = data;
    page.value = pagination.currentPage;
    paginationData.value = pagination;
    resultsData.value = results;
  } catch (error) {
    console.warn(error.response || error);
  } finally {
    loading.value = false;
  }
}

function changePage(newPage) {
  page.value = newPage;
  getProducts();
}

getUrlParams();
getProducts();
</script>

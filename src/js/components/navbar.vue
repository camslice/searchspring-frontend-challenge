<template>
  <nav class="navbar mx-auto max-w-7xl px-4">
    <div class="mr-4 flex-1">
      <div class="group -my-3 flex h-16 cursor-cell items-center bg-primary px-4 text-white">
        <svg class="mb-2.5 size-10 group-hover:animate-ping" xmlns="http://www.w3.org/2000/svg" fill="currentColor" xml:space="preserve" viewBox="0 0 88 88" stroke-width="1.5" stroke="currentColor">
          <path
            d="M44 70.6a8 8 0 0 1-8.1-8.1c0-.9.7-1.6 1.6-1.6s1.6.7 1.6 1.6a5 5 0 0 0 5 5 5 5 0 0 0 5-5c0-.9.7-1.6 1.6-1.6.9 0 1.6.7 1.6 1.6a8.4 8.4 0 0 1-8.3 8.1zM37.4 54c-.9 0-1.6-.7-1.6-1.6a5 5 0 0 0-5-5 5 5 0 0 0-5 5c0 .9-.7 1.6-1.6 1.6s-1.6-.7-1.6-1.6c0-4.5 3.6-8.1 8.1-8.1s8.1 3.6 8.1 8.1c.2.9-.5 1.6-1.4 1.6zm26.4-.7c-.9 0-1.6-.7-1.6-1.6a5 5 0 0 0-5-5 5 5 0 0 0-5 5c0 .9-.7 1.6-1.6 1.6s-1.6-.6-1.6-1.5c0-4.5 3.6-8.1 8.1-8.1s8.1 3.6 8.1 8.1c.1.9-.6 1.5-1.4 1.5zM69.2 87c4.3 0 7.8-3.5 7.8-7.8V63.9a8.2 8.2 0 0 0 0-16V32.5c0-4.3-3.5-7.8-7.8-7.8H52a8.1 8.1 0 0 0-6.4-6.4v-7.2a5.2 5.2 0 0 0 3.6-4.9C49.2 3.4 46.8 1 44 1s-5.2 2.3-5.2 5.2a5 5 0 0 0 3.6 4.9v7.2a8.1 8.1 0 0 0-6.4 6.4H18.8a7.8 7.8 0 0 0-7.8 7.8v15.3a8.2 8.2 0 0 0 0 16v15.3c0 4.3 3.5 7.8 7.8 7.8M41.9 6.2c0-1.1.9-2.1 2.1-2.1 1.1 0 2.1.9 2.1 2.1 0 1.1-.9 2.1-2.1 2.1-1.1 0-2.1-1-2.1-2.1zM44 21.3c2.2 0 4.1 1.5 4.8 3.5h-9.6a5 5 0 0 1 4.8-3.5zM7.5 55.8a5 5 0 0 1 3.6-4.8v9.6a5 5 0 0 1-3.6-4.8zm11.3 28.1a4.7 4.7 0 0 1-4.7-4.7V32.5c0-2.6 2.1-4.7 4.7-4.7h50.3c2.6 0 4.7 2.1 4.7 4.7v46.6c0 2.6-2.1 4.7-4.7 4.7M77 60.7V51a5 5 0 0 1 3.6 4.8 5.4 5.4 0 0 1-3.6 4.9z"
          />
        </svg>
        <div class="hidden md:block">
          <div class="ml-4 font-mono uppercase tracking-widest">Multi Threads</div>
          <div class="hidden text-sm group-hover:block">Robot Fashion</div>
        </div>
      </div>
    </div>
    <form class="mr-6 flex" name="search" @submit.prevent="$emit('getProducts')">
      <div class="form-control relative mr-2">
        <input class="input input-bordered input-primary w-48 pr-12 sm:w-auto" v-model="model" type="search" placeholder="Find your thread..." />
        <button class="btn btn-square btn-ghost absolute inset-y-0 right-0" v-if="model" @click="$emit('getProducts', { clear: true })" type="button">
          <svg class="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="bg-base-100">
        <button class="btn btn-square btn-neutral" type="submit" :class="{ 'btn-disabled': !model }">
          <span class="loading loading-spinner" v-if="model && loading"></span>
          <svg class="size-6" v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
      </div>
    </form>
    <button class="btn btn-square btn-ghost">
      <div class="indicator">
        <svg class="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span class="badge indicator-item badge-primary badge-sm">{{ cart.total }}</span>
      </div>
    </button>
  </nav>
</template>

<script setup>
import { useCartStore } from '@/stores/cart.js';
const model = defineModel();
const { loading } = defineProps({ loading: Boolean });
const cart = useCartStore();
</script>

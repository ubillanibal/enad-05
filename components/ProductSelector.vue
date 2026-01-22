<script setup>
import { ref, onMounted, computed } from "vue";
import { getBrands, getCategories, getProducts, getTags } from "../src/apis";

const brands = ref([]);
const categories = ref([]);
const tags = ref([]);

const selectedBrand = ref(null);
const selectedCategory = ref(null);
const selectedTag = ref(null);

const products = ref([]);

const loadingMeta = ref(true);
const loadingProducts = ref(false);
const error = ref(null);
const hasLoaded = ref(false);
const message = ref("");

onMounted(async () => {
  try {
    brands.value = await getBrands();
    categories.value = await getCategories();
    tags.value = await getTags();
  } catch (err) {
    error.value = err.message;
  } finally {
    loadingMeta.value = false;
  }
});

const fetchProducts = async () => {
  try {
    loadingProducts.value = true;
    error.value = null;

    products.value = await getProducts({
      brandId: selectedBrand.value,
      categoryId: selectedCategory.value,
      tagId: selectedTag.value,
    });
  } catch (err) {
    error.value = err.message;
  } finally {
    loadingProducts.value = false;
    hasLoaded.value = true;
  }
};

const canLoad = computed(
  () => selectedBrand.value || selectedCategory.value || selectedTag.value,
);

const copyProductIds = async () => {
  if (!products.value.length) return;

  const ids = products.value.map((p) => p.id).join(", ");
  await navigator.clipboard.writeText(ids);
  message.value = "Product IDs copied to clipboard!";
  setTimeout(() => (message.value = ""), 2000);
};
</script>

<template>
  <div class="controls">
    <select v-model="selectedBrand">
      <option :value="null">All Brands</option>
      <option v-for="b in brands" :key="b.id" :value="b.id">
        {{ b.name }}
      </option>
    </select>

    <select v-model="selectedCategory">
      <option :value="null">All Categories</option>
      <option v-for="c in categories" :key="c.id" :value="c.id">
        {{ c.name }}
      </option>
    </select>

    <select v-model="selectedTag">
      <option :value="null">All Tags</option>
      <option v-for="t in tags" :key="t.id" :value="t.id">
        {{ t.name }}
      </option>
    </select>

    <button @click="fetchProducts" :disabled="!canLoad || loadingProducts">
      Load products
    </button>

    <button @click="copyProductIds" :disabled="!products.length">
      Copy product IDs
    </button>
  </div>

  <div v-if="loadingProducts">Loading products…</div>

  <div v-else-if="hasLoaded && products.length === 0">No products found</div>

  <div v-if="message" class="message">{{ message }}</div>

  <div v-else class="grid-container">
    <div v-for="product in products" :key="product.id" class="card">
      <p><strong>ID: </strong>{{ product.id }}</p>

      <p>
        <strong>Brand:</strong>
        {{ product.brand?.name || "—" }}
      </p>

      <p>
        <strong>Categories: </strong>
        <span v-if="product.categories?.length">
          <span v-for="(cat, index) in product.categories" :key="cat.id">
            {{ cat.name
            }}<span v-if="index < product.categories.length - 1">, </span>
          </span>
        </span>
        <span v-else>—</span>
      </p>

      <p>
        <strong>Tags: </strong>
        <span v-if="product.tags?.length">
          <span v-for="(tag, index) in product.tags" :key="tag.id">
            {{ tag.name }}<span v-if="index < product.tags.length - 1">, </span>
          </span>
        </span>
        <span v-else>—</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  max-width: 300px;
  margin: 2rem auto;
}

.controls select,
.controls button {
  width: 100%;
  padding: 0.5rem;
}

.card {
  border: 1px solid #ddd;
  padding: 0.75rem;
  font-size: 0.85rem;
  line-height: 1.4;
}

.message {
  margin: 1rem auto;
  padding: 0.5rem;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 0.25rem;
  text-align: center;
  max-width: 300px;
}
</style>

import { apiGet } from "./http";

function sortByName(a, b) {
  const nameA = a.name ?? "";
  const nameB = b.name ?? "";

  return nameA.localeCompare(nameB, undefined, {
    sensitivity: "base",
  });
}

export async function getBrands() {
  const { data } = await apiGet("/brands");
  return data.brands.sort(sortByName);
}

export async function getCategories() {
  const { data } = await apiGet("/categories");
  return data.sort(sortByName);
}

export async function getTags() {
  const { data } = await apiGet("/tags");
  return data.sort(sortByName);
}

export async function getProducts({
  brandId = null,
  categoryId = null,
  tagId = null,
} = {}) {
  const { data } = await apiGet("/products");

  const filtered = data.filter((product) => {
    // Brand
    if (brandId && product.brand?.id !== brandId) {
      return false;
    }

    // Category
    if (categoryId && !product.categories?.some((c) => c.id === categoryId)) {
      return false;
    }

    // Tag
    if (tagId && !product.tags?.some((t) => t.id === tagId)) {
      return false;
    }

    return true;
  });

  return filtered.sort(sortByName);
}

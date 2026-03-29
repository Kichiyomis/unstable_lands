<template>
  <article class="wiki-page goods-page">
    <h1 class="wiki-page-title">Одноразовые товары</h1>
    <p class="wiki-page-lead">
      Справочник расходуемых предметов: фильтруйте по направлению, редкости и цене.
    </p>

    <div class="goods-filters">
      <div class="goods-filters__block">
        <span class="goods-filters__label">Направление</span>
        <div class="wiki-filter-bar goods-filters__chips">
          <button
            type="button"
            class="wiki-filter-chip"
            :class="{ 'wiki-filter-chip--active': themeFilter === 'all' }"
            @click="themeFilter = 'all'"
          >
            Все
          </button>
          <button
            v-for="t in goodThemes"
            :key="t.id"
            type="button"
            class="wiki-filter-chip goods-filter-theme"
            :class="{ 'wiki-filter-chip--active': themeFilter === t.id }"
            :title="t.label"
            @click="themeFilter = t.id"
          >
            <span class="goods-filter-theme__emoji" aria-hidden="true">{{ t.emoji }}</span>
            <span class="goods-filter-theme__text">{{ t.label }}</span>
          </button>
        </div>
      </div>

      <div class="goods-filters__row">
        <div class="goods-filters__block goods-filters__block--compact">
          <span class="goods-filters__label">Редкость</span>
          <div class="wiki-filter-bar goods-filters__chips">
            <button
              type="button"
              class="wiki-filter-chip"
              :class="{ 'wiki-filter-chip--active': rarityFilter === 'all' }"
              @click="rarityFilter = 'all'"
            >
              Все
            </button>
            <button
              v-for="r in rarityLabels"
              :key="r"
              type="button"
              class="wiki-filter-chip"
              :class="{ 'wiki-filter-chip--active': rarityFilter === r }"
              @click="rarityFilter = r"
            >
              {{ r }}
            </button>
          </div>
        </div>

        <div class="goods-filters__block goods-filters__block--compact">
          <span class="goods-filters__label">Цена (золото)</span>
          <div class="goods-price-range">
            <label class="goods-price-range__field">
              <span class="visually-hidden">От</span>
              <input
                v-model.number="priceMin"
                type="number"
                min="0"
                class="goods-price-range__input"
                placeholder="от"
                aria-label="Минимальная цена"
              />
            </label>
            <span class="goods-price-range__sep" aria-hidden="true">—</span>
            <label class="goods-price-range__field">
              <span class="visually-hidden">До</span>
              <input
                v-model.number="priceMax"
                type="number"
                min="0"
                class="goods-price-range__input"
                placeholder="до"
                aria-label="Максимальная цена"
              />
            </label>
            <button
              v-if="priceMin != null || priceMax != null"
              type="button"
              class="goods-price-range__clear"
              @click="clearPrice"
            >
              Сбросить цену
            </button>
          </div>
        </div>

        <div class="goods-filters__block goods-filters__block--sort">
          <span class="goods-filters__label">Сортировка</span>
          <select v-model="sortMode" class="goods-sort-select" aria-label="Сортировка таблицы">
            <option value="price-asc">По цене (↑)</option>
            <option value="price-desc">По цене (↓)</option>
            <option value="name">По названию</option>
            <option value="rarity">По редкости</option>
          </select>
        </div>
      </div>
    </div>

    <p class="goods-count">
      Показано: <strong>{{ filteredSorted.length }}</strong> из {{ tradeGoods.length }}
    </p>

    <div class="goods-table-wrap">
      <table class="goods-table">
        <thead>
          <tr>
            <th scope="col">Название</th>
            <th scope="col">Категория</th>
            <th scope="col">Эффект</th>
            <th scope="col" class="goods-table__num">Цена</th>
            <th scope="col">Редкость</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filteredSorted"
            :id="`item-${item.id}`"
            :key="item.id"
            class="goods-table__row"
          >
            <th scope="row" class="goods-table__name">{{ item.name }}</th>
            <td class="goods-table__activation">{{ item.activation }}</td>
            <td class="goods-table__effect">{{ item.effect }}</td>
            <td class="goods-table__num">{{ formatPrice(item) }}</td>
            <td>
              <span class="goods-rarity" :data-rarity="item.rarity">{{ item.rarity }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="!filteredSorted.length" class="goods-empty">
      Нет предметов по выбранным фильтрам. Ослабьте условия или сбросьте цену.
    </p>
  </article>
</template>

<script setup lang="ts">
import type { GoodThemeId, RarityLabel, TradeGood } from '~/data/goods'
import { rarityRank, tradeGoods } from '~/data/goods'

const { goodThemes, rarityLabels } = useGoods()

function formatPrice (item: TradeGood): string {
  if (item.priceRange) {
    const a = item.priceRange.min.toLocaleString('ru-RU')
    const b = item.priceRange.max.toLocaleString('ru-RU')
    return `${a}–${b} зм`
  }
  return String(item.price)
}

const themeFilter = ref<'all' | GoodThemeId>('all')
const rarityFilter = ref<'all' | RarityLabel>('all')
const priceMin = ref<number | undefined>(undefined)
const priceMax = ref<number | undefined>(undefined)
const sortMode = ref<'price-asc' | 'price-desc' | 'name' | 'rarity'>('price-asc')

function clearPrice () {
  priceMin.value = undefined
  priceMax.value = undefined
}

function itemMatchesPriceFilter (g: TradeGood): boolean {
  const uMin = priceMin.value
  const uMax = priceMax.value
  const lo = g.priceRange?.min ?? g.price
  const hi = g.priceRange?.max ?? g.price
  if (uMin != null && Number.isFinite(uMin) && hi < uMin) return false
  if (uMax != null && Number.isFinite(uMax) && lo > uMax) return false
  return true
}

const filteredSorted = computed(() => {
  const list = tradeGoods.filter(g => {
    if (themeFilter.value !== 'all' && g.theme !== themeFilter.value) return false
    if (rarityFilter.value !== 'all' && g.rarity !== rarityFilter.value) return false
    if (!itemMatchesPriceFilter(g)) return false
    return true
  })

  const copy = [...list]
  switch (sortMode.value) {
    case 'price-asc':
      copy.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name, 'ru'))
      break
    case 'price-desc':
      copy.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name, 'ru'))
      break
    case 'name':
      copy.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
      break
    case 'rarity':
      copy.sort(
        (a, b) =>
          rarityRank[a.rarity] - rarityRank[b.rarity] || a.price - b.price || a.name.localeCompare(b.name, 'ru'),
      )
      break
    default:
      break
  }
  return copy
})

const route = useRoute()
onMounted(() => {
  const hash = route.hash?.replace(/^#/, '')
  if (hash && hash.startsWith('item-')) {
    nextTick(() => {
      const el = document.getElementById(hash)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }
})
</script>

<style scoped>
.goods-filters {
  margin-bottom: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.goods-filters__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  align-items: flex-end;
}

.goods-filters__block {
  flex: 1;
  min-width: min(100%, 280px);
}

.goods-filters__block--compact {
  flex: 1 1 220px;
  min-width: 200px;
}

.goods-filters__block--sort {
  flex: 0 1 200px;
  min-width: 160px;
}

.goods-filters__label {
  display: block;
  font-family: var(--font-ui);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  margin-bottom: var(--space-2);
}

.goods-filters__chips {
  margin-bottom: 0;
}

.goods-filter-theme {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  max-width: 100%;
}

.goods-filter-theme__emoji {
  flex-shrink: 0;
}

.goods-filter-theme__text {
  text-align: left;
  line-height: 1.25;
}

@media (max-width: 640px) {
  .goods-filter-theme__text {
    display: none;
  }
  .goods-filter-theme {
    padding-left: 0.65rem;
    padding-right: 0.65rem;
  }
}

.goods-price-range {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
}

.goods-price-range__input {
  width: 5.5rem;
  padding: 0.35rem 0.5rem;
  font-family: var(--font-ui);
  font-size: 0.875rem;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.goods-price-range__input:focus {
  outline: none;
  border-color: var(--color-gold-dim);
}

.goods-price-range__sep {
  color: var(--color-text-muted);
  user-select: none;
}

.goods-price-range__clear {
  font-family: var(--font-ui);
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: transparent;
  border: 1px solid var(--color-border-muted);
  border-radius: var(--radius);
  color: var(--color-text-muted);
  cursor: pointer;
}

.goods-price-range__clear:hover {
  color: var(--color-gold);
  border-color: var(--color-gold-dim);
}

.goods-sort-select {
  width: 100%;
  max-width: 220px;
  padding: 0.4rem 0.65rem;
  font-family: var(--font-ui);
  font-size: 0.875rem;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  cursor: pointer;
}

.goods-sort-select:focus {
  outline: none;
  border-color: var(--color-gold-dim);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.goods-count {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin: 0 0 var(--space-3);
}

.goods-table-wrap {
  overflow-x: auto;
  margin: 0 -0.25rem;
  padding: 0 0.25rem;
  -webkit-overflow-scrolling: touch;
}

.goods-table {
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
  font-size: 0.875rem;
  line-height: 1.45;
}

.goods-table thead th {
  font-family: var(--font-ui);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: left;
  color: var(--color-text-muted);
  padding: 0.65rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
  background: rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 1;
}

.goods-table tbody th,
.goods-table tbody td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--color-border-muted);
  vertical-align: top;
}

.goods-table__name {
  font-family: var(--font-heading);
  font-weight: 600;
  color: var(--color-light);
  min-width: 11rem;
}

.goods-table__activation {
  white-space: nowrap;
  color: var(--color-argalius-bright);
  font-size: 0.8125rem;
}

.goods-table__effect {
  color: var(--color-text-muted);
  min-width: 14rem;
}

.goods-table__num {
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.goods-table tbody tr:hover {
  background: rgba(201, 162, 39, 0.04);
}

.goods-table tbody tr:target {
  background: rgba(201, 162, 39, 0.1);
}

.goods-rarity {
  white-space: nowrap;
}

.goods-empty {
  margin-top: var(--space-4);
  color: var(--color-text-muted);
}
</style>

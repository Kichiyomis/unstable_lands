import { tradeGoods, goodThemes, rarityLabels, rarityRank } from '~/data/goods'
import type { GoodThemeId, RarityLabel, TradeGood } from '~/data/goods'

export function useGoods () {
  return {
    tradeGoods,
    goodThemes,
    rarityLabels,
    rarityRank,
  }
}

export type { GoodThemeId, RarityLabel, TradeGood }

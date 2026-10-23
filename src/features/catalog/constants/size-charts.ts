import type { CategoryGroup, Size } from '../types/catalog.types'

export type ChartColumn = 'width' | 'length' | 'waist' | 'hip' | 'inseam'

export interface ChartRow {
  size: Size
  /** Flat garment measurements in cm */
  cm: Partial<Record<ChartColumn, number>>
}

export interface SizeChartData {
  columns: ChartColumn[]
  rows: ChartRow[]
  /** Measuring diagram shown beside the table, when there is one */
  image?: string
}

export const SIZE_CHARTS: Record<CategoryGroup, SizeChartData> = {
  tops: {
    columns: ['width', 'length'],
    image: '/images/sizes.webp',
    rows: [
      { size: 'S', cm: { width: 58, length: 64 } },
      { size: 'M', cm: { width: 61, length: 66 } },
      { size: 'L', cm: { width: 64, length: 68 } },
      { size: 'XL', cm: { width: 67, length: 70 } },
      { size: 'XXL', cm: { width: 70, length: 72 } },
    ],
  },
  // Placeholder measurements until the real spec sheet for bottoms is confirmed
  bottoms: {
    columns: ['waist', 'hip', 'length', 'inseam'],
    rows: [
      { size: 'S', cm: { waist: 37, hip: 50, length: 100, inseam: 74 } },
      { size: 'M', cm: { waist: 39, hip: 52, length: 102, inseam: 75 } },
      { size: 'L', cm: { waist: 41, hip: 54, length: 104, inseam: 76 } },
      { size: 'XL', cm: { waist: 43, hip: 56, length: 106, inseam: 77 } },
    ],
  },
}

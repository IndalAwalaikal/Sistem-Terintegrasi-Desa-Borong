import { formatRupiah, formatAngka } from '@/lib/utils/format';

/**
 * Shared recharts <Tooltip> prop presets — eliminates the default dark "black box"
 * tooltip that jumps around on hover. Each preset is theme-aware and disables
 * animation jitter (isAnimationActive: false).
 *
 * Usage:
 *   <Tooltip {...darkTooltipProps} />      // admin dashboard charts (dark cards)
 *   <Tooltip {...lightTooltipProps} />     // public charts showing plain numbers
 *   <Tooltip {...lightTooltipRupiahProps} /> // public charts showing currency
 */

const lightContentStyle = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  fontSize: 12,
  color: '#1e293b',
  padding: '8px 12px',
  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
};

const darkContentStyle = {
  background: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: 12,
  fontSize: 12,
  color: '#e2e8f0',
  padding: '8px 12px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
};

const lightCursor = { fill: 'rgba(11, 92, 206, 0.06)', strokeWidth: 1 };
const darkCursor = { fill: 'rgba(255, 255, 255, 0.06)', strokeWidth: 1 };

/** Dark-theme tooltip for charts rendered on dark backgrounds (admin dashboard). */
export const darkTooltipProps = {
  isAnimationActive: false,
  cursor: darkCursor,
  contentStyle: darkContentStyle,
  formatter: (val: number) => formatAngka(val),
};

/** Light-theme tooltip for public charts showing plain numbers (population counts, etc.). */
export const lightTooltipProps = {
  isAnimationActive: false,
  cursor: lightCursor,
  contentStyle: lightContentStyle,
  formatter: (val: number) => formatAngka(val),
};

/** Light-theme tooltip for public charts showing currency values (APBDes). */
export const lightTooltipRupiahProps = {
  isAnimationActive: false,
  cursor: lightCursor,
  contentStyle: lightContentStyle,
  formatter: (val: number) => formatRupiah(val),
};

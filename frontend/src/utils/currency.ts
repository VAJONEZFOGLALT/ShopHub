export function formatPriceHUF(value: number, locale: string = 'hu-HU'): string {
  const safeValue = Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(safeValue);
}

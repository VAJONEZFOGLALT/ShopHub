export const ADMIN_UI = {
  previous: 'Előző',
  next: 'Következő',
  empty: 'Nincs találat.',
  actions: 'Műveletek',
} as const;

export const formatPageLabel = (currentPage: number, totalPages: number) =>
  `Oldal: ${currentPage} / ${totalPages}`;

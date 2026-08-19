import { CATALOG_ITEMS } from '@entities/catalog';

function getSubjectTitle(path: string | undefined): string {
  return CATALOG_ITEMS.find((item) => item.path === path)?.title ?? '';
}

export default getSubjectTitle;

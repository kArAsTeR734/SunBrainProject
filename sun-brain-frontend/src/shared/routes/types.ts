import type { UIMatch } from 'react-router-dom';

export type AppRouteHandle = {
  breadcrumb?: string | ((_match: UIMatch) => string);
};

import type { AppRouteHandle } from '@shared/routes';
import { useMatches } from 'react-router-dom';

const useBreadcrumbs = () => {
  const matches = useMatches();

  return matches
    .filter(
      (
        match,
      ): match is typeof match & {
        handle: AppRouteHandle;
      } => Boolean((match.handle as AppRouteHandle)?.breadcrumb),
    )
    .map((match) => {
      const handle = match.handle as AppRouteHandle;

      const label =
        typeof handle.breadcrumb === 'function'
          ? handle.breadcrumb(match)
          : handle.breadcrumb;

      return {
        label,
        href: match.pathname,
      };
    });
};

export default useBreadcrumbs;

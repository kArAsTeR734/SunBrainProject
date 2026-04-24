import { useMatches } from 'react-router-dom';
import { AppRouteHandle } from '@app/providers/routes/config.tsx';

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

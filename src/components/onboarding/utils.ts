import { onboardingRoutes } from './types';

export const getNextRoute = (currentPath: string): string => {
  const routes = Object.values(onboardingRoutes);
  const currentIndex = routes.findIndex(route => currentPath.includes(route.split('/').pop() || ''));
  return routes[currentIndex + 1] || routes[currentIndex];
};

export const getPreviousRoute = (currentPath: string): string => {
  const routes = Object.values(onboardingRoutes);
  const currentIndex = routes.findIndex(route => currentPath.includes(route.split('/').pop() || ''));
  return routes[currentIndex - 1] || routes[currentIndex];
}; 
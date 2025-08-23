import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';

interface UsePageDataOptions {
  pageName: string;
  fetchFunction: () => Promise<void>;
  dependencies?: any[];
}

export const usePageData = ({
  pageName,
  fetchFunction,
  dependencies = []
}: UsePageDataOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log(`Fetching ${pageName} data...`);
        await fetchFunction();
        setHasFetched(true);
      } catch (error) {
        console.error(`Error fetching ${pageName} data:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      console.log(`Refreshing ${pageName} data...`);
      await fetchFunction();
    } catch (error) {
      console.error(`Error refreshing ${pageName} data:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    hasFetched,
    refreshData
  };
};

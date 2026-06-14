import { useMemo, useState } from 'react';
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

const ITEM_HEIGHT = 300;
const CONTAINER_HEIGHT = 610;

export const CountryList = ({
  countries,
  searchQuery,
  selectedColumns,
  selectedRegion,
  selectedYear,
  sortField,
  sortOrder,
}: CountryListProps) => {
  const [scrollTop, setScrollTop] = useState(0);
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const filteredCountries = useMemo(() => {
    return countries
      .filter((c) => {
        const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);

        return matchesSearch && matchesRegion;
      })
      .sort((a, b) => {
        if (sortField === 'name') {
          return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
        }

        const popA = getPopulationForYear(createYearDataMap(a.data), selectedYear) || 0;

        const popB = getPopulationForYear(createYearDataMap(b.data), selectedYear) || 0;

        return sortOrder === 'asc' ? popA - popB : popB - popA;
      });
  }, [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]);

  const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);

  const visibleCount = Math.ceil(CONTAINER_HEIGHT / ITEM_HEIGHT) + 2;

  const endIndex = Math.min(filteredCountries.length, startIndex + visibleCount);

  const visibleCountries = filteredCountries.slice(startIndex, endIndex);

  const offsetY = startIndex * ITEM_HEIGHT;

  return (
    <div
      className={styles.countryList}
      style={{
        height: CONTAINER_HEIGHT,
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: filteredCountries.length * ITEM_HEIGHT }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleCountries.map((country) => {
            return (
              <CountryCard
                key={country.id}
                country={country}
                selectedYear={selectedYear}
                selectedColumns={selectedColumns}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

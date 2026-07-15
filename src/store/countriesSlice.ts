import { createSlice } from '@reduxjs/toolkit';
import { countryList } from '../data/countries';

type CountriesState = {
  countries: string[];
};

const initialState: CountriesState = {
  countries: countryList,
};

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
});

export default countriesSlice.reducer;

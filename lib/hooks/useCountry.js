import { create } from 'zustand'

export const useCountry = create(set => ({
  country: '',
  setCountry: country => set(() => ({ country })),
}))

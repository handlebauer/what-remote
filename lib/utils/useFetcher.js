import useSWR from 'swr'

const _fetcher = (...args) => fetch(...args).then((res) => res.json())

export const useFetcher = (path) => useSWR(path, _fetcher)

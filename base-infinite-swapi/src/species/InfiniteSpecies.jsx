import InfiniteScroll from 'react-infinite-scroller'
import { Species } from './Species'
import { useInfiniteQuery } from '@tanstack/react-query'

const initialUrl = 'https://swapi.dev/api/species/'
const fetchUrl = async (url) => {
  const response = await fetch(url)
  return response.json()
}

export function InfiniteSpecies() {
  const {
    data,
    isFetching,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['sw-species'],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.next || undefined
    },
  })

  if (isLoading) {
    return <h3>Loading...</h3>
  }
  if (isError) {
    return <h3>Error! {error.toString()}</h3>
  }

  console.log(data)

  // TODO: get data for InfiniteScroll via React Query
  return (
    <>
      {isFetching && <p className='loading'>Loading...</p>}
      <InfiniteScroll
        hasMore={hasNextPage}
        loadMore={() => {
          if (!isFetching) fetchNextPage()
        }}
      >
        {data.pages.map((pagesData) => {
          return pagesData.results.map((species) => {
            return (
              <Species
                key={species.name}
                name={species.name}
                language={species.language}
                averageLifespan={species.average_lifespan}
              />
            )
          })
        })}

        {/* */}
      </InfiniteScroll>
    </>
  )
}

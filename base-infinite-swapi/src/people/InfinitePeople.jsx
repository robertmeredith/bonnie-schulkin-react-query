import InfiniteScroll from 'react-infinite-scroller'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Person } from './Person'

const initialUrl = 'https://swapi.dev/api/people/'
const fetchUrl = async (url) => {
  const response = await fetch(url)
  return response.json()
}

export function InfinitePeople() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['sw-people'],
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

  // TODO: get data for InfiniteScroll via React Query
  return (
    <>
      {isFetching && <p>Updating...</p>}
      <InfiniteScroll
        hasMore={hasNextPage}
        loadMore={() => {
          if (!isFetching) fetchNextPage()
        }}
      >
        {data.pages.map((pageData) => {
          return (
            <>
              <h3>NEXT FETCH...</h3>
              {pageData.results.map((person) => {
                return (
                  <Person
                    key={person.name}
                    name={person.name}
                    eyeColor={person.eye_color}
                    hairColor={person.hair_color}
                  />
                )
              })}
            </>
          )
        })}
      </InfiniteScroll>
    </>
  )
}

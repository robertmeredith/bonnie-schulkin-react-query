import { useEffect, useState } from 'react'

import { fetchPosts, deletePost, updatePost } from './api'
import { PostDetail } from './PostDetail'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
const maxPostPage = 10

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPost, setSelectedPost] = useState(null)

  const queryClient = useQueryClient()

  // pre-fetch next page
  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1
      queryClient.prefetchQuery({
        queryKey: ['posts', nextPage],
        queryFn: () => fetchPosts(nextPage),
      })
    }
  }, [currentPage, queryClient])

  // fetch all posts query
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['posts', currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 1000 * 5,
  })

  // delete post mutation
  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
  })

  // change title mutation
  const updateMutation = useMutation({
    mutationFn: (postId) => updatePost(postId),
  })

  if (isLoading) {
    return <h3>Loading...</h3>
  }

  if (isError) {
    return (
      <>
        <h3>Oops something went wrong ...</h3>
        <p>{error.toString()}</p>
      </>
    )
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => {
              deleteMutation.reset()
              updateMutation.reset()
              setSelectedPost(post)
            }}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && (
        <PostDetail
          post={selectedPost}
          deleteMutation={deleteMutation}
          updateMutation={updateMutation}
        />
      )}
    </>
  )
}

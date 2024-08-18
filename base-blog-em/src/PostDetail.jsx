import { fetchComments } from './api'
import { useQuery } from '@tanstack/react-query'
import './PostDetail.css'

export function PostDetail({ post, deleteMutation, updateMutation }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => fetchComments(post.id),
  })

  const comments = isLoading ? (
    <h3>Loading...</h3>
  ) : isError ? (
    <>
      <h3>Error... :</h3>
      <p>{error}</p>
    </>
  ) : (
    data.map((comment) => (
      <li key={comment.id}>
        {comment.email}: {comment.body}
      </li>
    ))
  )

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>
      <div>
        <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
        {deleteMutation.isPending && (
          <p className="loading">Deleting the post</p>
        )}
        {deleteMutation.isError && (
          <p className="error">
            Error deleting the post: {deleteMutation.error.toString()}
          </p>
        )}
        {deleteMutation.isSuccess && (
          <p className="success">Post was (not) deleted</p>
        )}
      </div>
      <div>
        <button onClick={() => updateMutation.mutate(post.id)}>Update title</button>
        {updateMutation.isPending && (
          <p className="loading">Updating the post</p>
        )}
        {updateMutation.isError && (
          <p className="error">
            Error updating the post: {updateMutation.error.toString()}
          </p>
        )}
        {updateMutation.isSuccess && (
          <p className="success">Post was (not) updated</p>
        )}
      </div>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {comments}
      {/* {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))} */}
    </>
  )
}

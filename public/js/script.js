$(document).ready(function() {

    function upvoteComment(id) {
        fetch(`/api/comments/upvote/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        }).then(handleResponse);
    }

    function downvoteComment(id) {
        fetch(`/api/comments/downvote/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        }).then(handleResponse);
    }

    function upvotePost(id) {
        fetch(`/api/blogs/upvote/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        }).then(handleResponse);
    }

    function downvotePost(id) {
        fetch(`/api/blogs/downvote/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        }).then(handleResponse);
    }

    function deletePost(id) {
        fetch(`/api/blogs/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            if (response.ok) {
                location.replace('/dashboard');
            } else {
                alert('Failed to delete post');
            }
        });
    }

    function deleteComment(id) {
        fetch(`/api/comments/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }).then(handleResponse);
    }

    function handleResponse(response) {
        if (response.ok) {
            location.reload();
        } else {
            alert('Failed to perform action');
        }
    }

    $('.upvote-post-btn').on('click', function() { upvotePost($(this).data('id')); });
    $('.downvote-post-btn').on('click', function() { downvotePost($(this).data('id')); });
    $('.delete-post-btn').on('click', function() { deletePost($(this).data('id')); });
    $('.upvote-comment-btn').on('click', function() { upvoteComment($(this).data('id')); });
    $('.downvote-comment-btn').on('click', function() { downvoteComment($(this).data('id')); });
    $('.delete-comment-btn').on('click', function() { deleteComment($(this).data('id')); });
});

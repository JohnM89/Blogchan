document.getElementById('deleteForm').addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent the default form submission

  fetch(`/blogs/${this.dataset.postId}`, {
    method: 'DELETE',
  })
  .then(response => {
    if (response.ok) {
      window.location.href = '/'; // Redirect or handle success
    } else {
      alert('Error deleting post');
    }
  })
  .catch(error => console.error('Error:', error));
});

document.getElementById('upvoteForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission
    const form = this;
    const actionUrl = form.getAttribute('action');

    fetch(actionUrl, {
      method: 'PUT', // Send a PUT request instead
      // Include headers, body, etc., as needed
    }).then(response => {
      // Handle response
      console.log('Upvote successful');
    }).catch(error => {
      // Handle error
      console.log('Error upvoting:', error);
    });
});

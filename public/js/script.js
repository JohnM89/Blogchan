// upvote & downvote button dynamic front end !!
document.addEventListener('DOMContentLoaded', function() {
  const upvoteButtons = document.querySelectorAll('.upvote-button');
  const downvoteButtons = document.querySelectorAll('.downvote-button');

  upvoteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const postId = this.getAttribute('data-id');
      fetch(`/api/upvote/${postId}`, {
        method: 'PUT',
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          this.querySelector('.upvote-count').textContent = data.upVotes;
        }
      })
      .catch(error => console.error('Error:', error));
    });
  });

  downvoteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const postId = this.getAttribute('data-id');
      fetch(`/api/downvote/${postId}`, {
        method: 'PUT',
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          this.querySelector('.downvote-count').textContent = data.downVotes;
        }
      })
      .catch(error => console.error('Error:', error));
    });
  });
});

// want to add a delete button async function to delete a post eventually
// same for submitting a comment
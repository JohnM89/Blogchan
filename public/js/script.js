document.getElementById('deleteForm').addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent the default form submission

  const postId = this.dataset.postId; // Correctly accessing the post ID from the form's dataset

  fetch(`/blogs/${postId}`, {
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

// document.getElementById('upvoteForm').addEventListener('submit', function(e) {
//     e.preventDefault(); // Prevent the default form submission
//     const form = this;
//     const actionUrl = form.getAttribute('action');

//     fetch(actionUrl, {
//       method: 'PUT', // Send a PUT request instead
//       // Include headers, body, etc., as needed
//     }).then(response => {
//       // Handle response
//       console.log('Upvote successful');
//     }).catch(error => {
//       // Handle error
//       console.log('Error upvoting:', error);
//     });
// });

// document.getElementById('editButton').addEventListener('click', function() {
//   const postId = this.closest('form').dataset.postId; // Get the post ID from the closest form dataset

//   fetch(`/blogs/${postId}/edit`, {
//     method: 'GET',
//   })
//   .then(response => response.json())
//   .then(data => {
//     document.getElementById('editTitle').value = data.title;
//     document.getElementById('editContent').value = data.content;
//     // Populate other fields as necessary

//     document.getElementById('editModal').style.display = 'block';
//     document.getElementById('editForm').setAttribute('data-post-id', postId); // Ensure the form has the correct post ID for submission
//   })
//   .catch(error => console.error('Error:', error));
// });

// // Handle the submission of the edited data
// document.getElementById('submitEdit').addEventListener('click', function() {
//   const form = document.getElementById('editForm');
//   const postId = form.getAttribute('data-post-id');
//   const title = document.getElementById('editTitle').value;
//   const content = document.getElementById('editContent').value;
//   // Gather other fields as necessary

//   fetch(`/blogs/${postId}`, {
//     method: 'PUT', // or 'PATCH' depending on your server setup
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ title, content /* Include other fields here */ }),
//   })
//   .then(response => {
//     if (response.ok) {
//       // Handle successful edit
//       console.log('Edit successful');
//       document.getElementById('editModal').style.display = 'none'; // Optionally hide the modal
//       // You might also want to refresh the page or update the UI to reflect the edited data
//     } else {
//       // Handle error in edit
//       console.error('Error editing post');
//     }
//   })
//   .catch(error => console.error('Error:', error));
// });

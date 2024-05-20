document.addEventListener("DOMContentLoaded", function() {
    function fetchRedditPosts(subreddit) {
        var url = `https://www.reddit.com/r/${subreddit}/hot.json`; // Remove the limit parameter to fetch multiple posts
        
        // Fetch Reddit posts using XMLHttpRequest
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                var posts = response.data.children;
                
                // Loop through the posts and display them
                posts.forEach(function(post) {
                    var title = post.data.title;
                    var url = post.data.url;
                    var imageUrl = post.data.thumbnail;


                    
                    
                    // Create a new post element
                    var postContainer = document.createElement("div");
                    postContainer.className = "f-card";

                    var header = document.createElement("div");
                    header.className = "header";
                    header.innerHTML = `
                        <div class="options"><i class="fa fa-chevron-down"></i></div>
                        <img class="co-logo" src="/assets/blogger.svg" />
                        <div class="co-name"><a href="#">${post.data.author}</a></div>
                        <div class="time"><a href="#">${new Date(post.data.created_utc * 1000).toLocaleString()}</a> · <i class="fa fa-globe"></i></div>
                    `;

                    var content = document.createElement("div");
                    content.className = "content";
                    content.innerHTML = `
                        <p class="displayed-content">Hot in Tech</p>
                    `;

                   var reference = document.createElement("div");
                    reference.className = "reference";
                    reference.innerHTML = `
                        <img class="reference-thumb" src="${imageUrl}" alt="Image Description" style="width: auto; height: auto; max-width: 100%; max-height: 100%;" />
                        <div class="reference-content">
                            <div class="reference-title"><a href="${url}">${title}</a></div>
                            <div class="reference-subtitle">${post.data.selftext}</div> <!-- Assuming selftext is the content -->
                        </div>
                    `;


                    var social = document.createElement("div");
                    social.className = "social";
                    social.innerHTML = `
                        <div class="btn-group" role="group" aria-label="Post Actions">
                            <button class="btn btn-link">
                                <i class="fa fa-share"></i> Share
                            </button>
                        </div>
                    `;

                    // Append the elements to the post container
                    postContainer.appendChild(header);
                    postContainer.appendChild(content);
                    postContainer.appendChild(reference);
                    postContainer.appendChild(social);

                    // Append the post container to the news feed
                    document.getElementById("news-feed").appendChild(postContainer);
                });
            }
        };
        xhr.send();
    }
    
    // Fetch hot posts from the 'technology' subreddit
    fetchRedditPosts("technology");
});

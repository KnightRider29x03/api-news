document.getElementById("fetch-posts").addEventListener("click", fetchPosts);

function fetchPosts() {
  Promise.all([
    fetch("https://jsonplaceholder.typicode.com/posts").then((response) =>
      response.json()
    ),
    fetch("https://jsonplaceholder.typicode.com/users").then((response) =>
      response.json()
    ),
  ])
    .then(([posts, users]) => {
      const postsContainer = document.getElementById("posts-container");
      postsContainer.innerHTML = "";

      posts.forEach((post) => {
        const user = users.find((user) => user.id === post.userId);
        const postElement = document.createElement("div");
        postElement.classList.add("post");
        postElement.style.backgroundColor = getRandomColor();
        postElement.innerHTML = `
          <h2>${post.title}</h2>
          <p>${post.body}</p>
          <p><strong>User:</strong> ${user.name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
        `;
        postElement.addEventListener("click", () => fetchPostDetails(post.id));
        postsContainer.appendChild(postElement);
      });
    })
    .catch((error) => console.error("Error fetching posts or users:", error));
}

function fetchPostDetails(postId) {
  Promise.all([
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`).then(
      (response) => response.json()
    ),
    fetch(
      `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
    ).then((response) => response.json()),
  ])
    .then(([post, comments]) => {
      const postDetailsContainer = document.getElementById(
        "post-details-container"
      );
      postDetailsContainer.innerHTML = `
        <div class="post-detail">
          <h2>${post.title}</h2>
          <p>${post.body}</p>
          <h3>Comments:</h3>
          <div id="comments-container"></div>
        </div>
      `;

      const commentsContainer = document.getElementById("comments-container");
      comments.forEach((comment) => {
        const commentElement = document.createElement("div");
        commentElement.classList.add("comment");
        commentElement.innerHTML = `
          <p><strong>${comment.name} (${comment.email})</strong></p>
          <p>${comment.body}</p>
        `;
        commentsContainer.appendChild(commentElement);
      });
    })
    .catch((error) =>
      console.error("Error fetching post details or comments:", error)
    );
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

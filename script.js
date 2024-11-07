// Load blog posts from local storage
const posts = JSON.parse(localStorage.getItem("posts")) || [];


//(index.html)


const postList = document.getElementById("post-list");
if (postList) {
    // Ensure that posts exist in local storage before displaying
    if (posts.length > 0) {
        posts.forEach(post => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.content.substring(0, 100)}...</p>
                <a href="post.html?id=${post.id}">Read More</a>
            `;
            postList.appendChild(listItem);
        });
    } else {
        postList.innerHTML = "<li>No posts available</li>";
    }
}




// (new-post.html)


const postForm = document.getElementById("post-form");
if (postForm) {
    postForm.addEventListener("submit", function (e) {
        e.preventDefault();


       
        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;
        const image = document.getElementById("image").files[0]; // Optional image


        // title and content are not empty
        if (!title || !content) {
            alert("Title and content are required!");
            return;
        }


        // Create a new post
        const newPost = {
            id: Date.now(), // Use timestamp as a unique ID
            title: title,
            content: content,
            image: image ? URL.createObjectURL(image) : null, // If an image is provided, store a URL
        };


        // Add the new post
        posts.push(newPost);


        // Save the updated posts array back to local storage
        localStorage.setItem("posts", JSON.stringify(posts));


        // Redirect back to the homepage
        window.location.href = "index.html";
    });
}


// Post Page


const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");


if (postId) {
    const post = posts.find(p => p.id == postId);
    const postDetails = document.getElementById("post-details");


    if (post && postDetails) {
        // Show the post
        postDetails.innerHTML = `
            <label for="title">Post Title:</label>
            <input type="text" id="title" value="${post.title}" readonly>
            <label for="content">Content:</label>
            <textarea id="content" rows="5" readonly>${post.content}</textarea>
        `;


        // Show edit, save, and delete buttons
        const editBtn = document.getElementById("edit-btn");
        const saveBtn = document.getElementById("save-btn");
        const deleteBtn = document.getElementById("delete-btn");


        if (editBtn) {
            editBtn.style.display = "inline-block"; // Ensure the edit button is visible
            editBtn.addEventListener("click", function () {
                document.getElementById("title").removeAttribute("readonly");
                document.getElementById("content").removeAttribute("readonly");
                saveBtn.style.display = "inline-block"; // Show the Save button
                editBtn.style.display = "none"; // Hide the Edit button
            });
        }


        if (saveBtn) {
            saveBtn.addEventListener("click", function () {
                post.title = document.getElementById("title").value;
                post.content = document.getElementById("content").value;


                // Save the updated post to local storage
                localStorage.setItem("posts", JSON.stringify(posts));


       
                saveBtn.style.display = "none";
                editBtn.style.display = "inline-block";


                alert("Post updated successfully!");
            });
        }


        if (deleteBtn) {
            deleteBtn.style.display = "inline-block"; // Make sure delete button is visible


            //delete functionality
            deleteBtn.addEventListener("click", function () {
                // Filter out the post by its ID to remove it from the array
                const updatedPosts = posts.filter(p => p.id !== parseInt(postId));


                // Update the localStorage
                localStorage.setItem("posts", JSON.stringify(updatedPosts));


                // Redirect to homepage after deletion
                window.location.href = "index.html";  // This will reload the homepage and reflect changes


                alert("Post deleted successfully!");
            });
        }
    } else {
        // Post not found
        const postDetails = document.getElementById("post-details");
        if (postDetails) {
            postDetails.innerHTML = "<p>Post not found!</p>";
        }
    }
}

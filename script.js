const postsPerPage = 5;
let currentPage = 1;
const pagesToShow = 3; // Number of pages to show at a time

const paginationContainer = document.querySelector('.pagination');
const pagesContainer = document.getElementById('pages');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const postListContainer = document.getElementById('post-list');

function displayPosts() {
    const startIndex = (currentPage - 1) * postsPerPage;
    fetch(`https://jsonplaceholder.typicode.com/posts?_start=${startIndex}&_limit=${postsPerPage}`)
        .then(response => response.json())
        .then(posts => {
            postListContainer.innerHTML = '';

            posts.forEach(post => {
                const postItem = document.createElement('div');
                postItem.classList.add('post-item');
                postItem.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                `;
                postListContainer.appendChild(postItem);
            });

            updatePagination();
        })
        .catch(error => console.error(error));
}

function updatePagination() {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            const totalPosts = data.length;
            const totalPages = Math.ceil(totalPosts / postsPerPage);

            pagesContainer.innerHTML = '';

            // Calculate the range of pages to show
            const startPage = Math.max(currentPage - Math.floor(pagesToShow / 2), 1);
            const endPage = Math.min(startPage + pagesToShow - 1, totalPages);

            // Create buttons for the range of pages
            for (let i = startPage; i <= endPage; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = i;
                pageButton.addEventListener('click', () => {
                    currentPage = i;
                    displayPosts();
                });
                if (i === currentPage) {
                    pageButton.classList.add('active');
                }
                pagesContainer.appendChild(pageButton);
            }

            prevButton.disabled = currentPage === 1;
            nextButton.disabled = currentPage === totalPages;

            // Create button to go to the last page (only if not on the last page)
            if (currentPage < totalPages) {
                const lastPageButton = document.createElement('button');
                lastPageButton.textContent = 'Last Page';
                lastPageButton.addEventListener('click', () => {
                    currentPage = totalPages;
                    displayPosts();
                });
                pagesContainer.appendChild(lastPageButton);
            }

            // Create button to go to the first page (only when on the last page)
            if (currentPage === totalPages) {
                const firstPageButton = document.createElement('button');
                firstPageButton.textContent = 'First Page';
                firstPageButton.addEventListener('click', () => {
                    currentPage = 1;
                    displayPosts();
                });
                pagesContainer.insertBefore(firstPageButton, pagesContainer.firstChild);
            }
        })
        .catch(error => console.error(error));
}

prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayPosts();
    }
});

nextButton.addEventListener('click', () => {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            const totalPosts = data.length;
            const totalPages = Math.ceil(totalPosts / postsPerPage);

            if (currentPage < totalPages) {
                currentPage++;
                displayPosts();
            }
        })
        .catch(error => console.error(error));
});

displayPosts();

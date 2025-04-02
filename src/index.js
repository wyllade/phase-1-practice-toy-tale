let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

// URLs for API requests
const apiUrl = "http://localhost:3000/toys";

// DOM elements
const toyCollection = document.getElementById('toy-collection');
const addToyButton = document.getElementById('add-toy-btn');
const toyFormContainer = document.getElementById('toy-form-container');
const addToyForm = document.getElementById('add-toy-form');

// Fetch toys and render them
function fetchToys() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(toys => {
      toyCollection.innerHTML = ''; // Clear existing toys before adding new ones
      toys.forEach(toy => renderToyCard(toy));
    })
    .catch(error => console.error('Error fetching toys:', error));
}

// Render individual toy card
function renderToyCard(toy) {
  const toyCard = document.createElement('div');
  toyCard.classList.add('card');
  
  const toyName = document.createElement('h2');
  toyName.textContent = toy.name;
  
  const toyImage = document.createElement('img');
  toyImage.src = toy.image;
  toyImage.classList.add('toy-avatar');
  
  const toyLikes = document.createElement('p');
  toyLikes.textContent = `${toy.likes} Likes`;
  
  const likeButton = document.createElement('button');
  likeButton.classList.add('like-btn');
  likeButton.textContent = "Like ❤️";
  likeButton.id = toy.id;
  likeButton.addEventListener('click', () => likeToy(toy));

  toyCard.append(toyName, toyImage, toyLikes, likeButton);
  toyCollection.appendChild(toyCard);
}

// Handle "Like" button click
function likeToy(toy) {
  const newLikes = toy.likes + 1;

  fetch(`${apiUrl}/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      likes: newLikes,
    }),
  })
  .then(response => response.json())
  .then(updatedToy => {
    const toyCard = document.getElementById(updatedToy.id).closest('.card');
    toyCard.querySelector('p').textContent = `${updatedToy.likes} Likes`;
  })
  .catch(error => console.error('Error updating toy likes:', error));
}

// Add new toy
function addNewToy(event) {
  event.preventDefault();

  const toyName = document.getElementById('toy-name').value;
  const toyImage = document.getElementById('toy-image').value;

  const newToy = {
    name: toyName,
    image: toyImage,
    likes: 0,
  };

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(newToy),
  })
  .then(response => response.json())
  .then(toy => {
    renderToyCard(toy);
    addToyForm.reset(); // Clear the form fields
    toyFormContainer.style.display = 'none'; // Hide the form
  })
  .catch(error => console.error('Error adding new toy:', error));
}

// Toggle the form visibility
function toggleForm() {
  const formDisplay = toyFormContainer.style.display;
  toyFormContainer.style.display = formDisplay === 'none' ? 'block' : 'none';
}

// Event listeners
addToyButton.addEventListener('click', toggleForm);
addToyForm.addEventListener('submit', addNewToy);

// Initialize page by fetching and displaying toys
document.addEventListener('DOMContentLoaded', fetchToys);

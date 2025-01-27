const API_URL = 'https://jsonplaceholder.typicode.com/users';
const userList = document.getElementById('userList');
const userFormContainer = document.getElementById('userFormContainer');
const userForm = document.getElementById('userForm');
const addUserBtn = document.getElementById('addUserBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('formTitle');

let isEditing = false;
let currentUserId = null;

// Fetch users from the API
async function fetchUsers() {
    try {
        const response = await fetch(API_URL);
        const users = await response.json();
        renderUsers(users);
    } catch (error) {
        alert('Error fetching users from the API. Please try again later.');
    }
}

// Render users in the table
function renderUsers(users) {
    userList.innerHTML = '';
    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name.split(' ')[0]}</td>
            <td>${user.name.split(' ')[1]}</td>
            <td>${user.email}</td>
            <td>${user.company.name}</td>
            <td>
                <button class="editBtn" onclick="editUser(${user.id})">Edit</button>
                <button class="deleteBtn" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        userList.appendChild(tr);
    });
}

// Add a new user by posting to the API
async function addUser(user) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            throw new Error('Error adding user');
        }
        fetchUsers(); // Re-fetch users after adding
    } catch (error) {
        alert('Error adding the user. Please try again later.');
    }
}

// Edit a user
async function editUser(id) {
    isEditing = true;
    currentUserId = id;
    formTitle.innerText = 'Edit User';

    // Get the current data for the user
    const user = await getUserById(id);
    document.getElementById('firstName').value = user.name.split(' ')[0];
    document.getElementById('lastName').value = user.name.split(' ')[1];
    document.getElementById('email').value = user.email;
    document.getElementById('department').value = user.company.name;

    userFormContainer.classList.remove('hidden');
}

// Fetch user data by ID
async function getUserById(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const user = await response.json();
        return user;
    } catch (error) {
        alert('Error fetching user details.');
    }
}

// Handle form submission for both Add and Edit
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = {
        name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
        email: document.getElementById('email').value,
        company: { name: document.getElementById('department').value }
    };

    if (isEditing) {
        // Edit user
        try {
            const response = await fetch(`${API_URL}/${currentUserId}`, {
                method: 'PUT',
                body: JSON.stringify(user),
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                throw new Error('Error updating user');
            }
            fetchUsers(); // Re-fetch after editing
        } catch (error) {
            alert('Error editing user. Please try again later.');
        }
    } else {
        // Add new user
        addUser(user);
    }

    userForm.reset();
    userFormContainer.classList.add('hidden');
    isEditing = false;
});

// Cancel form
cancelBtn.addEventListener('click', () => {
    userFormContainer.classList.add('hidden');
    isEditing = false;
});

// Show the form to add a new user
addUserBtn.addEventListener('click', () => {
    formTitle.innerText = 'Add User';
    userForm.reset();
    userFormContainer.classList.remove('hidden');
});

// Delete user
async function deleteUser(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('Error deleting user');
        }
        fetchUsers(); // Re-fetch after deletion
    } catch (error) {
        alert('Error deleting user. Please try again later.');
    }
}

// Initial fetch to load users when the page loads
fetchUsers();

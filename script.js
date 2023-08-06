document.addEventListener('DOMContentLoaded', () => {
  // Get reference to the intro page and heading
  const introPage = document.getElementById('introPage');
  const introHeading = document.getElementById('introHeading');

  // Add intro animation class to the intro page and heading
  introPage.classList.add('animate-slide-up');
  introHeading.classList.add('animate-fade-in-up');

});

const addContactBtn = document.getElementById('addContactBtn');
const closeBtn = document.getElementById('closeBtn');
const saveBtn = document.getElementById('saveBtn');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const activeRadio = document.getElementById('active');
const inactiveRadio = document.getElementById('inactive');
const contactsList = document.getElementById('contactsList');
const menuIconBtn = document.getElementById('menu-icon');
const contactPage = document.querySelector('.contact-page');
const chartsPage = document.querySelector('.charts-page');
const menuList = document.querySelector('.sidebar');


menuIconBtn.addEventListener('click', (event) => {
  sidebar.classList.remove('hidden'); // Remove the "hidden" class from the sidebar
  
});

document.addEventListener('click', (event) => {
  if (!sidebar.classList.contains('hidden') && !sidebar.contains(event.target) && !menuIconBtn.contains(event.target)) {
        sidebar.classList.add('hidden'); // Add the "hidden" class to hide the sidebar
      }
  });

menuList.querySelector('li:nth-child(1)').addEventListener('click', () => {
  sidebar.classList.add('hidden');
  contactPage.classList.remove('hidden');
  chartsPage.classList.add('hidden');
});
    
// Show Charts & Graphs page when "Charts & Graphs" is clicked
menuList.querySelector('li:nth-child(2)').addEventListener('click', () => {
  sidebar.classList.add('hidden');
  contactPage.classList.add('hidden');
  chartsPage.classList.remove('hidden');
});


// Initial state
const initialState = {
  contacts: []
};

    // Action types
const ADD_CONTACT = 'ADD_CONTACT';
const EDIT_CONTACT = 'EDIT_CONTACT';
const DELETE_CONTACT = 'DELETE_CONTACT';

    // Reducer
const contactsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CONTACT:
      return { ...state, contacts: [...state.contacts, action.payload] };
    case EDIT_CONTACT:
      return {
        ...state,
        contacts: state.contacts.map((contact, index) =>
        index === action.payload.index
        ? { ...contact, ...action.payload.updatedContact }
        : contact
        )
      };
    case DELETE_CONTACT:
      return {
        ...state,
        contacts: state.contacts.filter((contact, index) => index !== action.payload)
      };
    default:
      return state;
  }
};

// Store
const store = Redux.createStore(contactsReducer);

// Render contacts
const renderContacts = () => {
const state = store.getState();
const contactsList = document.getElementById('contactsList');
const emptyBoxImage = document.getElementById('emptyBoxImage');

// Check if there are contacts in the state
 if (state.contacts.length === 0) {
  // No contacts, hide the contacts list and display the empty box image
  contactsList.innerHTML = '';
  contactsList.classList.add('hidden');
  emptyBoxImage.classList.remove('hidden');}
  else {
    contactsList.innerHTML = '';
    state.contacts.forEach((contact, index) => {
    const contactCard = document.createElement('div');
    contactCard.className = 'bg-blue-300 p-4 rounded-lg mb-4 w-56 h-90';
    contactCard.innerHTML = `
      <h2 class="text-xl font-bold">${contact.firstName} ${contact.lastName}</h2>
      <p class="text-gray-500">${contact.status}</p>
      <div class="flex space-x-2 mt-2">
        <button class="edit-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" data-index="${index}">Edit</button>
        <button class="delete-btn bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" data-index="${index}">Delete</button>
      </div>
    `;
    

    // Add event listener for Edit button
    const editButton = contactCard.querySelector('.edit-btn');
    editButton.addEventListener('click', (event) => {
      event.preventDefault();
      handleEditContact(event);
    });
    

    // Add event listener for Delete button
    const deleteButton = contactCard.querySelector('.delete-btn');
    deleteButton.addEventListener('click', (event) => {
      event.preventDefault();
      handleDeleteContact(index);
    });

    contactsList.appendChild(contactCard);
    });
    contactsList.classList.remove('hidden');
    emptyBoxImage.classList.add('hidden'); 
  }
};
// Add contact
const addContact = (firstName, lastName, status) => {
  store.dispatch({
    type: ADD_CONTACT,
    payload: { firstName, lastName, status }
    });
};

// Edit contact
const editContact = (index, updatedContact) => {
  store.dispatch({
    type: EDIT_CONTACT,
    payload: { index, updatedContact }
    });
};

// Delete contact
const deleteContact = index => {
  store.dispatch({
    type: DELETE_CONTACT,
    payload: index
    });
};

// Handle Add Contact button click
addContactBtn.addEventListener('click', () => {
  document.querySelector('.overlay').classList.remove('hidden');
});

// Handle Close button click
closeBtn.addEventListener('click', () => {
 document.querySelector('.overlay').classList.add('hidden');
});

// Handle Save button click
saveBtn.addEventListener('click', () => {
  const firstName = firstNameInput.value;
  const lastName = lastNameInput.value;
  const status = activeRadio.checked ? 'active' : 'inactive';
  if (firstName && lastName) {
    addContact(firstName, lastName, status);
    document.querySelector('.overlay').classList.add('hidden');
    firstNameInput.value = '';
    lastNameInput.value = '';
    activeRadio.checked = true;
  }
});

// Handle Edit button click
const handleEditContact = (event) => {
  const index = event.target.getAttribute('data-index');
  const state = store.getState();
  const contact = state.contacts[index];
  const firstNameInput = document.getElementById('firstNameInput');
  const lastNameInput = document.getElementById('lastNameInput');
  const activeRadio = document.getElementById('activeRadio');
  const inactiveRadio = document.getElementById('inactiveRadio');

  firstNameInput.value = contact.firstName;
  lastNameInput.value = contact.lastName;
  if (contact.status === 'active') {
    activeRadio.checked = true;
  } else {
    inactiveRadio.checked = true;
  }

  const saveBtn = document.getElementById('saveBtn');
  saveBtn.removeEventListener('click', handleSaveContact);

  const handleSaveEditContact = () => {
    const updatedFirstName = firstNameInput.value;
    const updatedLastName = lastNameInput.value;
    const updatedStatus = activeRadio.checked ? 'active' : 'inactive';

    if (updatedFirstName && updatedLastName) {
      editContact(index, {
        firstName: updatedFirstName,
        lastName: updatedLastName,
        status: updatedStatus,
      });

      document.querySelector('.overlay').classList.add('hidden');
    }
  };

  saveBtn.addEventListener('click', handleSaveEditContact);

  document.querySelector('.overlay').classList.remove('hidden');
};
// Handle Delete button click
const handleDeleteContact = index => {
      deleteContact(index);
      renderContacts(); // Re-render the contacts list after deleting
};

// Subscribe to the store and render contacts on state change
store.subscribe(renderContacts);

// Initial render
renderContacts();

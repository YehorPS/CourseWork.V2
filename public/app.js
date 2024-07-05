document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const militaryForm = document.getElementById('militaryForm');
    const militaryTable = document.getElementById('militaryTable')?.getElementsByTagName('tbody')[0];
    const editModal = document.getElementById('editModal');
    const editMilitaryForm = document.getElementById('editMilitaryForm');
    const closeModal = document.getElementsByClassName('close')[0];

    let token = localStorage.getItem('token');
    let currentMilitaryId = null;

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            const res = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();
            if (data._id) {
                window.location.href = 'login.html';
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = 'military.html';
            } else {
                console.log(data);
            }
        });
    }

    if (militaryForm) {
        militaryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('militaryName').value;
            const rank = document.getElementById('militaryRank').value;
            const salary = document.getElementById('militarySalary').value;
            const dateEnlisted = document.getElementById('militaryDateEnlisted').value;

            try {
                const res = await fetch('/api/military/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify({ name, rank, salary, dateEnlisted })
                });

                const data = await res.json();
                if (res.ok) {
                    addMilitaryRow(data);
                } else {
                    console.error('Error adding military:', data);
                }
            } catch (error) {
                console.error('Network error:', error);
            }
        });

      

        async function loadMilitaries() {
            try {
                const res = await fetch('/api/military/list', {
                    headers: {
                        'Authorization': token
                    }
                });
    
                if (!res.ok) {
                    throw new Error('Failed to fetch data');
                }
    
                const militaries = await res.json();
                militaryTable.innerHTML = '';
                militaries.forEach(military => addMilitaryRow(military));
            } catch (error) {
                console.error('Error loading militaries:', error);
            }
        }
        function addMilitaryRow(military) {
            const row = militaryTable.insertRow();
            const nameCell = row.insertCell(0);
            const rankCell = row.insertCell(1);
            const salaryCell = row.insertCell(2);
            const dateEnlistedCell = row.insertCell(3);
            const actionsCell = row.insertCell(4);

            nameCell.textContent = military.name;
            rankCell.textContent = military.rank;
            salaryCell.textContent = military.salary;
            dateEnlistedCell.textContent = new Date(military.dateEnlisted).toDateString();

            actionsCell.innerHTML = `
                <button class="edit-btn" data-id="${military._id}">Edit</button>
                <button class="delete-btn" data-id="${military._id}">Delete</button>
            `;

            row.querySelector('.edit-btn').addEventListener('click', () => openEditModal(military));
            row.querySelector('.delete-btn').addEventListener('click', () => deleteMilitary(military._id));
        }

      

        function openEditModal(military) {
            currentMilitaryId = military._id;
            document.getElementById('editMilitaryName').value = military.name;
            document.getElementById('editMilitaryRank').value = military.rank;
            document.getElementById('editMilitarySalary').value = military.salary;
            document.getElementById('editMilitaryDateEnlisted').value = military.dateEnlisted;

            editModal.style.display = 'block';
        }

        editMilitaryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('editMilitaryName').value;
            const rank = document.getElementById('editMilitaryRank').value;
            const salary = document.getElementById('editMilitarySalary').value;
            const dateEnlisted = document.getElementById('editMilitaryDateEnlisted').value;

            try {
                const res = await fetch(`/api/military/update/${currentMilitaryId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify({ name, rank, salary, dateEnlisted })
                });

                const data = await res.json();
                if (res.ok) {
                    loadMilitaries();
                    editModal.style.display = 'none';
                } else {
                    console.error('Error updating military:', data);
                }
            } catch (error) {
                console.error('Network error:', error);
            }
        });

    

        async function deleteMilitary(id) {
            if (confirm('Are you sure you want to delete this record?')) {
                try {
                    const res = await fetch(`/api/military/delete/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': token
                        }
                    });

                    if (res.ok) {
                        loadMilitaries();
                    } else {
                        console.error('Error deleting military:', await res.json());
                    }
                } catch (error) {
                    console.error('Network error:', error);
                }
            }
        }

        closeModal.onclick = function() {
            editModal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == editModal) {
                editModal.style.display = "none";
            }
        }

        loadMilitaries();
    }
   
});

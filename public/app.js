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

            try {
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
            } catch (error) {
                console.error('Registration error:', error);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
    
            try {
                console.log('Submitting login form...');
                
                const res = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
    
                console.log('Response received');
    
                const data = await res.json();
                console.log('Response data:', data);
    
                if (data.token) {
                    localStorage.setItem('token', data.token);
    
                    // Перевірка ролі користувача
                    if (data.role === 'admin') {
                        // Якщо користувач є адміністратором, перенаправляємо на сторінку адміна
                        window.location.href = 'admin.html'; // Замініть '/admin' на шлях до вашої сторінки адміна
                    } else {
                        // Інакше перенаправляємо на сторінку з військовими
                        window.location.href = 'military.html';
                    }
                } else {
                    if (data.message) {
                        alert(data.message);  // Відображаємо причину бану або інші повідомлення про помилку
                    } else {
                        console.log(data);
                    }
                }
            } catch (error) {
                console.error('Login error:', error);
            }
        });
    }
    

    if (militaryForm) {
        militaryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const firstName = document.getElementById('militaryFirstName').value;
            const lastName = document.getElementById('militaryLastName').value;
            const middleName = document.getElementById('militaryMiddleName').value;
            const rank = document.getElementById('militaryRank').value;
            const salary = document.getElementById('militarySalary').value;
            const dateEnlisted = document.getElementById('militaryDateEnlisted').value;
            const phone = document.getElementById('militaryPhone').value;
            const contract = document.getElementById('militaryContract').value;

            try {
                const res = await fetch('/api/military/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify({ firstName, lastName, middleName, rank, salary, dateEnlisted, phone, contract })
                });

                const data = await res.json();
                if (res.ok) {
                    addMilitaryRow(data);
                    clearMilitaryForm();
                } else {
                    console.error('Error adding military:', data);
                }
            } catch (error) {
                console.error('Network error:', error);
            }
        });

        if (token && militaryTable) {
            loadMilitaries();
        }

        async function loadMilitaries() {
            try {
                const res = await fetch('/api/military/list', {
                    headers: {
                        'Authorization': token
                    }
                });

                const militaries = await res.json();
                militaryTable.innerHTML = '';
                militaries.forEach(military => addMilitaryRow(military));
            } catch (error) {
                console.error('Error loading militaries:', error);
            }
        }

        function addMilitaryRow(military) {
            const row = militaryTable.insertRow();
            const firstNameCell = row.insertCell(0);
            const lastNameCell = row.insertCell(1);
            const middleNameCell = row.insertCell(2);
            const rankCell = row.insertCell(3);
            const salaryCell = row.insertCell(4);
            const dateEnlistedCell = row.insertCell(5);
            const phoneCell = row.insertCell(6);
            const contractCell = row.insertCell(7);
            const remainingContractCell = row.insertCell(8); // Доданий стовпчик залишку контракту в днях
            const actionsCell = row.insertCell(9);

            firstNameCell.textContent = military.firstName;
            lastNameCell.textContent = military.lastName;
            middleNameCell.textContent = military.middleName;
            rankCell.textContent = military.rank;
            salaryCell.textContent = military.salary;
            dateEnlistedCell.textContent = new Date(military.dateEnlisted).toDateString();
            phoneCell.textContent = military.phone;
            contractCell.textContent = military.contract;

            // Обчислюємо залишок контракту в днях
            const enlistmentDate = new Date(military.dateEnlisted);
            const contractYears = military.contract;
            const currentDate = new Date();
            const contractEndDate = new Date(enlistmentDate.getFullYear() + contractYears, enlistmentDate.getMonth(), enlistmentDate.getDate());
            const remainingContractDays = Math.max(0, Math.ceil((contractEndDate - currentDate) / (1000 * 3600 * 24)));

            remainingContractCell.textContent = `${remainingContractDays} днів`;

            actionsCell.innerHTML = `
                <button class="edit-btn" data-id="${military._id}">Edit</button>
                <button class="delete-btn" data-id="${military._id}">Delete</button>
            `;

            row.querySelector('.edit-btn').addEventListener('click', () => openEditModal(military));
            row.querySelector('.delete-btn').addEventListener('click', () => deleteMilitary(military._id));
        }

        function openEditModal(military) {
            currentMilitaryId = military._id;
            document.getElementById('editMilitaryFirstName').value = military.firstName;
            document.getElementById('editMilitaryLastName').value = military.lastName;
            document.getElementById('editMilitaryMiddleName').value = military.middleName;
            document.getElementById('editMilitaryRank').value = military.rank;
            document.getElementById('editMilitarySalary').value = military.salary;
            document.getElementById('editMilitaryDateEnlisted').value = military.dateEnlisted;
            document.getElementById('editMilitaryPhone').value = military.phone;
            document.getElementById('editMilitaryContract').value = military.contract;

            editModal.style.display = 'block';
        }

        editMilitaryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const firstName = document.getElementById('editMilitaryFirstName').value;
            const lastName = document.getElementById('editMilitaryLastName').value;
            const middleName = document.getElementById('editMilitaryMiddleName').value;
            const rank = document.getElementById('editMilitaryRank').value;
            const salary = document.getElementById('editMilitarySalary').value;
            const dateEnlisted = document.getElementById('editMilitaryDateEnlisted').value;
            const phone = document.getElementById('editMilitaryPhone').value;
            const contract = document.getElementById('editMilitaryContract').value;

            try {
                const res = await fetch(`/api/military/update/${currentMilitaryId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify({ firstName, lastName, middleName, rank, salary, dateEnlisted, phone, contract })
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
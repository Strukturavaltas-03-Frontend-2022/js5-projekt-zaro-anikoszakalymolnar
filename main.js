const url = 'http://localhost:3000/users';
let editMode = false;

const isValid = (name, email, adress) => {
    if (name === '') {
        alert('A név nincs megadva');
        return false;
    }
    const emailPatter = /\S+@\S+\.\S+/;
    if (!emailPatter.test(email)) {
        alert('Az email nem megfelelp formátumú');
        return false;
    }
    if (adress === '') {
        alert('A cím nincs megadva');
        return false;
    }
    return true;
}

const getusers = async () => {
    const response = await fetch(url);
    const users = await response.json();
    const tBody = document.querySelector('table tbody');
    tBody.innerHTML = '';

    const tr = document.createElement('tr');
    tr.style.backgroundColor = "yellowgreen";
    tBody.appendChild(tr);
    const id = document.createElement('td');
    tr.appendChild(id);

    const name = document.createElement('td');
    tr.appendChild(name);
    const nameInput = document.createElement('input');
    name.appendChild(nameInput);
    nameInput.type = 'text';

    const email = document.createElement('td');
    tr.appendChild(email);
    const emailInput = document.createElement('input');
    email.appendChild(emailInput);
    emailInput.type = 'text';

    const address = document.createElement('td');
    tr.appendChild(address);
    const adressInput = document.createElement('input');
    address.appendChild(adressInput);
    adressInput.type = 'text';

    const buttons = document.createElement('td');
    tr.appendChild(buttons);
    const newButton = document.createElement('button');
    newButton.textContent = 'New';
    buttons.appendChild(newButton);

    newButton.addEventListener('click', async () => {
        if (!isValid(nameInput.value,
            emailInput.value,
            adressInput.value))
            return;

        const data = {
            "name": nameInput.value,
            "emailAddress": emailInput.value,
            "address": adressInput.value
        };
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        await getusers();
    });

    users.forEach(user => {
        const tr = document.createElement('tr');
        tBody.appendChild(tr);

        const id = document.createElement('td');
        tr.appendChild(id);
        id.textContent = user.id;

        const name = document.createElement('td');
        tr.appendChild(name);
        const nameInput = document.createElement('input');
        name.appendChild(nameInput);
        nameInput.value = user.name;
        nameInput.readOnly = true;
        nameInput.type = 'text';

        const email = document.createElement('td');
        tr.appendChild(email);
        const emailInput = document.createElement('input');
        email.appendChild(emailInput);
        emailInput.value = user.emailAddress;
        emailInput.readOnly = true;
        emailInput.type = 'text';

        const address = document.createElement('td');
        tr.appendChild(address);
        const adressInput = document.createElement('input');
        address.appendChild(adressInput);
        adressInput.value = user.address;
        adressInput.readOnly = true;
        adressInput.type = 'text';

        const buttons = document.createElement('td');
        tr.appendChild(buttons);
        const buttonsDiv = document.createElement('div');
        buttons.appendChild(buttonsDiv);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.hidden = false;
        buttonsDiv.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.hidden = false;
        buttonsDiv.appendChild(deleteButton);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.hidden = true;
        buttonsDiv.appendChild(saveButton);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.hidden = true;
        buttonsDiv.appendChild(cancelButton);

        user.handleClick = function () {

            deleteButton.addEventListener('click', async () => {
                if (editMode) {
                    alert('Először be kell fejezned az aktuális szerkesztést');
                    return;
                }
                await fetch(url + `/${this.id}`, {
                    method: 'DELETE',
                });
                // alert(`${this.name} deleted!`);
                // await getusers();
                tr.remove();
            });

            editButton.addEventListener('click', async () => {
                if (editMode) {
                    alert('Először be kell fejezned az aktuális szerkesztést');
                    return;
                }

                nameInput.readOnly = false;
                emailInput.readOnly = false;
                adressInput.readOnly = false;
                editButton.hidden = true;
                deleteButton.hidden = true;
                saveButton.hidden = false;
                cancelButton.hidden = false;
                tr.style.backgroundColor = "yellow";
                editMode = true;
            });

            cancelButton.addEventListener('click', async () => {
                editMode = false;
                await getusers();
            });

            saveButton.addEventListener('click', async () => {
                if (!isValid(nameInput.value,
                    emailInput.value,
                    adressInput.value))
                    return;

                const data = {
                    "id": this.id,
                    "name": nameInput.value,
                    "emailAddress": emailInput.value,
                    "address": adressInput.value
                };
                await fetch(url + `/${this.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                nameInput.readOnly = true;
                emailInput.readOnly = true;
                adressInput.readOnly = true;
                editButton.hidden = false;
                deleteButton.hidden = false;
                saveButton.hidden = true;
                cancelButton.hidden = true;
                tr.style.backgroundColor = null;
                editMode = false;
            });

        };
        user.handleClick();
    });
};

await getusers();

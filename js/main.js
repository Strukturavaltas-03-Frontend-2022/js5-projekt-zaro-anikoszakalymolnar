import isValid from "./validate.js";
import showAlert from "./alert.js";
import { url, getUsers, addUser, deleteUser, updateUser } from "./fetch.js";

// szerkesztő mód
let editMode = false;

// td elem hozzáadása
const addCol = (tr) => {
    const col = document.createElement('td');
    tr.appendChild(col);
    return col;
}

// input mező hozzáadása
const addInputCol = (col) => {
    const input = document.createElement('input');
    col.appendChild(input);
    input.type = 'text';
    return input;
}

// gomb hozzáadása
const addButton = (col, text) => {
    const button = document.createElement('button');
    button.textContent = text;
    col.appendChild(button);
    return button;
}


// első szerkesztő sor létrehozása
const createEditRow = (tBody) => {

    const tr = document.createElement('tr');
    tr.style.backgroundColor = "yellowgreen";
    tBody.appendChild(tr);
    let td = addCol(tr);

    td = addCol(tr);
    const nameInput = addInputCol(td);
    td = addCol(tr);
    const emailInput = addInputCol(td);
    td = addCol(tr);
    const adressInput = addInputCol(td);
    td = addCol(tr);
    const newButton = addButton(td, "New");

    // új elem hozzáadása
    newButton.addEventListener('click', async () => {

        // feltöltés az inputokból
        const user = {
            "name": nameInput.value,
            "emailAddress": emailInput.value,
            "address": adressInput.value
        };

        // adatok ellenőrzése
        if (!isValid(user)) return;


        try {
            // új user felvitele
            await addUser(user);
            showAlert('Adding the new user is successful', 'alert-success');

            // inputok törlése
            nameInput.value = "";
            emailInput.value = "";
            adressInput.value = "";

            // utolsó elem lekérdezése, majd első helyre illesztése
            const users = await getUsers();
            const lastUser = users[users.length - 1];
            createUserRow(tBody, lastUser);
            tBody.insertBefore(tBody.children[tBody.children.length - 1], tBody.children[1]);
            tBody.children[tBody.children.length - 1].remove();
        }
        catch
        {
            showAlert('Error, failed to add item', 'alert-danger');
        }

    });
}

// user sorok gombokkal
const createUserRow = (tBody, user) => {

    const tr = document.createElement('tr');
    tBody.appendChild(tr);

    let td = addCol(tr);
    td.textContent = user.id;

    // minden input read-only, hogy ne lehesen szerkeszteni
    td = addCol(tr);
    const nameInput = addInputCol(td);
    nameInput.value = user.name;
    nameInput.readOnly = true;
    nameInput.type = 'text';

    td = addCol(tr);
    const emailInput = addInputCol(td);
    emailInput.value = user.emailAddress;
    emailInput.readOnly = true;
    emailInput.type = 'text';

    td = addCol(tr);
    const adressInput = addInputCol(td);
    adressInput.value = user.address;
    adressInput.readOnly = true;
    adressInput.type = 'text';

    td = addCol(tr);
    const buttonsDiv = document.createElement('div');
    td.appendChild(buttonsDiv);
    const editButton = addButton(buttonsDiv, 'Edit');
    const deleteButton = addButton(buttonsDiv, 'Delete');
    const saveButton = addButton(buttonsDiv, 'Save');
    const cancelButton = addButton(buttonsDiv, 'Cancel');

    // csak a megfelelő gombok legyenek láthatók
    editButton.hidden = false;
    deleteButton.hidden = false;
    saveButton.hidden = true;
    cancelButton.hidden = true;

    // userhez tartozó események
    user.handleClick = function () {

        // törlés
        deleteButton.addEventListener('click', async () => {
            // ha szerkesztés üzemmódban vagyunk, akkor nem enged más műveletet
            if (editMode) {
                showAlert('First, you must finish the current edit', 'alert-info');
                return;
            }
            // user törlése json-ból
            deleteUser(user);
            // user törlése a táblából
            tr.remove();
        });

        // szerkesztés
        editButton.addEventListener('click', async () => {
            // ha szerkesztés üzemmódban vagyunk, akkor nem enged más műveletet
            if (editMode) {
                showAlert('First, you must finish the current edit', 'alert-info');
                return;
            }
            // inputok írhatóvá tétele
            nameInput.readOnly = false;
            emailInput.readOnly = false;
            adressInput.readOnly = false;
            // csak a megfelelő gombok legyenek láthatók
            editButton.hidden = true;
            deleteButton.hidden = true;
            saveButton.hidden = false;
            cancelButton.hidden = false;
            tr.style.backgroundColor = "yellow";
            // szerkesztő mód
            editMode = true;
        });

        // mégse művelet
        cancelButton.addEventListener('click', async () => {
            // visszaírjuk az eredeti adatokat
            nameInput.value = user.name;
            emailInput.value = user.emailAddress;
            adressInput.value = user.address;
            // inputok csak olvashatóvá tétele
            nameInput.readOnly = true;
            emailInput.readOnly = true;
            adressInput.readOnly = true;
            // csak a megfelelő gombok legyenek láthatók
            editButton.hidden = false;
            deleteButton.hidden = false;
            saveButton.hidden = true;
            cancelButton.hidden = true;
            tr.style.backgroundColor = null;
            // nincs szerkesztés, újra használható a többi gomb
            editMode = false;
        });

        // mentés művelet
        saveButton.addEventListener('click', async () => {
            // adatok módosítása
            const data = {
                "id": user.id,
                "name": nameInput.value,
                "emailAddress": emailInput.value,
                "address": adressInput.value
            };

            // Adatok ellenőrzése
            // ha nem jó, akkor továbbra is szerkesztő módban maradunk
            if (!isValid(data)) return;

            // user módosítása
            updateUser(data);

            // inputok csak olvashatóvá tétele
            nameInput.readOnly = true;
            emailInput.readOnly = true;
            adressInput.readOnly = true;
            // csak a megfelelő gombok legyenek láthatók
            editButton.hidden = false;
            deleteButton.hidden = false;
            saveButton.hidden = true;
            cancelButton.hidden = true;
            tr.style.backgroundColor = null;
            // nincs szerkesztés, újra használható a többi gomb
            editMode = false;
        });

    };
    user.handleClick();
}

// init
const init = async () => {
    // userek lekérdezése
    const users = await getUsers();
    // ha nem tudta lekérdezni kilép
    if (users == null) return;

    // táblázat megkereséaew
    const tBody = document.querySelector('table tbody');
    tBody.innerHTML = '';

    // első szerkesztő sor hozzáadása
    createEditRow(tBody);

    // user sorok hozzáadása
    users.forEach(user => {
        createUserRow(tBody, user);
    });
};

await init();

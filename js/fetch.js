import showAlert from "./alert.js";

let url = 'http://localhost:3000/users';

// userek lekérdezése
const getUsers = async () => {
    try {
        const response = await fetch(url);
        const users = await response.json();
        return users;
    }
    catch {
        showAlert('Start the json server!', 'alert-warning');
        return null; //ha nincs kapcsolat
    }

}

// user hozzáadása
const addUser = async (user) => {
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
}

// user törlése
const deleteUser = async (user) => {
    await fetch(url + `/${user.id}`, {
        method: 'DELETE',
    });
}

// user módosítása
const updateUser = async (user) => {
    await fetch(url + `/${user.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
}

export {
    url,
    getUsers,
    addUser,
    deleteUser,
    updateUser
};


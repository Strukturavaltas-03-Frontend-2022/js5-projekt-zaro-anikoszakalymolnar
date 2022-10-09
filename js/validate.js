import showAlert from "./alert.js";

// Név ellenőrzése (https://regex101.com/)
const isValidName = (user) => {
    const namePatter1 = /^([A-Ű/-][a-ű]* ){1,10}[A-Ű][a-ű]*$/;
    const namePatter2 = /^[A-Ű][a-ű]{2,9}-[A-Ű][a-ű]{2,9} *[A-Ű][a-ű]{2,9}$/;
    return namePatter1.test(user.name) || namePatter2.test(user.name);
};

// Email ellenőrzése
const isValidEmail = (user) => {
    const emailPatter = /\S+@\S+\.\S+/;
    return emailPatter.test(user.emailAddress);
};

// Cím ellenőrzése
const isValidaddress = (user) => {
    const addressPatter1 = /^[1-9]{1,9} *[A-Z][a-z]{2,9} *[A-Z][a-z]{2,9}$/; //4 Schurz Pass
    const addressPatter2 = /^[1-9]{1,9} *[A-Z][a-z]{2,9} *[A-Z][a-z]{2,9} *[A-Z][a-z]{2,9}$/; //44 John Wall Court
    const addressPatter3 = /^[1-9]{1,9} *[1-9]{1,9}[a-z]{1,9} *[A-Z][a-z]{2,9}$/; //8 3rd Crossing
    const addressPatter4 = /^[1-9][0-9]{1,9} *[A-Z][a-z]{1,9} *[A-Z][a-z]{2,9} *[A-Z,a-z]{2,9} [1-9,\-]*$/; //1055 Budapest Havas utca 1-3
    return addressPatter1.test(user.address) || addressPatter2.test(user.address)
        || addressPatter3.test(user.address) || addressPatter4.test(user.address);
};


// Adatok ellenőrzése
const isValid = (user) => {
    if (!isValidName(user)) {
        showAlert('The name is not valid!', 'alert-danger');
        return false;
    }
    if (!isValidEmail(user)) {
        showAlert('The e-mail is not valid! for example: tom@gmail.com', 'alert-danger');
        return false;
    }
    if (!isValidaddress(user)) {
        showAlert('The address is not valid! for example: 22 2nd Street or 793 Hudson Park', 'alert-danger');
        return false;
    }
    return true;
}

export default isValid;
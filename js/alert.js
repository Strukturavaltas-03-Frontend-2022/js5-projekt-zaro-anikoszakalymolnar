//alert box
//típusok: alert-danger, alert-success, alert-info, alert-warning
const showAlert = (text, alertType) => {
    const alertbox = document.querySelector(".alert-box");
    const alert = document.createElement("div");
    alertbox.appendChild(alert);
    alert.classList.add("alert");
    alert.classList.add(alertType);
    alert.innerHTML = text;
    alert.addEventListener("transitionend", () => {
        alert.remove();
    });
    setTimeout(() => {
        alert.style.opacity = 0;
    }, 5000)
}

export default showAlert;
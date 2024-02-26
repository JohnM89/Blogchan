function toggleEditForm(type, id) {
    var form = document.getElementById(`edit-${type}-form-${id}`);
    if (form.style.display === "none") {
        form.style.display = "block";
    } else {
        form.style.display = "none";
    }
}

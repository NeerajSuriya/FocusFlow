function login(role) {
    localStorage.setItem("userRole", role);
    if (role === "student") {
        window.location.href = "student/index.html";
    } else {
        window.location.href = "teacher/index.html";
    }
}

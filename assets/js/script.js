document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.menu-btn');
    const navigation = document.querySelector('.navigation');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navigation.classList.toggle('active');
    });

    // Añadir el active a los links para que quede la linea marcada

    const links = document.querySelectorAll('.navigation-items a');
    const currentPath = window.location.pathname.split('/').pop();

    links.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
});


window.addEventListener('load', function () {
    var usuarioAlmacenado = localStorage.getItem('username');
    var enlaceRegistrarse = document.getElementById('registerLink');
    var enlaceLogin = document.getElementById('loginLink');
    var enlaceLogout = document.getElementById('logoutLink');
    let enlaceUser = document.getElementById('userLink');

    if (usuarioAlmacenado) {
        // Usuario logueado: Ocultar 'Registrarse' y 'Login', mostrar 'Cerrar sesión'
        if (enlaceRegistrarse) enlaceRegistrarse.style.display = 'none';
        if (enlaceLogin) enlaceLogin.style.display = 'none';
        if (enlaceLogout) enlaceLogout.style.display = 'inline';
        if (enlaceUser) enlaceUser.style.display = 'inline';
    } else {
        // Usuario no logueado: Mostrar 'Registrarse' y 'Login', ocultar 'Cerrar sesión'
        if (enlaceRegistrarse) enlaceRegistrarse.style.display = 'inline';
        if (enlaceLogin) enlaceLogin.style.display = 'inline';
        if (enlaceLogout) enlaceLogout.style.display = 'none';
    }

    if (enlaceLogout) {
        enlaceLogout.addEventListener('click', function (event) {
            event.preventDefault();
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            window.location.href = '../index.html';
        });
    }
});

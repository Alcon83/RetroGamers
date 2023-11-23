function crearUsuario(nick, name, password) {
    let newUser = {
        nick: nick,
        name: name,
        password: password
    };


    fetch("https://retrogame-rafa.glitch.me/users/", {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to create player");
            return response.json();
        })
        .then(userData => {
            console.log('Usuario creado:', userData);
        })
        .catch(error => {
            console.error("Error creating player:", error);
        });


}

// Logica para eliminar y mostrar datos en usuario

document.addEventListener('DOMContentLoaded', function () {
    let userId = localStorage.getItem('userId');
    mostrarPartidasPorUsuarioSimon(userId);
    mostrarPartidasPorUsuarioTiktak(userId);
    if (userId) {
        obtenerDatosUsuario(userId);
    }
    document.getElementById('eliminarTablaTiktak').addEventListener('click', function () {
        // Confirmación para la tabla Tiktak
        let confirmacionTiktak = confirm("¿Estás seguro de que deseas eliminar la tabla de Tiktak?");
        if (confirmacionTiktak) {
            eliminarPartidasUsuarioTiktak(userId);
        } else {
            console.log("Eliminación de Tiktak cancelada");
        }
    });

    document.getElementById('eliminarTablaSimon').addEventListener('click', function () {
        // Confirmación para la tabla Simon
        let confirmacionSimon = confirm("¿Estás seguro de que deseas eliminar la tabla de Simon?");
        if (confirmacionSimon) {
            eliminarPartidasUsuarioSimon(userId);
        } else {
            console.log("Eliminación de Simon cancelada");
        }
    });
});


function obtenerDatosUsuario(userId) {
    fetch(`https://retrogame-rafa.glitch.me/users/${userId}`)
        .then(response => response.json())
        .then(userData => {
            document.getElementById('userName').textContent = userData.name;
            document.getElementById('userData').style.display = 'inline';
            document.getElementById('cerrarSesionBtn').style.display = 'inline';
        })
        .catch(error => console.error('Error al obtener datos del usuario:', error));
}
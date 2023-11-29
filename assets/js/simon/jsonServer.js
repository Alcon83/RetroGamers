function crearPartida(siglasName, score, time, userId) {
    let newPlayer = {
        siglasName: siglasName,
        score: score,
        time: time,
        userId: userId

    };


    fetch("https://simon-project.glitch.me/simon/", {
        method: "POST",
        body: JSON.stringify(newPlayer),
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


function mostrarPartidasPorUsuarioSimon(userId) {
    fetch(`https://simon-project.glitch.me/simon/`)
        .then(response => {
            if (!response.ok) throw new Error("Error al obtener las partidas");
            return response.json();
        })
        .then(todasLasPartidas => {
            let partidasParaMostrar;

            if (userId) {
                // Filtrar las partidas para obtener solo aquellas que coinciden con el userId
                partidasParaMostrar = todasLasPartidas.filter(partida => partida.userId === userId);
            } else {
                // Si no se proporciona userId, muestra todas las partidas
                partidasParaMostrar = todasLasPartidas;
            }

            // Ordenar las partidas de mayor a menor puntuación
            partidasParaMostrar.sort((a, b) => b.score - a.score);

            // Procesar y mostrar las partidas filtradas en una tabla
            console.log('Partidas:', partidasParaMostrar);
            crearTablaPartidasSimon(partidasParaMostrar, userId);
        })
        .catch(error => {
            console.error("Error al cargar las partidas:", error);
        });
}

function crearTablaPartidasSimon(partidas, userId) {
    let mostrarColumnaAcciones = userId ? '<th>Acciones</th>' : '';
    let tabla = `<table border="1"><tr><th>Jugador</th><th>Puntuación</th><th>Tiempo</th>${mostrarColumnaAcciones}</tr>`;

    partidas.forEach(partida => {
        let columnaAcciones = userId ? `<td><button onclick="eliminarPartidaSimon('${partida.id}')">Eliminar</button></td>` : '';
        tabla += `<tr>
                    <td>${partida.siglasName}</td>
                    <td>${partida.score}</td>
                    <td>${partida.time}</td>
                    ${columnaAcciones}
                  </tr>`;
    });


    tabla += '</table>';
    document.getElementById('tablaPartidasSimon').innerHTML = tabla;
}

function eliminarPartidasUsuarioSimon(userId) {
    // Primero obtén todas las partidas
    fetch(`https://simon-project.glitch.me/simon/`)
        .then(response => response.json())
        .then(todasLasPartidas => {
            // Filtra las partidas por userId
            const partidasDelUsuario = todasLasPartidas.filter(partida => partida.userId === userId);

            // Elimina cada partida individualmente
            partidasDelUsuario.forEach(partida => {
                fetch(`https://simon-project.glitch.me/simon/${partida.id}`, {
                    method: "DELETE"
                })
                    .then(response => {
                        if (!response.ok) throw new Error("Error al eliminar una partida");
                    })
                    .then(data => {
                        window.location.reload();
                    })
                    .catch(error => {
                        console.error("Error al eliminar una partida:", error);
                    });
            });

            // Limpia la tabla del DOM
            document.getElementById('tablaPartidasSimon').innerHTML = '';
        })
        .catch(error => {
            console.error("Error al obtener partidas:", error);
        });
}

function eliminarPartidaSimon(partidaId) {
    fetch(`https://simon-project.glitch.me/simon/${partidaId}`, {
        method: "DELETE"
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al eliminar la partida");
            return response.json();
        })
        .then(data => {
            alert('Partida eliminada:', data);
            window.location.reload();
        })
        .catch(error => {
            console.error("Error al eliminar partida:", error);
        });
}

function eliminarTablaSimon() {
    document.getElementById('tablaPartidasSimon').innerHTML = '';
}
function crearPartida(nombreJugador, ganadasRonda, ganadasPartida, PerdidaRonda, PerdidaPartidas, empate, userId) {
    let newPlayer = {
        player: nombreJugador,
        ganadasRonda: ganadasRonda,
        ganadasPartida: ganadasPartida,
        PerdidaRonda: PerdidaRonda,
        PerdidaPartidas: PerdidaPartidas,
        empate: empate,
        userId: userId
    };


    fetch("https://tiktaktoe-project.glitch.me/players", {
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
        .then(playerData => {
            console.log('Player created:', playerData);
        })
        .catch(error => {
            console.error("Error creating player:", error);
        });


}
function mostrarPartidasPorUsuarioTiktak(userId) {
    fetch(`https://tiktaktoe-project.glitch.me/players/`)
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
            crearTablaPartidasTiktak(partidasParaMostrar, userId);
        })
        .catch(error => {
            console.error("Error al cargar las partidas:", error);
        });
}

function crearTablaPartidasTiktak(partidas, userId) {
    let mostrarColumnaAcciones = userId ? '<th>Acciones</th>' : '';
    let tabla = `<table border="1"><tr><th>Jugador</th><th>Rondas Ganadas</th><th>Rondas Perdidas</th><th>Partidas Perdidas</th>${mostrarColumnaAcciones}</tr>`;

    partidas.forEach(partida => {
        let columnaAcciones = userId ? `<td><button onclick="eliminarPartidaTiktak('${partida._id}')">Eliminar</button></td>` : '';
        tabla += `<tr>
                    <td>${partida.username}</td>
                    <td>${partida.ganadasRonda}</td>
                    <td>${partida.PerdidaRonda}</td>
                    <td>${partida.PerdidaPartidas}</td>
                    ${columnaAcciones}
                  </tr>`;
    });

    tabla += '</table>';
    document.getElementById('tablaPartidasTiktak').innerHTML = tabla;
}


function eliminarPartidaTiktak(partidaId) {
    fetch(`https://tiktaktoe-project.glitch.me/players/${partidaId}`, {
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

function eliminarPartidasUsuarioTiktak(userId) {
    // Primero obtén todas las partidas
    fetch(`https://tiktaktoe-project.glitch.me/players/`)
        .then(response => response.json())
        .then(todasLasPartidas => {
            // Filtra las partidas por userId
            const partidasDelUsuario = todasLasPartidas.filter(partida => partida.userId === userId);

            // Elimina cada partida individualmente
            partidasDelUsuario.forEach(partida => {
                fetch(`https://tiktaktoe-project.glitch.me/players/${partida.id}`, {
                    method: "DELETE"
                })
                    .then(response => {
                        if (!response.ok) throw new Error("Error al eliminar una partida");
                    })
                    .then(data => {
                        alert('Partidas eliminada:', data);
                        window.location.reload();
                    })
                    .catch(error => {
                        console.error("Error al eliminar una partida:", error);
                    });
            });

            // Limpia la tabla del DOM
            document.getElementById('tablaPartidasTiktak').innerHTML = '';
        })
        .catch(error => {
            console.error("Error al obtener partidas:", error);
        });
}
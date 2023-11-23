// Variables globales
let turn = "X";
let isGameOver = false;
let nombreJugadorX = "X";
let nombreJugadorO = "O";
let movimentsJugador1 = 0;
let movimentsJugador2 = 0;
let ganadasJugador1 = 0;
let ganadasJugador2 = 0;
let ganadasTotals1 = 0;
let ganadasTotals2 = 0;
let ronda = 0;
let empates = 0;
let empatsTotals = 0;
let numeroPartidas;
let historialPartidas = [];
let guanyador = "";
let esModoSinglePlayer = false;
let ultimoInicio = "X";
let winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];
let levelMode = "";
let winsChartInstance;
let perdidaRonda1 = 0;
let perdidaPartidas1 = 0;
let perdidaRonda2 = 0;
let perdidaPartidas2 = 0;


// Funcions de la lògica del joc
document.addEventListener('DOMContentLoaded', function () {
    // Codi de inicialització
    let form1 = document.querySelector('section:first-of-type form');
    let singlePlayerSection = document.getElementById('singlePlayerSection');
    let multiplayerSection = document.getElementById('multiplayerSection');

    let game = document.getElementById('Tic-Tac-Toe');
    let cardSection = document.querySelector('.card');


    // Función que maneja el envío del primer formulario
    document.getElementById('modeGame').onsubmit = function (e) {
        e.preventDefault(); // Prevenir el envío real del formulario

        // Dependiendo de la selección, mostrar la sección apropiada y ocultar el formulario
        let playerMode = document.querySelector('input[name="playerMode"]:checked').value;
        //Arreplega el numero de partides
        let inputNumeroPartidas = parseInt(document.getElementById('numeroPartidas').value, 10);
        numeroPartidas = isNaN(inputNumeroPartidas) ? 0 : inputNumeroPartidas;
        numeroPartidas = inputNumeroPartidas;
        // Depenent de la selecció mostra una secció o una altra
        document.querySelector("#remainingGames").innerHTML = "Credits: " + numeroPartidas;
        if (playerMode === 'singlePlayer') {
            // Mostrar secció per a jugador únic
            singlePlayerSection.style.display = 'block';
            multiplayerSection.style.display = 'none';
        } else {
            // Mostrar secció per a múltiples jugadors
            multiplayerSection.style.display = 'block';
            singlePlayerSection.style.display = 'none';
        }

        // Ocultar el formulario inicial
        form1.style.display = 'none';
        cardSection.style.display = 'none';
    };

    // Formulari single Player
    document.getElementById('singlePlayerForm').onsubmit = function (e) {
        e.preventDefault();

        // Establir el nom del jugador, habilitar el modo single player
        nombreJugadorX = document.getElementById('nombreJugadorXSingle').value || "Jugador X";
        esModoSinglePlayer = true;
        singlePlayerSection.style.display = 'none';

        // Preparar el tablero i el joc
        game.style.display = 'block';
        document.getElementById('player1').textContent = nombreJugadorX;
        document.getElementById('player2').textContent = "IA";
        console.log(levelMode);
        turnoIA();
        changeTurn()



    };
    // Preparar el tabler per a multiplayer
    document.getElementById('multiplayerForm').onsubmit = function (e) {
        e.preventDefault();
        nombreJugadorX = document.getElementById('nombreJugadorXMulti').value;
        nombreJugadorO = document.getElementById('nombreJugadorOMulti').value;
        let player1Div = document.getElementById('player1');
        let player2Div = document.getElementById('player2');
        player1Div.textContent = nombreJugadorX;
        player2Div.textContent = nombreJugadorO;

        multiplayerSection.style.display = 'none';
        game.style.display = 'block';
        console.log(nombreJugadorO);

    };
    updateWinsChart();
});


document.getElementById('nova-partida').addEventListener('click', function () {
    location.reload(); // Recargar la página
});

// Permet evitar l'acció per defecte en arrossegar un element. Això és necessari per a la funcionalitat de 'drag and drop'.
function allowDrop(event) {
    event.preventDefault();
    // Només permet l'arrossegament si és el torn correcte (creu per a 'X' i cercle per a 'O').
    if ((turn === "X" && event.target.className.includes("cross")) ||
        (turn === "O" && event.target.className.includes("circle"))) {
        event.preventDefault();
    } else {
        event.preventDefault();
    }
}

// Aquesta funció s'activa quan un element comença a ser arrossegat.
function drag(event) {
    // Permet l'arrossegament només si és el torn correcte.
    if ((turn === "X" && event.target.className.includes("cross")) ||
        (turn === "O" && event.target.className.includes("circle"))) {
        event.dataTransfer.setData("text", event.target.id);
    }
}

// S'executa quan un element arrossegat es deixa caure en una destinació vàlida.
function drop(event) {
    event.preventDefault();
    let data = event.dataTransfer.getData("text");
    let targetElement = document.getElementById(data);
    let dropTarget = event.target.closest(".dropBox");

    // Permet l'acció de deixar caure només si la casella de destí no té cap fill ja.
    if (!dropTarget.firstChild) {
        dropTarget.appendChild(targetElement);
        // Canvia el torn i comprova si hi ha un guanyador.
        changeTurn();
        checked();
    }
}

function changeTurn() {
    if (turn === "X") {
        movimentsJugador1++; // Incrementa els moviments del jugador X
        turn = "O";
        document.querySelector(".bg").style.left = "85px"; // Actualitza l'estil per reflectir el canvi de torn
    } else {
        movimentsJugador2++; // Incrementa els moviments del jugador O
        turn = "X";
        document.querySelector(".bg").style.left = "0"; // Torna l'estil a la seva posició original
    }
}

function removePieceFromDragArea(currentTurn) {
    // Troba i elimina el primer element disponible segons el torn actual
    const pieceType = currentTurn === "X" ? "cross" : "circle";
    const availablePieces = document.querySelectorAll(`.drag .${pieceType}`);
    if (availablePieces.length > 0) {
        availablePieces[0].remove();
    }
}

document.querySelectorAll(".dropBox").forEach(box => {
    box.addEventListener('click', () => {
        if (!isGameOver && !box.firstChild) {
            let piece = turn === "X" ? createCross() : createCircle();
            box.appendChild(piece);
            removePieceFromDragArea(turn); // Elimina la peça després del clic
            changeTurn();
            checked();
            checkDraw();

        }
    });
});

function checked() {

    let boxes = document.querySelectorAll(".dropBox");

    for (let i = 0; i < winConditions.length; i++) {
        let condition = winConditions[i];
        let box0 = boxes[condition[0]].firstChild;
        let box1 = boxes[condition[1]].firstChild;
        let box2 = boxes[condition[2]].firstChild;

        if (box0 && box1 && box2 &&
            box0.className === box1.className &&
            box0.className === box2.className) {

            isGameOver = true;
            let winner = box0.className.includes("cross") ? "X" : "O";

            if (winner == "X") {
                guanyador = nombreJugadorX;
                ganadasJugador1++;
                perdidaRonda2++;
            } else if (winner == "O") {
                guanyador = nombreJugadorO;
                ganadasJugador2++;
                perdidaRonda1++;
            } else {
                empates++;

            }
            document.querySelector("#results").innerHTML = `Guanyador de la ronda: ${guanyador}`;
            document.querySelector("#play-again").style.display = "inline";
            document.querySelector("#nova-partida").style.display = "inline";
            updateAndDisplayGameCount()
            // Pots canviar l'estil de les caselles guanyadores aquí
            condition.forEach(index => {
                boxes[index].style.backgroundColor = "rgba(169, 13, 196, 0.468)";
                boxes[index].style.color = "#000";
            });
            updateWinsChart();

            break;
        }
    }
}

function checkDraw() {

    if (!isGameOver) {
        let boxes = document.querySelectorAll(".dropBox");
        let isDraw = true;

        // Revisar  totes les caixes
        for (let box of boxes) {
            if (!box.firstChild) {
                isDraw = false;
                break; // Si alguna box esta plena no es empat
            }
        }

        // Si totes esta plenes es que es empat
        if (isDraw) {
            isGameOver = true;
            guanyador = "Empate";
            document.querySelector("#results").innerHTML = "Empate";
            document.querySelector("#play-again").style.display = "inline";
            document.querySelector("#nova-partida").style.display = "inline";
            updateAndDisplayGameCount();
            empates++;

            updateWinsChart();

        }
    }
}


document.querySelector("#play-again").addEventListener("click", () => {
    isGameOver = false;

    // Establecer el turno inicial basado en el último inicio
    turn = ultimoInicio;

    // Actualiza la interfaz para reflejar el turno inicial
    document.querySelector(".bg").style.left = turn === "X" ? "0" : "85px";

    // Restablece los contadores de movimiento y actualiza la interfaz
    movimentsJugador1 = 0;
    movimentsJugador2 = 0;
    document.querySelector("#results").innerHTML = "";

    // Oculta los botones y limpia el tablero
    document.querySelector("#play-again").style.display = "none";
    document.querySelector("#nova-partida").style.display = "none";

    const boxes = document.querySelectorAll(".dropBox");
    boxes.forEach(box => {
        if (box.firstChild) {
            box.removeChild(box.firstChild);
        }
        box.style.removeProperty("background-color");
        box.style.color = "#fff";
    });

    // Reiniciar las piezas en la zona de arrastre
    resetDraggablePieces();

    // Si es el turno de la IA, hacer que juegue
    if (esModoSinglePlayer && turn === "O") {
        setTimeout(turnoIA, 500);
    }
});

function resetDraggablePieces() {
    // Seleccionar todos los dragBox para cruz y círculo
    const dragBoxesCross = document.querySelectorAll(".drag .dragBox .cross");
    const dragBoxesCircle = document.querySelectorAll(".drag .dragBox .circle");

    // Eliminar todas las piezas existentes
    dragBoxesCross.forEach(box => box.remove());
    dragBoxesCircle.forEach(box => box.remove());

    // Crear y agregar nuevas piezas de cruz
    for (let i = 0; i < 5; i++) {
        let newCross = createCross();
        newCross.id = `cross${i + 1}`;
        newCross.setAttribute('draggable', true);
        newCross.setAttribute('ondragstart', 'drag(event)');
        document.querySelectorAll(".drag")[0].children[i].appendChild(newCross);
    }

    // Crear y agregar nuevas piezas de círculo
    for (let i = 0; i < 5; i++) {
        let newCircle = createCircle();
        newCircle.id = `circle${i + 1}`;
        newCircle.setAttribute('draggable', true);
        newCircle.setAttribute('ondragstart', 'drag(event)');
        document.querySelectorAll(".drag")[1].children[i].appendChild(newCircle);
    }
}

function updateAndDisplayGameCount() {
    let gameCount = JSON.parse(localStorage.getItem('gameCount')) || 0;
    let totalGamesRequired = numeroPartidas;

    // Incrementa el contador de juegos y actualiza localStorage
    localStorage.setItem('gameCount', JSON.stringify(++gameCount));

    // Muestra el contador de partidas restantes
    let remainingGames = totalGamesRequired - gameCount;
    document.querySelector("#remainingGames").innerHTML = `Credits: ${remainingGames}`;

    if (gameCount >= totalGamesRequired) {
        checkGlobalWinner();
    }
}

function createCross() {
    let cross = document.createElement("div");
    cross.className = "cross";
    return cross;
}

function createCircle() {
    let circle = document.createElement("div");
    circle.className = "circle";
    return circle;
}



function resetGame() {
    movimentsJugador1 = 0;
    movimentsJugador2 = 0;
    ganadasJugador1 = 0;
    ganadasJugador2 = 0;
    perdidaRonda2 = 0;
    perdidaRonda1 = 0;
    empates = 0;
    isGameOver = false;
    localStorage.removeItem('winners');
    localStorage.removeItem('gameCount');
    let inputNumeroPartidas = parseInt(document.getElementById('numeroPartidas').value, 10);
    numeroPartidas = isNaN(inputNumeroPartidas) ? 0 : inputNumeroPartidas;
    numeroPartidas = inputNumeroPartidas;
}

// Aquesta funció comprova si s'ha assolit el nombre requerit de partides i determina el guanyador global.
function checkGlobalWinner() {
    let gameCount = JSON.parse(localStorage.getItem('gameCount')) || 0;

    // Comprova si s'han jugat el nombre requerit de partides.
    if (gameCount >= numeroPartidas) {
        let winner;
        // Determina el guanyador basant-se en les victòries acumulades.
        if ((ganadasJugador1 || 0) > (ganadasJugador2 || 0)) {
            winner = nombreJugadorX;
            ganadasTotals1++;
            perdidaPartidas2++;
        } else if ((ganadasJugador1 || 0) < (ganadasJugador2 || 0)) {
            winner = nombreJugadorO;
            ganadasTotals2++;
            perdidaPartidas1++;
        } else {
            // En cas d'empat, s'incrementa el contador d'empats globals.
            winner = "Es un empat!";
            empatsTotals++;
        }

        // Mostra una alerta amb el guanyador de la ronda.
        alert("El guanyador de la ronda és: " + winner);
        // Mostra els resultats actuals.
        mostrarResultats(winner);

        // Finalitza la partida actual i prepara el joc per a la següent ronda.
        guardarPartida();
        finalizarPartida();
    }
}

function guardarPartida() {
    let userId = localStorage.getItem('userId');
    crearPartida(nombreJugadorX, ganadasJugador1, ganadasTotals1, perdidaRonda1, perdidaPartidas1, empates, userId);
    crearPartida(nombreJugadorO, ganadasJugador2, ganadasTotals2, perdidaRonda2, perdidaPartidas2, empates);
}

function finalizarPartida() {
    let detallesPartida = {
        ronda: ronda++,
        ganadasJugador1: ganadasJugador1,
        ganadasJugador2: ganadasJugador2,
        ganadasTotals1: ganadasTotals1,
        ganadasTotals2: ganadasTotals2,
        empatsTotals: empatsTotals,
        guanyador: guanyador,

    };
    historialPartidas.push(detallesPartida);
    mostrarResultats();
    resetGame();
    updateWinsChart();

    // Alternar els jugadors
    ultimoInicio = ultimoInicio === "X" ? "O" : "X";
}


function mostrarResultats() {
    let tabla = '<table><tr><th>Ronda</th><th>' + nombreJugadorX + '</th><th>' + nombreJugadorO + '</th><th>Guanyador</th></tr>';

    for (let partida of historialPartidas) {
        tabla += `<tr>
        <td>${partida.ronda}</td>
                    <td>${partida.ganadasJugador1}</td>
                    <td>${partida.ganadasJugador2}</td>
                    <td>${partida.guanyador}</td>
                  </tr>`;
    }

    tabla += '</table>';
    document.getElementById('detallsMoviments').innerHTML = tabla;

}

function changeTurn() {
    if (turn === "X") {
        movimentsJugador1++; // Incrementa els moviments del jugador X
        turn = "O";
        document.querySelector(".bg").style.left = "85px"; // Actualitza l'estil per reflectir el canvi de torn
        if (esModoSinglePlayer) {
            setTimeout(turnoIA, 500); // Esperar un poco antes de que la IA haga su movimiento
        }
    } else {
        movimentsJugador2++; // Incrementa els moviments del jugador O
        turn = "X";
        document.querySelector(".bg").style.left = "0"; // Torna l'estil a la seva posició original
    }
}
function updateWinsChart() {
    if (!winsChartInstance) {  // Si el gráfico no ha sido creado
        var ctx = document.getElementById('winsChart').getContext('2d');
        winsChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [nombreJugadorX, nombreJugadorO, 'Empates'],
                datasets: [{
                    label: 'Partides guanyades',
                    data: [ganadasTotals1, ganadasTotals2, empatsTotals],
                    backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(75, 192, 192, 0.2)'],
                    borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } else {

        winsChartInstance.data.datasets[0].data = [ganadasTotals1, ganadasTotals2, empatsTotals];
        winsChartInstance.update();
    }
}

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
function eliminarTablaTiktak() {
    document.getElementById('tablaPartidasTiktak').innerHTML = '';
}





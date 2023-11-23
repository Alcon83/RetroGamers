
function turnoIA() {
    let levelModeElement = document.querySelector('input[name="dificultat"]:checked');
    levelMode = levelModeElement ? levelModeElement.value : 'normal';
    let move;
    console.log(levelMode);
    if (turn === "O" && !isGameOver) {
        if (levelMode === 'easy') {
            // En el nivel fácil, elegir un movimiento aleatorio
            move = getRandomMove();
        } else {
            // Lógica para niveles que no son 'easy'
            move = getStrategicMove('O', true) ||
                getStrategicMove('O', false) ||
                getCenterMove() ||
                getCornerMove() ||
                getRandomMove();
        }

        if (move !== null) {
            // Colocar la ficha de la IA
            let piezaIA = createCircle();
            document.querySelectorAll(".dropBox")[move].appendChild(piezaIA);
            movimentsJugador2++;
            checked();
            checkDraw();

            // Cambiar el turno al jugador
            turn = "X";
            document.querySelector(".bg").style.left = "0";
        }
    }
}


function getStrategicMove(player, isWinningMove = true) {
    // Usar 'cross' o 'circle' basado en el jugador actual
    const playerClass = player === "X" ? "cross" : "circle";
    const opponentClass = player === "X" ? "circle" : "cross";

    for (const condition of winConditions) {
        // Contar cuántas casillas en la condición actual están ocupadas por el jugador o el oponente
        const count = condition.filter(index => {
            let box = document.querySelectorAll(".dropBox")[index].firstChild;
            return box && box.className === (isWinningMove ? playerClass : opponentClass);
        }).length;

        // Si hay 2 de 3 en una línea y la tercera está vacía, retorna esa casilla
        if (count === 2) {
            const emptyIndex = condition.find(index => {
                let box = document.querySelectorAll(".dropBox")[index].firstChild;
                return !box;
            });
            if (emptyIndex !== undefined) {
                return emptyIndex;
            }
        }
    }

    // Si no hay movimientos estratégicos, retornar null
    return null;
}




// Aquesta funció comprova el centre del taulell.
function getCenterMove() {
    const centerIndex = 4; // Índex de la casella central en un tauler de 3x3.
    const centerBox = document.querySelectorAll(".dropBox")[centerIndex];

    // Comprovar si la casella central està buida
    if (!centerBox.firstChild) {
        return centerIndex; // Retornar l'índex de la casella central si està buida.
    }

    return null; // Retornar null si la casella central no està disponible.
}

// Aquesta funció cerca una casella buida en les cantonades del tauler de 3x3 i retorna el seu índex.
function getCornerMove() {
    const cornerIndices = [0, 2, 6, 8]; // Índexs de les cantonades en un tauler de 3x3.
    const boxes = document.querySelectorAll(".dropBox");

    for (let index of cornerIndices) {
        if (!boxes[index].firstChild) {
            return index; // Retorna l'índex de la cantonada si està buida.
        }
    }

    return null; // Retorna null si cap cantonada està disponible.
}

// Aquesta funció selecciona aleatòriament una casella buida del tauler i retorna el seu índex.
function getRandomMove() {
    let casillasVacias = []; // Crear una llista per a emmagatzemar els índexs de les caselles buides.
    let boxes = document.querySelectorAll(".dropBox");

    // Recorrer totes les caselles del tauler.
    boxes.forEach((box, index) => {
        if (!box.firstChild) {
            casillasVacias.push(index); // Afegir l'índex de la casella buida a la llista.
        }
    });

    // Si hi ha caselles buides, retorna una aleatòriament.
    if (casillasVacias.length > 0) {
        return casillasVacias[Math.floor(Math.random() * casillasVacias.length)];
    }
    return null; // Retorna null si no hi ha caselles buides.
}
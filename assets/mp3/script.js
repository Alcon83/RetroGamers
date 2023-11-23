let moves = [];
let totalMoves = 1;
let ronda = 1;
let currentMoveIndex = 0;
let gameActive = false;
let moveDisplayTime = 500;
let moveIntervalTime = 600;
let movimientos = 4;
let isPatternPlaying = false;
let nombreJugador = "";
let score = 0;
let level = 1;
let startTime;
let time = 0;


document.addEventListener("DOMContentLoaded", function () {

    const carga = document.getElementById('carga');
    const barraCarga = document.getElementById('barraCarga');
    barraCarga.style.width = '100%';
    cargar()
    setTimeout(function () {
        barraCarga.style.display = 'none';
        carga.style.display = 'none';

    }, 1500);
});


//-----------------Carrega de sons----------------
// Esta funció crea un element d'àudio en el document i el retorna. S'utilitza per a carregar els sons del joc.
const cargarSonido = function (fuente) {
    const sonido = document.createElement("audio");
    sonido.src = fuente;
    sonido.setAttribute("preload", "auto");
    sonido.setAttribute("controls", "none");
    sonido.style.display = "none";
    sonido.volume = 0.3;
    document.body.appendChild(sonido);
    return sonido;
}
const sonidos = {
    "1": cargarSonido("public/mp3/1.mp3"),
    "2": cargarSonido("public/mp3/2.mp3"),
    "3": cargarSonido("public/mp3/3.mp3"),
    "4": cargarSonido("public/mp3/4.mp3"),
    "5": cargarSonido("public/mp3/1.mp3"),
    "6": cargarSonido("public/mp3/2.mp3"),
    "7": cargarSonido("public/mp3/3.mp3"),
    "8": cargarSonido("public/mp3/4.mp3"),
    "9": cargarSonido("public/mp3/4.mp3"),
};

// Aquesta funció il·lumina una cel·la específica durant un temps determinat. És cridada durant la seqüència del joc per a mostrar el patró que el jugador ha de seguir.
function illuminate(cellPos, time) {
    setTimeout(() => {
        const cell = document.querySelector('.cell[pos="' + cellPos + '"]');
        cell.classList.add('active');

        let sonido = sonidos[cellPos];
        if (sonido) {
            sonido.currentTime = 0;
            sonido.play();
        }

        setTimeout(() => {
            cell.classList.remove('active');
        }, moveDisplayTime);
    }, time);
}

// Genera un nou moviment aleatori i l'afegeix a l'array de moviments. Aquesta funció s'utilitza per a crear la seqüència de moviments que el jugador ha de memoritzar.
function setMoves() {
    moves.push(Math.floor(Math.random() * movimientos) + 1);
}

// Inicialitza les variables del joc i comença una nova ronda. Oculta el botó d'inici i mostra el missatge del joc.
function startGame() {
    startTime = Date.now();
    moves = [];
    totalMoves = 1;

    currentMoveIndex = 0;
    gameActive = false;
    document.querySelector('#start').style.display = 'none';
    document.querySelector('#message').style.display = 'block';
    sequence();

}

// Mostra la seqüència de moviments que el jugador ha de seguir. Il·lumina cada cel·la de l'array de moviments en l'ordre establit.
function sequence() {
    document.querySelector('#ronda').innerHTML = `Ronda: ${ronda}`;
    document.querySelector('#score').innerHTML = `Score: ${score}`;
    isPatternPlaying = true;
    setMoves();
    document.querySelector('#message').innerHTML = `Simon dice... `;
    currentMoveIndex = 0;

    for (let i = 0; i < moves.length; i++) {
        illuminate(moves[i], moveIntervalTime * i);
    }

    setTimeout(() => {
        isPatternPlaying = false;
        gameActive = true;
        document.querySelector('#message').innerHTML = 'Ahora tu...';
    }, 600 * moves.length);
}

// Aquesta funció es crida quan es fa click en una cel·la. Comprova si el moviment és correcte i gestiona l'estat del joc en conseqüència.
function cellClick(e) {
    if (!gameActive || isPatternPlaying) return;

    let cellPos = e.target.getAttribute('pos');
    illuminate(cellPos, 0)

    if (moves[currentMoveIndex] == cellPos) {
        currentMoveIndex++;
        if (currentMoveIndex === moves.length) {

            totalMoves++;
            ronda++;
            adjustGameDifficulty();
            score += 25 * level;
            setTimeout(() => {
                sequence();
            }, 1000);
        }
    } else {
        gameActive = false;
        const cell = document.querySelector('.cell[pos="' + cellPos + '"]');
        cell.classList.add('error');
        const errorX = cell.querySelector('.error-x');
        errorX.style.display = 'block';
        mostrarGameOver();
        setTimeout(() => {
            location.reload();

        }, 2000);
        ronda = 1;
        setTimeout(() => {
            document.querySelector('#start').style.display = 'block';
            document.querySelector('#message').style.display = 'none';
        }, 1000);
    }
}

// Modifica els paràmetres del joc basant-se en la ronda actual. Augmenta la dificultat a mesura que el jugador avança.
function adjustGameDifficulty() {
    if (ronda === 10) {
        setTimeout(() => {
            level2();
        }, 1000)
    } else if (ronda === 15) {
        setTimeout(() => {
            level3();
        }, 1000)

    } else if (ronda === 20) {
        setTimeout(() => {
            level4();
        }, 1000)
    }
}
document.getElementById('singlePlayerForm').addEventListener('submit', function (event) {
    event.preventDefault();


    nombreJugador = document.getElementById('nombreJugadorXSingle').value;


    let nivelSeleccionado = document.querySelector('input[name="dificultat"]:checked').value;

    switch (nivelSeleccionado) {
        case 'level1':

            ronda = 1;
            break;
        case 'level2':
            ronda = 2;
            level2();
            break;
        case 'level3':
            ronda = 3;
            level3();
            break;
        case 'level4':
            ronda = 5;
            level4();
            break;
    }

    document.getElementById('singlePlayerSection').style.display = 'none';
    document.getElementById('level1').style.display = 'block';


    startGame();
});

// Ajusta els paràmetres per al nivell 2, incrementant la velocitat dels moviments.
function level2() {
    moveDisplayTime = 250;
    moveIntervalTime = 250;
    level = 2;
}

// Ajusta l'aspecte del joc per al nivell 3, afegint més cel·les i canviant la disposició.
function level3() {


    let simonElement = document.getElementById('simon');


    simonElement.style.width = '600px';
    simonElement.style.height = '300px';
    simonElement.style.display = 'grid';
    simonElement.style.gridTemplateColumns = 'repeat(3, 1fr)';
    simonElement.style.gridTemplateRows = 'repeat(2, 1fr)';
    simonElement.style.gap = '15px';
    simonElement.style.borderRadius = '15px';
    level = 3;

    let cells = document.querySelectorAll('.cell');
    cells.forEach(function (cell) {

        cell.style.borderRadius = '15px';
        cell.style.width = 'initial';
        cell.style.height = 'initial';
        cell.style.position = 'initial';

    });
    const newCells = document.querySelectorAll('.cell:nth-child(5), .cell:nth-child(6)');
    newCells.forEach(cell => {
        cell.style.display = 'block';
    });
    movimientos += 2;

}

// Amplia l'escenari del joc per al nivell 4, afegint encara més cel·les.
function level4() {

    let simonElement = document.getElementById('simon');
    simonElement.style.width = '600px';
    simonElement.style.height = '500px';
    simonElement.style.display = 'grid';
    simonElement.style.gridTemplateColumns = 'repeat(3, 1fr)';
    simonElement.style.gridTemplateRows = 'repeat(3, 1fr)';
    simonElement.style.gap = '15px';
    simonElement.style.borderRadius = '15px';

    let cells = document.querySelectorAll('.cell');
    cells.forEach(function (cell) {
        cell.style.borderRadius = '15px';
        cell.style.width = 'initial';
        cell.style.height = 'initial';
        cell.style.position = 'initial';
        cell.style.display = 'block';
    });

    movimientos += 3;
    level = 4;
}

// Mostra un missatge de fi del joc i crida la funció per a actualitzar o crear el jugador amb la seua puntuació i temps.
function mostrarGameOver(time) {

    let endTime = Date.now();
    let timeElapsed = endTime - startTime;
    let timeInMinutes = (timeElapsed / 60000).toFixed(2);
    time += parseFloat(timeInMinutes);

    let popElement = document.querySelector('.pop');

    let gameOverMessage = `Tu puntuación: ${score}, Tiempo jugado: ${timeInMinutes} minutos`;
    document.getElementById('score2').innerHTML = gameOverMessage;
    popElement.style.visibility = 'visible';
    actualizarOCrearJugador(nombreJugador, score, timeInMinutes);

}

// Inicia el joc quan el botó d'inici és premut.
document.querySelector('#start').addEventListener('click', startGame);


// Afegeix l'event de click a totes les cel·les. Aquesta funció és cridada quan un jugador clica en una cel·la del joc.
let cells = Array.from(document.getElementsByClassName('cell'));

cells.forEach(cell => {
    cell.addEventListener('click', cellClick)
})


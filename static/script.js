// Sudoku AI Game
// Variables

let board = [];
let selected = null;

// Start Game

function startGame() {

    // Welcome screen hide
    document.getElementById("welcomeScreen").style.display = "none";

    // Game screen show
    document.getElementById("gameScreen").style.display = "block";

    // Start a new Sudoku
    newGame();
}


// Draw Sudoku Board
function draw(data) {

    const grid = document.getElementById("board");

    grid.innerHTML = "";

    board = data;


    // Create 9 x 9 = 81 cells

    for (let r = 0; r < 9; r++) {

        for (let c = 0; c < 9; c++) {

            let cell = document.createElement("input");

            cell.type = "text";
            cell.maxLength = 1;

            cell.classList.add("cell");


            // If this is a fixed number
            if (data[r][c] !== 0) {

                cell.value = data[r][c];

                cell.disabled = true;

                cell.classList.add("fixed");
            }


            // Select cell
            cell.onclick = function () {

                selected = [r, c];

            };


            // Check input when player types
            cell.oninput = function () {

                let value = cell.value;

                // Allow only 1-9
                if (!/^[1-9]$/.test(value)) {

                    cell.value = "";

                    document.getElementById("status").innerText =
                        "Please enter a number from 1 to 9.";

                    return;
                }

                selected = [r, c];

            };


            grid.appendChild(cell);
        }
    }
}


// New Game
async function newGame() {

    try {

        let response = await fetch("/new");

        let data = await response.json();

        draw(data.board);

        selected = null;

        document.getElementById("status").innerText =
            "New Game Started!";

        document.getElementById("status").className = "success";

    }

    catch (error) {

        document.getElementById("status").innerText =
            "Could not start the game.";

        console.log(error);
    }
}


// Check Player's Answer

async function checkCell() {

    if (selected === null) {

        document.getElementById("status").innerText =
            "Please select a cell first.";

        return;
    }


    let r = selected[0];
    let c = selected[1];


    // Fixed cell cannot be checked
    if (board[r][c] !== 0) {

        document.getElementById("status").innerText =
            "This is a fixed number.";

        return;
    }


    const inputs = document.querySelectorAll("#board input");

    const index = r * 9 + c;

    const cell = inputs[index];

    const value = Number(cell.value);


    // Empty cell
    if (value === 0) {

        document.getElementById("status").innerText =
            "Please enter a number.";

        return;
    }


    try {

        let response = await fetch("/check", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                row: r,
                col: c,
                value: value

            })

        });


        let result = await response.json();


        // Correct answer
        if (result.ok) {

            cell.classList.remove("wrong");

            cell.classList.add("correct");

            document.getElementById("status").innerText =
                "✓ Correct!";

            document.getElementById("status").className =
                "success";

        }


        // Wrong answer
        else {

            cell.classList.remove("correct");

            cell.classList.add("wrong");

            document.getElementById("status").innerText =
                "✗ Invalid Move!";

            document.getElementById("status").className =
                "error";

        }

    }

    catch (error) {

        console.log(error);

        document.getElementById("status").innerText =
            "Something went wrong.";

    }
}


// AI Help
async function helpCell() {

    if (selected === null) {

        document.getElementById("status").innerText =
            "Please select an empty cell first.";

        return;
    }


    let r = selected[0];
    let c = selected[1];


    // Fixed cell
    if (board[r][c] !== 0) {

        document.getElementById("status").innerText =
            "Please select an empty cell.";

        return;
    }


    try {

        let response = await fetch("/help", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                row: r,
                col: c

            })

        });


        let result = await response.json();


        const inputs = document.querySelectorAll("#board input");

        const index = r * 9 + c;

        const cell = inputs[index];


        // Put AI answer
        cell.value = result.value;

        cell.classList.remove("wrong");

        cell.classList.remove("correct");

        cell.classList.add("hint");


        document.getElementById("status").innerText =
            "🤖 AI Help: Correct answer added!";

        document.getElementById("status").className =
            "hint-text";

    }

    catch (error) {

        console.log(error);

        document.getElementById("status").innerText =
            "AI Help is not available.";

    }
}


// Give Up
async function giveUp() {

    try {

        let response = await fetch("/solve");

        let data = await response.json();


        draw(data.board);


        // Make all cells look solved
        const inputs = document.querySelectorAll("#board input");


        for (let i = 0; i < inputs.length; i++) {

            inputs[i].disabled = true;

            inputs[i].classList.add("solved");

        }


        document.getElementById("status").innerText =
            "🏳 Puzzle Solved by AI!";

        document.getElementById("status").className =
            "give-up";

    }

    catch (error) {

        console.log(error);

        document.getElementById("status").innerText =
            "Could not solve the puzzle.";

    }
}
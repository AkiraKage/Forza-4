const parsedUrl = new URL(window.location.href);
let red = parsedUrl.searchParams.get("player1");
let yellow = parsedUrl.searchParams.get("player2");
let currpl = red;


let gameon = true;
let winner;
let jsboard = [];
let rows = 6;
let cols = 7;
let currColumns = [5, 5, 5, 5, 5, 5, 5];
window.onload = () => SetBoard();

function SetBoard() {
    document.getElementById("playerturn").innerText = `È il turno di ${currpl}`;
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < cols; c++) {
            row.push(" ");

            let box = document.createElement("div");
            box.id = r.toString() + "-" + c.toString();
            box.classList.add("box");
            box.addEventListener("click", SetColor);
            box.addEventListener("mouseover", () => Hover(c));
            box.addEventListener("mouseout", () => removeHover(c));
            document.getElementById("gametab").append(box);
        }
        jsboard.push(row);
    }
}

function Hover(c) {
    for (let r = 0; r < rows; r++) {
        let box = document.getElementById(`${r}-${c}`);
        if (jsboard[r][c] === ' ') {
            box.classList.add("highlight");
        }
    }
}

function removeHover(c) {
    for (let r = 0; r < rows; r++) {
        let box = document.getElementById(`${r}-${c}`);
        box.classList.remove("highlight");
    }
}

function SetColor() {
    if (!gameon) return;

    let selected = this.id.split("-");
    let c = parseInt(selected[1]);
    let r = currColumns[c];
    if (r < 0) return;

    let box = document.getElementById(`${r}-${c}`);
    jsboard[r][c] = currpl;

    if (currpl == red) {
        box.classList.add("red");
        currpl = yellow;
    } else {
        box.classList.add("yellow");
        currpl = red;
    }
    document.getElementById("playerturn").innerText = `È il turno di ${currpl}`;

    r--;
    currColumns[c] = r;

    removeHover(c);
    checkif4();
}

function checkif4() {
    // + check
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (jsboard[r][c] != ' ') {
                //horizontal -
                if (c <= cols - 4 &&
                    jsboard[r][c] == jsboard[r][c + 1] && 
                    jsboard[r][c] == jsboard[r][c + 2] && 
                    jsboard[r][c] == jsboard[r][c + 3]) {
                    gameEnd(r, c);
                    return;
                }

                //vertical |
                if (r <= rows - 4 &&
                    jsboard[r][c] == jsboard[r + 1][c] && 
                    jsboard[r][c] == jsboard[r + 2][c] && 
                    jsboard[r][c] == jsboard[r + 3][c]) {
                    gameEnd(r, c);
                    return;
                }
            }
        }
    }

    // x check
    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < cols; c++) {
            if (jsboard[r][c] != ' ') {
                //diagonal \
                if (c <= cols - 4 && 
                    jsboard[r][c] == jsboard[r + 1][c + 1] && 
                    jsboard[r][c] == jsboard[r + 2][c + 2] && 
                    jsboard[r][c] == jsboard[r + 3][c + 3]) {
                    gameEnd(r, c);
                    return;
                }
                //antidiagonal /
                if (c >= 3 && 
                    jsboard[r][c] == jsboard[r + 1][c - 1] && 
                    jsboard[r][c] == jsboard[r + 2][c - 2] && 
                    jsboard[r][c] == jsboard[r + 3][c - 3]) {
                    gameEnd(r, c);
                    return;
                }
            }
        }
    }
}

function gameEnd(r, c) {
    winner = jsboard[r][c];
    gameon = false;
    document.getElementById("playerturn").innerText = `Il vincitore è ${winner}`;
}
const parsedUrl = new URL(window.location.href);
let red = parsedUrl.searchParams.get("player1");
let yellow = parsedUrl.searchParams.get("player2");
let currpl = red;
let turnp = document.getElementById("playerturn");

let registered = [];
let stored = localStorage.getItem("forza4players");
let redindex, yellowindex;

let gameon = true;
let winner;
let jsboard = [];
let rows = 6;
let cols = 7;
let currColumns = [5, 5, 5, 5, 5, 5, 5];

window.onload = () => { SetBoard(), retrieveJSON(), updateVisualStats() };

function retrieveJSON() {
    if (stored) {
        registered = JSON.parse(stored);
        for (let i = 0; i < registered.length; i++) {
            if (registered[i].name == red) redindex = i;
            if (registered[i].name == yellow) yellowindex = i;
        }
        if (redindex == undefined) {
            registerinJSON(red);
            redindex = registered.length - 1;
        }
        if (yellowindex == undefined) {
            registerinJSON(yellow);
            yellowindex = registered.length - 1;
        }

    } else {
        registerinJSON(red);
        redindex = 0;
        registerinJSON(yellow);
        yellowindex = 1;
    }
}

function registerinJSON(name) {
    let player = {
        "name": name,
        "playedgames": 0,
        "wins": 0,
        "losses": 0
    }
    registered.push(player);
    localStorage.setItem("forza4players", JSON.stringify(registered));
}

function SetBoard() {
    turnp.innerText = `È il turno di ${currpl}`;
    turnp.style.color = "red";
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
    turnp.innerText = `È il turno di ${currpl}`;

    if (currpl === red)
        turnp.style.color = "red";
    else turnp.style.color = "yellow";

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

    checkBlank();
}

function checkBlank() {
    for (let i = 0; i < cols; i++)
        if (jsboard[0][i] == " ") return;

    gameon = false;
    turnp.innerText = `Nessuna casella disponibile, gioco terminato`;
    turnp.classList.add("nowinner");
}

function gameEnd(r, c) {
    winner = jsboard[r][c];

    if (winner == red) updateJSONstats(redindex, yellowindex);
    else updateJSONstats(yellowindex, redindex);

    gameon = false;
    turnp.innerText = `Il vincitore è ${winner}`;
    turnp.classList.add("winner");
    updateVisualStats();
}

function updateVisualStats() {
    document.getElementById("inforedp").innerText = `${red}:  ${registered[redindex].wins} vittorie,  ${registered[redindex].losses} sconfitte`;
    document.getElementById("infoyellowp").innerText = `${yellow}:  ${registered[yellowindex].wins} vittorie, ${registered[yellowindex].losses} sconfitte`;
}

function updateJSONstats(winnerindex, loserindex) {
    registered[winnerindex].wins += 1;
    registered[loserindex].losses += 1;
    registered[winnerindex].playedgames += 1;
    registered[loserindex].playedgames += 1;

    localStorage.setItem("forza4players", JSON.stringify(registered));
}

"use strict";

$(document).ready(function () {
    $("td").click(function () {
        move(this, huPlayer);
    });
});

let board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let huPlayer = "O";
let aiPlayer = "X";
let iter = 0;
let round = 0;

function move(element, player) {
    if (board[element.id] != "O" && board[element.id] != "X") {
        round++;
        $(element).text(huPlayer);
        board[element.id] = player;

        if (round > 8) {
            setTimeout(function () {
                reset();
            }, 500);
            return;
        } else {
            round++;
            let index = minimax(board, aiPlayer).index;
            let selector = "#" + index;
            $(selector).text(aiPlayer);
            board[index] = aiPlayer;
            if (winning(board, aiPlayer)) {
                setTimeout(function () {
                    reset();
                }, 500);
                return;
            } else if (round > 8) {
                setTimeout(function () {
                    reset();
                }, 500);
                return;
            }
        }
    }
}

function reset() {
    round = 0;
    board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    $("td").empty();
    [huPlayer, aiPlayer] = [aiPlayer, huPlayer];
    if (aiPlayer === "O") {
        let randomNum = Math.floor((Math.random() * 9));
        let selector = "#" + randomNum;
        board[randomNum] = aiPlayer;
        $(selector).text(aiPlayer);
        round++;
    }
}

function minimax(reboard, player) {
    iter++;
    let array = avail(reboard);
    if (winning(reboard, huPlayer)) {
        return {
            score: -10
        };
    } else if (winning(reboard, aiPlayer)) {
        return {
            score: 10
        };
    } else if (array.length === 0) {
        return {
            score: 0
        };
    }

    let moves = [];
    for (let i = 0; i < array.length; i++) {
        let move = {};
        move.index = reboard[array[i]];
        reboard[array[i]] = player;

        if (player == aiPlayer) {
            let g = minimax(reboard, huPlayer);
            move.score = g.score;
        } else {
            let g = minimax(reboard, aiPlayer);
            move.score = g.score;
        }
        reboard[array[i]] = move.index;
        moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

//available spots
function avail(reboard) {
    return reboard.filter(s => s != "O" && s != "X");
}

// winning combinations
function winning(board, player) {
    if (
        (board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player)
    ) {
        return true;
    } else {
        return false;
    }
}
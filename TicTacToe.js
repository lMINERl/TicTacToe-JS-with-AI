/* eslint-disable no-console */
const { composition, call, justifable } = require('./functional');

const replacer = (fn, value, newValue) => (JSON.stringify(fn) === JSON.stringify(value)) ? newValue : fn;

const sum = (args) => {
    const rslt = args.reduce((v = 0, acc = 0) => { return v + acc });
    return rslt;
}
let Debug = { ShowLogic: false };
let moveStorage = {
    initial: [],
    allMoves: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    turnMove: 0,
    unavilableMoves: [],
    Moves: [[], []],
}

const normalRandDist = (args) => {
    const arr = Array(Number(args))
        .fill()
        .map((v, i, over) => {
            const ac = sum(replacer(over, [], [0]));
            const rslt = Number((Math.random() * (1 - ac)).toFixed(4));
            over.push(rslt);
            return rslt;
        });
    return arr;

}
const storeMoveUsage = (args) => {
    moveStorage.initial.push(args);
    return args;
}
const storeUnavailableMoves = (index, player) => {
    moveStorage.unavilableMoves.push(index);
    moveStorage.Moves[Number(player)].push(index);
}
const chooseFromRandArr = (args) => {

    const avilableMoves = moveStorage.allMoves.filter((v) => {
        if (!moveStorage.unavilableMoves.includes(v))
            return true;
    });
    const lastMove = [...args[0]].filter((v, i) => {
        if (avilableMoves.includes(i))
            return true;
    });

    const rand = Math.random();
    const getIndex = (props) => {
        const rand = Math.random();
        let sum = 0;
        let i = 0;
        while (sum < rand && i < props.length - 1) {
            sum += props[i]
            ++i;
        }
        return avilableMoves[i];
    }
    const index = getIndex([...lastMove]);
    return index;
}
const isValidMove = (index) => {
    if (moveStorage.unavilableMoves.includes(index)) {
        return Object.freeze({ index: index, valid: false });
    } else {
        return Object.freeze({ index: index, valid: true });
    }
}
const isGoal = (player) => {
    return [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [6, 4, 2],
    ].some((v) => {
        return v.every((el) => {
            return moveStorage.Moves[Number(player)].includes(el);
        });
    });
}

// lets player 0 is always the computer while player 1 is human who play random
const improveComputer = (player) => {
    const { initial, Moves } = moveStorage
    const moves = Moves[Number(player)];
    let movesCount = 0;
    for (let index = 1; index < initial.length; index += 2) {
        initial[index] = initial[index].map(v => v - 0.01); //punshment moves
        initial[index][moves[movesCount]] += 0.09; // reward
        movesCount++;
    }
    
    moveStorage = {
        initial: moveStorage.initial,
        allMoves: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        turnMove: 0,
        unavilableMoves: [],
        Moves: [[], []],
    };

}
{
    const makeMove = composition(
        justifable('store move for later plays', storeMoveUsage),
        justifable('initialize state of all tictac position', normalRandDist)
    );
    const move = composition(
        justifable('check the move', isValidMove),
        justifable('select from given array the new position', chooseFromRandArr)
    );

    let count = 0;
    const start = (arr, currentTurn = 0, player = true) => {
        //computer move
        if (isGoal(!player)) {
            console.log(`player ${Number(!player)} wins`);
            if (!player) {
                improveComputer(!player);
            }
            if (count < 10) {
                count++
                // console.log(`imporve computer in game ${count}`);
                start(moveStorage.initial, 0, true);
            }
            return;
        }
        if (moveStorage.unavilableMoves.length !== 9) {
            if (!arr.length || arr.length == currentTurn) {
                call('make moves propability to select from', makeMove, Debug.ShowLogic)(9)
                start(arr, currentTurn, player);
            } else {
                const { index: index, valid: valid } = call('to make computer move ', move, Debug.ShowLogic)(arr[currentTurn]);
                if (valid) {
                    // console.log(`turn ${currentTurn} : player ${Number(player)} computer choose a valid index = ${index}`);
                    call('to block other player from moving to location', storeUnavailableMoves)(index, player);
                    start(arr, currentTurn + 1, !player);
                } else {
                    start(arr, currentTurn, player);
                }
            }
        }

    }
    start(moveStorage.initial);
}

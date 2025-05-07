
let secretCombination = [];
let currentGuess = [];
let attemptsLeft = 12;
let showHistory = true; // Défini selon le choix du joueur
const COLORS = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];

// Lancer la partie après choix utilisateur
function startGame(historyVisible) {
    showHistory = historyVisible;

    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameArea').classList.remove('hidden');

    if (!showHistory) {
        document.getElementById('history').classList.add('hidden');
    }

    generateSecretCombination();
}

// Générer la combinaison secrète
function generateSecretCombination() {
    secretCombination = [];
    for (let i = 0; i < 4; i++) {
        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        secretCombination.push(randomColor);
    }
    console.log("Combinaison secrète:", secretCombination); // Debug
}

// Sélectionner une couleur
function selectColor(color) {
    if (currentGuess.length < 4) {
        currentGuess.push(color);
        displayCurrentGuess();
    }
}

// Afficher la tentative en cours
function displayCurrentGuess() {
    const guessDisplay = document.getElementById('currentGuess');
    guessDisplay.innerHTML = '';
    currentGuess.forEach(color => {
        const colorBox = document.createElement('div');
        colorBox.className = 'w-10 h-10 rounded-full border border-gray-400';
        colorBox.style.backgroundColor = color;
        guessDisplay.appendChild(colorBox);
    });
}

// Soumettre la tentative
function submitGuess() {
    if (currentGuess.length < 4) {
        alert("Vous devez sélectionner 4 couleurs.");
        return;
    }

    const correctPosition = countCorrectPositions(currentGuess);
    const incorrectPosition = countIncorrectPositions(currentGuess);

    const feedbackMessage = `${correctPosition} au bon endroit, ${incorrectPosition} mal placé.`;
    document.getElementById('feedback').innerText = feedbackMessage;

    attemptsLeft--;
    document.getElementById('attemptsLeft').innerText = attemptsLeft;

    if (showHistory) {
        addGuessToHistory(currentGuess, correctPosition, incorrectPosition);
    }

    if (correctPosition === 4) {
        document.getElementById('feedback').innerText = "🎉 Félicitations, vous avez deviné la combinaison !";
        disableGame();
        return;
    } else if (attemptsLeft === 0) {
        document.getElementById('feedback').innerText = "❌ Vous avez perdu ! La combinaison était : " + secretCombination.join(", ");
        disableGame();
        return;
    }

    currentGuess = [];
    displayCurrentGuess();
}

// Compter les bons placements
function countCorrectPositions(guess) {
    let count = 0;
    for (let i = 0; i < 4; i++) {
        if (guess[i] === secretCombination[i]) {
            count++;
        }
    }
    return count;
}

// Compter les mal placés
function countIncorrectPositions(guess) {
    let count = 0;
    let tempSecret = [...secretCombination];
    let tempGuess = [...guess];

    for (let i = 0; i < 4; i++) {
        if (tempGuess[i] === tempSecret[i]) {
            tempGuess[i] = null;
            tempSecret[i] = null;
        }
    }

    for (let i = 0; i < 4; i++) {
        if (tempGuess[i] !== null && tempSecret.includes(tempGuess[i])) {
            count++;
            tempSecret[tempSecret.indexOf(tempGuess[i])] = null;
        }
    }

    return count;
}

// Historique
function addGuessToHistory(guess, correct, incorrect) {
    const historyDiv = document.getElementById('history');
    const entry = document.createElement('div');
    entry.className = 'flex items-center justify-between bg-white p-3 rounded shadow';

    const guessDiv = document.createElement('div');
    guessDiv.className = 'flex gap-2';
    guess.forEach(color => {
        const colorBox = document.createElement('div');
        colorBox.className = 'w-6 h-6 rounded-full border';
        colorBox.style.backgroundColor = color;
        guessDiv.appendChild(colorBox);
    });

    const feedback = document.createElement('div');
    feedback.className = 'text-sm font-medium';
    feedback.innerText = `${correct}✔️ / ${incorrect}❗`;

    entry.appendChild(guessDiv);
    entry.appendChild(feedback);

    historyDiv.prepend(entry);
}

// Rejouer une nouvelle partie
function resetGame() {
    currentGuess = [];
    attemptsLeft = 12;
    document.getElementById('feedback').innerText = '';
    document.getElementById('attemptsLeft').innerText = attemptsLeft;
    document.getElementById('currentGuess').innerHTML = '';
    document.getElementById('history').innerHTML = '';
    document.getElementById('resetBtn').classList.add('hidden');

    if (!showHistory) {
        document.getElementById('history').classList.add('hidden');
    } else {
        document.getElementById('history').classList.remove('hidden');
    }

    generateSecretCombination();

    // Réactiver les couleurs
    document.querySelectorAll('#colorSelection div').forEach(div => {
        const color = div.style.backgroundColor;
        div.onclick = () => selectColor(color);
    });

    // Réactiver le bouton
    const submitBtn = document.querySelector('button[onclick="submitGuess()"]');
    submitBtn.disabled = false;
    submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
}

// Fin de partie
function disableGame() {
    document.querySelectorAll('#colorSelection div').forEach(div => {
        div.onclick = null;
    });
    const submitBtn = document.querySelector('button[onclick="submitGuess()"]');
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    document.getElementById('resetBtn').classList.remove('hidden');
}

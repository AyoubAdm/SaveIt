

// loading screen
export const updateLoadingScreenVisibility = (visible) => {
    const loadingScreen = document.getElementById("homeScreen");
    if (visible) {
      loadingScreen.style.display = "flex";
    } else {
      loadingScreen.style.display = "none";
    }
  };

export const setupMenuScreen = () =>{ // Récupération des éléments HTML
// Création des boutons pour les paramètres
// Récupération des éléments HTML
// Variable pour stocker l'option graphique sélectionnée
let graphics = 'medium';
const menuButtons = document.getElementById('menuButtons');
const modesButton = document.getElementById('modesButton');
const settingsButton = document.getElementById('settingsButton');

// Création des nouveaux boutons
const endlessModeButton = document.createElement('button');
endlessModeButton.id = 'endlessModeButton';
endlessModeButton.className = 'menuButton';
endlessModeButton.textContent = 'Endless Mode';

// Créez un nouvel élément small avec la classe loading-text
const loadingTextElement = document.createElement('small');
loadingTextElement.className = 'loading-text';
loadingTextElement.textContent = 'Loading...';


endlessModeButton.addEventListener('click', () => {
    // Créez un nouvel événement startEndlessMode avec la valeur mise à jour de graphics
    const startEndlessModeEvent = new CustomEvent('startEndlessMode', {
      detail: {
        graphics: graphics,
      }
    });

    // Déclenchez l'événement
    document.dispatchEvent(startEndlessModeEvent);

    menuButtons.style.display = 'none';

    const homeScreen = document.getElementById('homeScreen');
    homeScreen.appendChild(loadingTextElement);
});




const levelsButton = document.createElement('button');
levelsButton.id = 'levelsButton';
levelsButton.className = 'menuButton';
levelsButton.textContent = 'Levels';
levelsButton.classList.add('disabled-button');

const backButton = document.createElement('button');
backButton.id = 'backButton';
backButton.className = 'menuButton';
backButton.textContent = 'Back';

// Création des boutons pour les paramètres
const lowGraphicsButton = document.createElement('button');
lowGraphicsButton.id = 'lowGraphicsButton';
lowGraphicsButton.className = 'menuButton';
lowGraphicsButton.textContent = 'Low Graphics';

// Création du bouton Medium Graphics
const mediumGraphicsButton = document.createElement('button');
mediumGraphicsButton.id = 'mediumGraphicsButton';
mediumGraphicsButton.className = 'menuButton';
mediumGraphicsButton.textContent = 'Medium Graphics';

const highGraphicsButton = document.createElement('button');
highGraphicsButton.id = 'highGraphicsButton';
highGraphicsButton.className = 'menuButton ';
highGraphicsButton.textContent = 'High Graphics';



// Fonction pour afficher les boutons Game Mode et Settings
function showMainMenu() {
    menuButtons.innerHTML = '';
    menuButtons.appendChild(modesButton);
    menuButtons.appendChild(settingsButton);
    modesButton.addEventListener('click', showGameModeMenu);
}

// Fonction pour afficher les boutons Endless Mode, Levels et Back
function showGameModeMenu() {
    menuButtons.innerHTML = '';
    menuButtons.appendChild(endlessModeButton);
    menuButtons.appendChild(levelsButton);
    menuButtons.appendChild(backButton);
    backButton.addEventListener('click', showMainMenu);
}



// Fonction pour gérer la sélection des options graphiques
let selectedGraphicsOption = mediumGraphicsButton;
// Fonction pour gérer la sélection des options graphiques
function handleGraphicsSelection(button) {
    if (selectedGraphicsOption) {
        selectedGraphicsOption.classList.remove('selected');
    }
    selectedGraphicsOption = button;
    selectedGraphicsOption.classList.add('selected');
    graphics = button === lowGraphicsButton ? 'low' : (button === mediumGraphicsButton ? 'medium' : 'high');
}




// Fonction pour afficher les boutons Low Graphics, Medium Graphics, High Graphics et Back
function showSettingsMenu() {
    menuButtons.innerHTML = '';
    menuButtons.appendChild(highGraphicsButton);
    menuButtons.appendChild(mediumGraphicsButton); // Ajout du bouton Medium Graphics
    menuButtons.appendChild(lowGraphicsButton);
    menuButtons.appendChild(backButton);
    backButton.addEventListener('click', showMainMenu);

    // Si une option graphique a déjà été sélectionnée, mettez-la en surbrillance
    if (selectedGraphicsOption) {
        selectedGraphicsOption.classList.add('selected');
    }
}

// Fonction pour gérer la sélection des options graphiques
function handleGraphicsSelection(button) {
    if (selectedGraphicsOption) {
        selectedGraphicsOption.classList.remove('selected');
    }
    selectedGraphicsOption = button;
    selectedGraphicsOption.classList.add('selected');
    graphics = button === lowGraphicsButton ? 'low' : (button === mediumGraphicsButton ? 'medium' : 'high');
}

// Ajout des événements click pour les boutons Low Graphics, Medium Graphics et High Graphics
lowGraphicsButton.addEventListener('click', () => {handleGraphicsSelection(lowGraphicsButton); graphics = 'low'});
mediumGraphicsButton.addEventListener('click', () => {handleGraphicsSelection(mediumGraphicsButton); graphics = 'medium'}); // Ajout de l'événement click pour Medium Graphics
highGraphicsButton.addEventListener('click', () => {handleGraphicsSelection(highGraphicsButton); graphics = 'high'});
// Ajout de l'événement click sur le bouton Settings
settingsButton.addEventListener('click', showSettingsMenu);

// Ajout de l'événement click sur le bouton Game Mode
modesButton.addEventListener('click', showGameModeMenu);


}

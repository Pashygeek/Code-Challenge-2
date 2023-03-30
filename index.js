//Linking the JSON server with Javascript
const BASE_URL = "http://localhost:3000";
const headers = {
    'Content-Type': 'application/json',
};

document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault();
    fetchCharacters();
});


//Fetch characters from db.json then render them or display on our Html
function fetchCharacters() {
    fetch(`${BASE_URL}/characters`, {
        method: 'GET' ,
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((res) => res.json())
    .then(renderCharacters)
    .catch((err) => {
        console.log(err);
    });
}


//Render characters on the Html or Attach characters
function renderCharacters(characters) {
    const listCharactersDiv = document.getElementById('list-characters');
    characters.forEach((character) => {
        //Create a new div element for each character to be used
        const card = document.createElement('div');
        card.innerText = character.name;
        card.classList.add('list-character-item');

        //Add an eventlistener(onclick listener)
        card.addEventListener('click',() => {
            renderCharactersDetails(character);
        });

        //Append each new card to the listCharacterDiv
        listCharactersDiv.appendChild(card);
    });
}


//Render ONE character on the Html
async function renderCharactersDetails(passedCharacters) {
    const response = await fetch(
        `${BASE_URL}/characters/${passedCharacters.id}`,
        {
            method: 'GET',
            headers,
        }
    );
    const character = await response.json();
    const characterDetailsDiv = document.getElementById('character-details');

  //Reset character details div
  characterDetailsDiv.innerHTML = '';

  //Name the element
  const nameParagraph = document.createElement('p');
  nameParagraph.innerText = `Name: ${character.name}`;

  //Image of the element
  const imageElement = document.createElement('img');
  imageElement.src = character.image;
  imageElement.classList.add('character.image');

  //Votes for the element
  const voteParagrapgh = document.createElement('p');
  voteParagrapgh.innerText = `Votes ${character.votes}`;

  //Add Votes Button
  const addVotesButton = document.createElement('button');
  addVotesButton.innerText = 'Add votes';
  addVotesButton.type = 'button';

  //To prevent errors from occuring when pressing vote button
  addVotesButton.addEventListener('click', (e) => {
    e.preventDefault();

    //Add ONE vote to existing votes
    character.votes = character.votes += 1;

    //Outputs updates of character votes in JSON when vote button is pressed
    updateCharactersVotes(character);
  });


//Reset votes button thus when pressed returns to 0
const resetVotesButton = document.createElement('button');
resetVotesButton.innerText = 'Reset Votes';
resetVotesButton.addEventListener('click', (e) => {
    e.preventDefault();
    character.votes = 0;
    resetCharactresVotes(character);
});


//Attach ALL elements
characterDetailsDiv.append(
    nameParagraph,
    imageElement,
    voteParagrapgh,
    addVotesButton,
    resetVotesButton
);
}


//Update the votes of ONE character in JSON
function updateCharactersVotes(character) {
    fetch(`${BASE_URL}/characters/${character.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(character),
    })
    .then((res) => res.json())
    .then((character) => {
        renderCharactersDetails(character);
    })
    .catch((err) => console.log(err));
}


//Reset the votes of ONE character
function resetCharactresVotes(character) {
    fetch(`${BASE_URL}/characters/${character.id}`, {
        method:'PUT',
        headers,
        body: JSON.stringify(character),
    })
    .then((res) => res.json())
        .then((character) => renderCharactersDetails(character))
        .catch((err) => console.log(err));
}
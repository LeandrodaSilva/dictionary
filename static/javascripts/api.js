function search() {
  let container = document.getElementById('container');
  document.querySelector('form').onsubmit = evt => {
    evt.preventDefault();

    let buttonSearch = document.getElementById('button-search');
    let inputSearch = document.getElementById('input-search');

    let btnText = buttonSearch.innerText;

    if (inputSearch.value.length) {
      buttonSearch.innerText = "Loading..."
      axios({
        url: `https://lingua-robot.p.rapidapi.com/language/v1/entries/en/${inputSearch.value}`,
        method: 'get',
        headers: {
          "x-rapidapi-host": "lingua-robot.p.rapidapi.com",
          "x-rapidapi-key": "dd5d35ec84mshb69cd815d38f244p1cbc2fjsn05d4a857dea4" //Retirar no projeto 2 e adicionar ao .env
        },
        withCredentials: true
      })
      .then(resp => {


        let data = resp.data;


        if (data.entries) {
          container.innerHTML = '';
          this.uiBuildCard(container, data.entries);
        }

        buttonSearch.innerText = btnText;
      })
    }

  }
}


function uiBuildCard(container, entries) {
  if (entries.length) {
    entries.map(entrie => {
      let card = '';
      let pronuntiations = '';
      let lexemes = '';

      if (entrie.lexemes) {
        lexemes = this.uiBuildLexemes(entrie.lexemes)
      }

      if (entrie.pronunciations) {
        pronuntiations = this.uiBuildPronuntiations(entrie.pronunciations)
      }

      card = `
        <div class="container-card hover-effect">
            <div class="container-lexemes">${lexemes}</div>
            <div class="container-pronuntiations">${pronuntiations}</div>
        </div> 
      `;

      container.insertAdjacentHTML('beforeend', card);

    })
  } else {
    searchNotFoundCard(container);
  }
}

function searchNotFoundCard(container) {
  container.insertAdjacentHTML(
    'beforeend',
    `
       <div class="container-card hover-effect">
            <h4>Word not found</h4>
       </div>
    `
  );
}

function uiBuildLexemes(lexemes) {
  let definitions = `<h4>Definition</h4>`;


  lexemes.map(lexeme => {
    if (lexeme.senses) {
      lexeme.senses.map(sense => {
        if (sense.definition) {
          definitions += `<p>${sense.definition}</p>`;
        }

      })
    }
  })

  return definitions
}

function uiBuildPronuntiations(pronuntiations) {
  let audio = '';

  pronuntiations.map(pronunciation => {
    if (pronunciation.audio) {
      audio = pronunciation.audio.url;
    }
  });

  return `
        <h4>Pronuntiation:</h4>
        <audio controls="controls">
            <source src="${audio}" type="audio/mp3" />seu navegador não suporta HTML5
        </audio>
    `;
}

// Present input section when clidking 'cat started' button

const start_btn = document.querySelector('.button__start');

const home = document.querySelector('.section__home');
const input = document.querySelector('.section__input');

const content = document.querySelector('#template__content');

start_btn.addEventListener('click', () => {
  invisible(home);
  invisible(input);
});

function invisible(e) {
  e.classList.toggle('invisible');
}

// Fetch api's data

const requestForm = document.querySelector('.request-form');

// This will be implemented later:
// function checkTag(tag) {
//   fetch('https://cataas.com/api/tags')
//     .then((response) => response.json())
//     .then((data) => {
//       if (!data.includes(`${tag}`)) return alert('invalid tag');
//     });
// }

function createBox(url) {
  const template = document.querySelector('#img__template');
  const domFrag = template.content.cloneNode(true);

  domFrag.querySelector('img').src = url;
  content.appendChild(domFrag);
}

function getInputs(tag, filter, text) {
  let tagInput;
  let filterInput;
  let textInput;
  tag ? (tagInput = '/' + tag) : (tagInput = '');
  filter ? (filterInput = '?filter=' + filter) : (filterInput = '');
  text ? (textInput = '/says/' + text) : (textInput = '');
  return fetch(`https://cataas.com/cat${tagInput}${textInput}${filterInput}`)
    .then((response) => {
      createBox(response.url);
    })
    .catch((error) => console.log(error));
}

function getFact() {
  const factInput = document.getElementById('input__fact').checked;
  if (factInput) {
    return fetch('https://cat-fact.herokuapp.com/facts/random')
      .then((response) => response.json())
      .then((data) => console.log(data));
  }
}

requestForm.onsubmit = (event) => {
  event.preventDefault();
  const tag = event.target.elements.input__tag.value;
  const filter = event.target.elements.input__filter.value;
  const text = event.target.elements.input__text.value;
  getInputs(tag, filter, text);

  requestForm.reset();
};

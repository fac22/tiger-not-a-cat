// Present input section when clicking 'cat started' button

const start_btn = document.querySelector('.button__start');
const home = document.querySelector('.section__home');
const input = document.querySelector('.section__input');
const picture = document.querySelector('.section__picture');
const content = document.querySelector('#template__content');
const requestForm = document.querySelector('.request-form');
const tagArea = document.querySelector('#input__tag');
const errorMsg = document.querySelector('.errorMsg');
let counter = 0;

start_btn.addEventListener('click', () => {
  invisible(home);
  invisible(input);
});

function invisible(e) {
  e.classList.toggle('invisible');
}

// Fetch api's data

// This checks if the tag actually exists:
//(instead of the alert we could display an image saying that the tag doesn't exist)
async function checkTag(tag) {
  let checker = true;
  await fetch('https://cataas.com/api/tags')
    .then((response) => response.json())
    .then((data) => {
      if (!data.includes(`${tag.toLowerCase()}`)) checker = false;
    });
  return checker;
}

// This checks if the tag actually exists and should assign a random tag if tag input is empty
// but actually does nothing
// function checkTag(tag) {
//   fetch('https://cataas.com/api/tags')
//     .then((response) => response.json())
//     .then((data) => {
//       if (!data.includes(`${tag}`)) {
//         return alert('Invalid tag!');
//       } else if (tag === null) {
//         tag = data[Math.floor(Math.random() * data.length)];
//         return tag;
//       }
//     });
// }

function createBox(url, fact) {
  const template = document.querySelector('#img__template');
  const domFrag = template.content.cloneNode(true);

  domFrag.querySelector('img').src = url;
  domFrag.querySelector('.cat__fact').innerText = fact;
  content.appendChild(domFrag);

  const figureArr = Array.from(document.querySelectorAll('figure'));
  figureArr[counter].classList.add(`cat__${counter}`);
}

async function getInputs(tag, filter, text) {
  let tagInput;
  let filterInput;
  let textInput;
  tag ? (tagInput = '/' + tag) : (tagInput = '');
  filter ? (filterInput = '?filter=' + filter) : (filterInput = '');
  text ? (textInput = '/says/' + text) : (textInput = '');
  let resultURL;
  await fetch(`https://cataas.com/cat${tagInput}${textInput}${filterInput}`)
    .then((response) => {
      resultURL = response.url;
    })
    .catch((error) => console.log(error));

  return resultURL;
}

async function getFact() {
  const factInput = document.getElementById('input__fact').checked;
  let resultFact;
  if (factInput) {
    await fetch('https://catfact.ninja/fact')
      .then((response) => response.json())
      .then((data) => (resultFact = data.fact));
    return resultFact;
  } else return null;
}

requestForm.onsubmit = async (event) => {
  event.preventDefault();
  const tag = event.target.elements.input__tag.value;
  const filter = event.target.elements.input__filter.value;
  const text = event.target.elements.input__text.value;
  const checkResult = await checkTag(tag);
  if (!checkResult) {
    errorMsg.classList.remove('invisible');
    errorMsg.classList.add('error__visible');
    return tagArea.setAttribute('aria-invalid', !checkResult);
  }
  const imgUrl = await getInputs(tag, filter, text);
  const factText = await getFact();
  createBox(imgUrl, factText);
  picture.classList.remove('invisible');
  picture.classList.add('visible');
  input.classList.remove('visible'); // remove a form section when submitting
  input.classList.add('invisible');
  requestForm.reset();
};

const refreshBtn = document.querySelector('.button__reload');

refreshBtn.addEventListener('click', () => {
  errorMsg.classList.remove('error__visible');
  errorMsg.classList.add('invisible');
  picture.classList.add('invisible');
  picture.classList.remove('visible');
  input.classList.remove('invisible');
  input.classList.add('visible');
  document.querySelector(`.cat__${counter}`).classList.add('invisible');
  counter++;
});

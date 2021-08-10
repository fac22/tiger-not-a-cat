// Present input section when clicking 'cat started' button

const start_btn = document.querySelector('.button__start');
const home = document.querySelector('.section__home');
const input = document.querySelector('.section__input');
const picture = document.querySelector('.section__picture');
const content = document.querySelector('#template__content');
const requestForm = document.querySelector('.request-form');
const tagArea = document.querySelector('#input__tag');
const error_container = document.querySelector('.error__container');
const error_message = document.querySelector('.error__message');
const loadingGif = document.querySelector('.loading');
const reloadBtn = document.querySelector('.button__reload');
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

function createBox(url, fact) {
  const template = document.querySelector('#img__template');
  const domFrag = template.content.cloneNode(true);

  domFrag.querySelector('img').src = url;
  domFrag.querySelector('.cat__fact').innerText = fact;
  content.appendChild(domFrag);

  const figureArr = Array.from(document.querySelectorAll('figure'));
  figureArr[counter].classList.add(`cat__${counter}`);
}

function classControl(element, removeClass, addClass) {
  element.classList.remove(removeClass);
  element.classList.add(addClass);
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
    classControl(error_container, 'invisible', 'error__visible');
    classControl(error_message, 'invisible', 'error__visible');
    return tagArea.setAttribute('aria-invalid', !checkResult);
  }
  classControl(picture, 'invisible', 'visible');
  classControl(loadingGif, 'invisible', 'loading__visible');
  classControl(reloadBtn, 'visible', 'invisible');
  classControl(input, 'visible', 'invisible');
  const imgUrl = await getInputs(tag, filter, text);
  const factText = await getFact();
  createBox(imgUrl, factText);
  classControl(reloadBtn, 'invisible', 'visible');
  classControl(loadingGif, 'loading__visible', 'invisible');
  classControl(input, 'visible', 'invisible');
  requestForm.reset();
};

const refreshBtn = document.querySelector('.button__reload');

refreshBtn.addEventListener('click', () => {
  classControl(error_container, 'error__visible', 'invisible');
  classControl(error_message, 'error__visible', 'invisible');
  classControl(picture, 'visible', 'invisible');
  classControl(input, 'invisible', 'visible');
  document.querySelector(`.cat__${counter}`).classList.add('invisible');
  counter++;
});

// function to remove an error message

const cancel_btn = document.querySelector('.fa-times-circle');

cancel_btn.addEventListener('click', () => {
  classControl(error_container, 'error__visible', 'invisible');
  classControl(error_message, 'error__visible', 'invisible');
});

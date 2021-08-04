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

// This checks if the tag actually exists:
//(instead of the alert we could display an image saying that the tag doesn't exist)
async function checkTag(tag) {
  let checker = true;
  await fetch('https://cataas.com/api/tags')
    .then((response) => response.json())
    .then((data) => {
      if (!data.includes(`${tag}`)) checker = false;
    });
  return checker;
}

// This checks if the tag actually exists and should assign a random tag if tag input is empy
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
  if (!checkResult) return alert('Invalid tag!');
  const imgUrl = await getInputs(tag, filter, text);
  const factText = await getFact();
  createBox(imgUrl, factText);

  requestForm.reset();
};

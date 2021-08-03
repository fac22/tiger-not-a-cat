// Present input section when clidking 'cat started' button

const start_btn = document.querySelector('.button__start');

const home = document.querySelector('.section__home');
const input = document.querySelector('.section__input');

const image = document.querySelector('.img');

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

function getInputs(tag, filter, text) {
  let tagInput;
  let filterInput;
  let textInput;
  tag ? (tagInput = '/' + tag) : (tagInput = '');
  filter ? (filterInput = '?filter=' + filter) : (filterInput = '');
  text ? (textInput = '/says/' + text) : (textInput = '');
  return (
    fetch(`https://cataas.com/cat${tagInput}${textInput}${filterInput}`)
      // .then((response) => response.json())
      .then((response) => {
        console.log(response.url);
        image.setAttribute('src', `${response.url}`);
      })
  );
}

requestForm.onsubmit = (event) => {
  event.preventDefault();
  const tag = event.target.elements.input__tag.value;
  const filter = event.target.elements.input__filter.value;
  const text = event.target.elements.input__text.value;
  getInputs(tag, filter, text);

  requestForm.reset();
};

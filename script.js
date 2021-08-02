// Present input section when clidking 'cat started' button

const start_btn = document.querySelector('.button__start');

const home = document.querySelector('.section__home');
const input = document.querySelector('.section__input');

start_btn.addEventListener('click', () => {
  invisible(home);
  invisible(input);
});

function invisible(e) {
  e.classList.toggle('invisible');
}

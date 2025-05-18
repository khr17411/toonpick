<<<<<<< HEAD
const toggleButtons = document.querySelectorAll('.toggle-group .toggle-btn');

toggleButtons.forEach(button => {
  button.addEventListener('click', () => {
    const siblings = button.parentElement.querySelectorAll('.toggle-btn');
    siblings.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  });
});
=======
const toggleButtons = document.querySelectorAll('.toggle-group .toggle-btn');

toggleButtons.forEach(button => {
  button.addEventListener('click', () => {
    const siblings = button.parentElement.querySelectorAll('.toggle-btn');
    siblings.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  });
});
>>>>>>> origin/main

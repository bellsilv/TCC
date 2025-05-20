function nextPage(page) {
  
  const containers = document.querySelectorAll('.container');
  containers.forEach(container => container.classList.remove('active'));

  document.getElementById(page).classList.add('active');
}

function confirmarReserva() {
  alert("Reserva Confirmada!");
  nextPage('login');  
}

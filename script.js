// Navegação entre páginas
function irPara(paginaId) {
  document.querySelectorAll('.pagina').forEach(p => p.classList.remove('active'));
  document.getElementById(paginaId).classList.add('active');
  limparErros();
  if (paginaId === 'reserva') {
    carregarReservas();
    setMinDate();
  }
  if (paginaId === 'perfil') {
    carregarPerfil();
  }
}

// Limpar mensagens de erro e estilos
function limparErros() {
  document.querySelectorAll('.erro-msg').forEach(el => el.innerText = '');
  document.querySelectorAll('.input-erro').forEach(el => el.classList.remove('input-erro'));
}

// Dados simulados armazenados no localStorage para persistência simples
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
let avaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || [];
let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')) || null;

// Validação e login
function validarLogin(event) {
  event?.preventDefault();
  limparErros();

  const usuario = document.getElementById('login-usuario');
  const senha = document.getElementById('login-senha');

  let valido = true;
  const raFormatado = usuario.value.trim().replace(/\s+/g, '');

  if (!raFormatado) {
    mostrarErro(usuario, 'Preencha seu usuário');
    valido = false;
  }
  if (!senha.value.trim()) {
    mostrarErro(senha, 'Preencha sua senha');
    valido = false;
  }

  if (!valido) return;

  const encontrado = usuarios.find(u => u.ra === raFormatado);
  if (!encontrado) {
    mostrarErro(usuario, 'Usuário não encontrado');
    return;
  }
  if (encontrado.senha !== senha.value.trim()) {
    mostrarErro(senha, 'Senha incorreta');
    return;
  }

  usuarioLogado = encontrado;
  localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
  ajustarMenu();
  irPara('perfil');
  limparForm('form-login');
}

// Validação do cadastro
function validarCadastro(event) {
  event?.preventDefault();
  limparErros();

  const nome = document.getElementById('cad-nome');
  const ra = document.getElementById('cad-ra');
  const turma = document.getElementById('cad-turma');
  const senha = document.getElementById('cad-senha');
  const confirmar = document.getElementById('cad-confirmar-senha');

  const raFormatado = ra.value.trim().replace(/\s+/g, '');
  let valido = true;

  if (!nome.value.trim()) {
    mostrarErro(nome, 'Informe seu nome');
    valido = false;
  }
  if (!raFormatado) {
    mostrarErro(ra, 'Informe seu RA');
    valido = false;
  } else if (usuarios.find(u => u.ra === raFormatado)) {
    mostrarErro(ra, 'RA já cadastrado');
    valido = false;
  }
  if (!turma.value.trim()) {
    mostrarErro(turma, 'Informe sua turma');
    valido = false;
  }
  if (!senha.value.trim()) {
    mostrarErro(senha, 'Crie uma senha');
    valido = false;
  }
  if (!confirmar.value.trim()) {
    mostrarErro(confirmar, 'Confirme sua senha');
    valido = false;
  }
  if (senha.value.trim() && confirmar.value.trim() && senha.value.trim() !== confirmar.value.trim()) {
    mostrarErro(confirmar, 'Senhas não coincidem');
    valido = false;
  }

  if (!valido) return;

  usuarios.push({
    nome: nome.value.trim(),
    ra: raFormatado,
    turma: turma.value.trim(),
    senha: senha.value.trim()
  });
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  alert('Cadastro realizado com sucesso!');
  limparForm('form-cadastro');
  irPara('login');
}

// Mostrar erro em campo
function mostrarErro(campo, msg) {
  campo.classList.add('input-erro');
  document.getElementById('erro-' + campo.id).innerText = msg;
}

// Limpar formulário
function limparForm(formId) {
  document.getElementById(formId).reset();
  limparErros();
}

// Ajusta menu conforme usuário logado
function ajustarMenu() {
  const btnLogin = document.getElementById('btn-login');
  const btnCadastro = document.getElementById('btn-cadastro');
  const btnPerfil = document.getElementById('btn-perfil');
  const btnLogout = document.getElementById('btn-logout');

  if (usuarioLogado) {
    btnLogin.style.display = 'none';
    btnCadastro.style.display = 'none';
    btnPerfil.style.display = 'inline-block';
    btnLogout.style.display = 'inline-block';
  } else {
    btnLogin.style.display = 'inline-block';
    btnCadastro.style.display = 'inline-block';
    btnPerfil.style.display = 'none';
    btnLogout.style.display = 'none';
  }
}

// Logout
function logout() {
  usuarioLogado = null;
  localStorage.removeItem('usuarioLogado');
  ajustarMenu();
  irPara('home');
}

// Carregar dados do perfil
function carregarPerfil() {
  if (!usuarioLogado) {
    alert('Você precisa estar logado para acessar o perfil.');
    irPara('login');
    return;
  }
  document.getElementById('perfil-nome').innerText = usuarioLogado.nome;
  document.getElementById('perfil-ra').innerText = usuarioLogado.ra;
  document.getElementById('perfil-turma').innerText = usuarioLogado.turma;
}

// Definir data mínima para reserva como hoje
function setMinDate() {
  const dataInput = document.getElementById('res-data');
  const hoje = new Date();
  const isoHoje = hoje.toISOString().split('T')[0];
  dataInput.min = isoHoje;
}

// Validar reserva
function validarReserva() {
  limparErros();

  if (!usuarioLogado) {
    alert('Você precisa estar logado para fazer reservas.');
    irPara('login');
    return;
  }

  const notebook = document.getElementById('res-notebook');
  const data = document.getElementById('res-data');
  const hora = document.getElementById('res-hora');
  const periodo = document.getElementById('res-horario');

  let valido = true;

  if (!notebook.value) {
    mostrarErro(notebook, 'Selecione um notebook');
    valido = false;
  }
  if (!data.value) {
    mostrarErro(data, 'Selecione uma data');
    valido = false;
  }
  if (!hora.value) {
    mostrarErro(hora, 'Selecione uma hora');
    valido = false;
  }
  if (!periodo.value) {
    mostrarErro(periodo, 'Selecione um período');
    valido = false;
  }

  if (!valido) return;

  const novaReserva = {
    id: Date.now(),
    usuarioRa: usuarioLogado.ra,
    notebook: notebook.value,
    data: data.value,
    hora: hora.value,
    periodo: periodo.value
  };

  reservas.push(novaReserva);
  localStorage.setItem('reservas', JSON.stringify(reservas));
  alert('Reserva realizada com sucesso!');
  limparForm('form-reserva');
  carregarReservas();
}

// Carregar reservas do usuário logado
function carregarReservas() {
  if (!usuarioLogado) return;

  const lista = document.getElementById('lista-reservas');
  lista.innerHTML = '';

  const minhasReservas = reservas.filter(r => r.usuarioRa === usuarioLogado.ra);
  if (minhasReservas.length === 0) {
    lista.innerHTML = '<li>Nenhuma reserva realizada ainda.</li>';
    return;
  }

  minhasReservas.forEach(r => {
    const li = document.createElement('li');
    li.innerText = `${r.notebook} | Data: ${r.data} | Hora: ${r.hora} | Período: ${r.periodo}`;
    lista.appendChild(li);
  });
}

// Avaliação - estrelas interativas
const estrelas = document.querySelectorAll('#estrelas span');
let notaSelecionada = 0;

estrelas.forEach(estrela => {
  estrela.addEventListener('click', () => {
    notaSelecionada = parseInt(estrela.dataset.valor);
    atualizarEstrelas(notaSelecionada);
  });

  estrela.addEventListener('mouseover', () => {
    atualizarEstrelas(parseInt(estrela.dataset.valor));
  });

  estrela.addEventListener('mouseout', () => {
    atualizarEstrelas(notaSelecionada);
  });
});

function atualizarEstrelas(nota) {
  estrelas.forEach(estrela => {
    const valor = parseInt(estrela.dataset.valor);
    estrela.classList.toggle('filled', valor <= nota);
  });
}

// Enviar avaliação
function enviarAvaliacao() {
  limparErros();

  if (!usuarioLogado) {
    alert('Você precisa estar logado para avaliar.');
    irPara('login');
    return;
  }

  if (notaSelecionada === 0) {
    document.getElementById('erro-avaliacao-nota').innerText = 'Selecione uma nota antes de enviar';
    return;
  }

  const comentario = document.getElementById('aval-texto').value.trim();

  avaliacoes.push({
    usuarioRa: usuarioLogado.ra,
    nota: notaSelecionada,
    comentario,
    data: new Date().toISOString()
  });
  localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));

  alert('Obrigado pela sua avaliação!');
  notaSelecionada = 0;
  atualizarEstrelas(0);
  document.getElementById('aval-texto').value = '';
  irPara('perfil');
}

// Inicializar menu conforme usuário logado ao carregar a página
window.onload = () => {
  ajustarMenu();
  irPara('home');
};

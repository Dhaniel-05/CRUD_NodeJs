const url = 'http://localhost:3000/api/usuarios/';
const contenedor = document.querySelector('tbody');
const modal = document.getElementById('modalUsuario');
const formUsuario = document.querySelector('form');
const nombre = document.getElementById('nombre');
const usuario = document.getElementById('usuario');
const email = document.getElementById('email');
const password = document.getElementById('password');
const btnCrear = document.getElementById('btnCrear');

// Verificar autenticación
if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
}

function agregarHeaders(options = {}) {
    return {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            ...options.headers
        }
    };
}

const mostrar = (usuarios) => {
    contenedor.innerHTML = '';
    usuarios.forEach(usuario => {
        contenedor.innerHTML += `
            <tr>
                <td class="visually-hidden">${usuario.id}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.usuario}</td>
                <td>${usuario.email}</td>
                <td>
                    <button class="btn btnEditar">Editar</button>
                    <button class="btn btn-danger btnBorrar">Borrar</button>
                </td>
            </tr>
        `;
    });
};

fetch(url, agregarHeaders())
    .then(response => response.json())
    .then(data => mostrar(data))
    .catch(() => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

document.addEventListener('click', e => {
    if (e.target.matches('.btnBorrar')) {
        const fila = e.target.closest('tr');
        const id = fila.cells[0].textContent;
        
        if (confirm('¿Eliminar este usuario?')) {
            fetch(url + id, agregarHeaders({ method: 'DELETE' }))
                .then(() => fila.remove())
                .catch(error => console.error('Error:', error));
        }
    }

    if (e.target.matches('.btnEditar')) {
        const fila = e.target.closest('tr');
        idForm = fila.cells[0].textContent;
        nombre.value = fila.cells[1].textContent;
        usuario.value = fila.cells[2].textContent;
        email.value = fila.cells[3].textContent;
        opcion = 'editar';
        modal.style.display = "block";
    }
});

formUsuario.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const data = {
        nombre: nombre.value,
        usuario: usuario.value,
        email: email.value
    };

    if (password.value) {
        data.passwords = password.value;
    }
    
    const method = opcion === 'crear' ? 'POST' : 'PUT';
    const endpoint = opcion === 'crear' ? url : url + idForm;
    
    fetch(endpoint, agregarHeaders({
        method: method,
        body: JSON.stringify(data)
    }))
    .then(response => response.json())
    .then(() => {
        fetch(url, agregarHeaders())
            .then(response => response.json())
            .then(data => mostrar(data));
        modal.style.display = "none";
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('btnLogout').onclick = () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
};

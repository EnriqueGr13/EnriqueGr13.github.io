const jsonRegistrados = `[
    {
        "nombre": "juan",
        "apellidos": "garcía",
        "edad": 23,
        "sexo": "Masculino",
        "email": "juan.garcia@gmail.com",
        "contraseña": "abcde"
    },  
    {
        "nombre": "lucia",
        "apellidos": "martinez",
        "edad": 25,
        "sexo": "Femenino",
        "email": "lucia.martinez@gmail.com",
        "contraseña":"1234"
    }
]`;

const registrados = JSON.parse(jsonRegistrados);

class Registrado {
    constructor(nombre, apellidos, edad, sexo, email, contraseña) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.edad = edad;
        this.sexo = sexo;
        this.email = email;
        this.contraseña = contraseña;
    }
}

const coleccion_registrados = registrados.map(usuario => new Registrado(
    usuario.nombre,
    usuario.apellidos,
    usuario.edad,
    usuario.sexo,
    usuario.email,
    usuario.contraseña
));

const filter_user_from_collection = () => {
    const filtroNombre = document.getElementById('nombre').value.toLowerCase().trim();
    const filtroApellidos = document.getElementById('apellidos').value.toLowerCase().trim();
    const filtroEdad = document.getElementById('edad').value.trim();
    const filtroSexo = document.getElementById('sexo').value.toLowerCase().trim();
    const filtroEmail = document.getElementById('email').value.toLowerCase().trim();
    const filtroContraseña = document.getElementById('contraseña').value.trim();

    return coleccion_registrados.filter(registrado => 
        (filtroNombre ? registrado.nombre.toLowerCase() === filtroNombre : true) &&
        (filtroApellidos ? registrado.apellidos.toLowerCase() === filtroApellidos : true) &&
        (filtroEdad ? registrado.edad == filtroEdad : true) &&
        (filtroSexo ? registrado.sexo.toLowerCase() === filtroSexo : true) &&
        (filtroEmail ? registrado.email.toLowerCase() === filtroEmail : true) &&
        (filtroContraseña ? registrado.contraseña === filtroContraseña : true)
    );
};

const initialize_img = function() {
    const span = document.querySelector('span');
    span.innerHTML = `<img src="formulario/imgsFormulario/error.png" alt="check-icon" id="img" style="width: 20px; height: 20px; display: none;">`;
};

initialize_img();

const comprobarCamposRellenos = () => {
    const campos = document.querySelectorAll('.campo');
    return Array.from(campos).every(campo => {
        const valor = campo.value.trim();
        const estaVacio = valor === '';
        document.getElementById('errorcase').textContent = estaVacio ? `El campo ${campo.id} no puede estar vacío` : '';

        campo.classList.toggle('campo-error', estaVacio);
        if (estaVacio) setTimeout(() => campo.classList.remove('campo-error'), 1000);

        return !estaVacio;
    });
};

const borrarCampos = function() {
    const idsDeCampos = ['nombre', 'apellidos', 'edad', 'sexo', 'email', 'contraseña'];
    idsDeCampos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.value = '';
        }
    });
    document.getElementById('errorcase').textContent = "";
};

const validar = () => {
    if (comprobarCamposRellenos()) {
        const usuariosFiltrados = filter_user_from_collection();
        const img = document.getElementById('img');
        const errorCase = document.getElementById('errorcase');
        const form = document.querySelector('form');

        if (usuariosFiltrados.length === 0) {
            img.src = "formulario/imgsFormulario/error.png";
            errorCase.textContent = "Usuario no está registrado";
        } else {
            img.src = "formulario/imgsFormulario/success.png";
            const p = document.createElement('p');
            p.textContent = "Usuario registrado correctamente";
            form.appendChild(p);
            setTimeout(() => window.location.href = "src/dashboard.html", 2000);
        }

        img.style.display = 'block';
        setTimeout(() => {
            borrarCampos();
            img.style.display = 'none';
        }, 2000);
    }
};

document.addEventListener('keydown', function(evento) {
    switch (evento.key) {
        case 'Enter':
            manejarTeclaEnter(evento);
            break;
        case 'ArrowDown':
        case 'ArrowUp':
            manejarTeclasFlecha(evento);
            break;
        default:
            break;
    }
});

function manejarTeclaEnter(evento) {
    validar();
    evento.preventDefault();
}

function manejarTeclasFlecha(evento) {
    const controles = Array.from(document.querySelectorAll('.controls'));
    const elementoActivo = document.activeElement;
    const indiceActual = controles.indexOf(elementoActivo);

    if (indiceActual !== -1) {
        const moverAbajo = evento.key === 'ArrowDown';
        let proximoIndice = indiceActual + (moverAbajo ? 1 : -1);
        proximoIndice = (proximoIndice + controles.length) % controles.length;
        controles[proximoIndice].focus();
    }
    evento.preventDefault();
}

const boton = document.querySelector(".botons");
boton.addEventListener('mouseover', () => {
    boton.style.backgroundColor = "#056d28";
});

boton.addEventListener('mouseout', () => {
    boton.style.backgroundColor = "#083eb2";
});

const inputNombre = document.getElementById('nombre')
inputNombre.addEventListener('focus', () => {
    inputNombre.placeholder = '';
});

inputNombre.addEventListener('blur', () => {
    inputNombre.placeholder = 'Ingresa tu nombre';
});

const inputApellidos = document.getElementById('apellidos')
inputApellidos.addEventListener('focus', () => {
    inputApellidos.placeholder = '';
});

inputApellidos.addEventListener('blur', () => {
    inputApellidos.placeholder = 'Ingresa tus apellidos';
});

const inputEdad = document.getElementById('edad')
inputEdad.addEventListener('focus', () => {
    inputEdad.placeholder = '';
});

inputEdad.addEventListener('blur', () => {
    inputEdad.placeholder = 'Ingresa tu edad';
});

const inputEmail = document.getElementById('email')
inputEmail.addEventListener('focus', () => {
    inputEmail.placeholder = '';
});

inputEmail.addEventListener('blur', () => {
    inputEmail.placeholder = 'Ingresa tu email';
});

const inputContraseña = document.getElementById('contraseña')
inputContraseña.addEventListener('focus', () => {
    inputContraseña.placeholder = '';
});

inputContraseña.addEventListener('blur', () => {
    inputContraseña.placeholder = 'Ingresa tu contraseña';
});
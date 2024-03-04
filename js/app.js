// Obbtener los elementos del HTML, para pegar los elementos que obtendremos:
const formulario = document.getElementById('formulario')
const cardsEstudiantes = document.getElementById('cardsEstudiantes')
const cardsProfesores = document.getElementById('cardsProfesores')
const templateEstudiantes = document.getElementById('templateEstudiantes').content 
const templateProfesores = document.getElementById('templateProfesores').content 
const alert = document.querySelector('.alert') // al no declarar id en la alarte, la obtenemos con querySelector

// Obtendremos 2 arreglos, 1 para almacenar estudiantes y otro para profesores:
const estudiantes = []
const profesores = []

// Construccion de clases y/o Objetos
class Persona{
    constructor(nombre,edad) {
        this.nombre = nombre
        this.edad = edad
        this.uid = `${Date.now()}` // Se genera un numero
    }

    static pintarPersonaUI (personas, tipo) {
        if(tipo === 'Estudiante') {
            cardsEstudiantes.textContent = ''
            const fragment = document.createDocumentFragment()

            personas.forEach((item) => {
                fragment.appendChild(item.agregarNuevoEstudiante())
            });

            cardsEstudiantes.appendChild(fragment)
        }

        if(tipo === 'Profesor') {
            cardsProfesores.textContent = ''
            const fragment = document.createDocumentFragment()

            personas.forEach((item) => {
                fragment.appendChild(item.agregarNuevoProfesor())
            });

            cardsProfesores.appendChild(fragment)
        }
    }
}

class Estudiante extends Persona { // extends HEREDA todo lo que toma de la clase persona en este caso
    #estado = false
    #estudiante = 'Estudiante'

    // Para modificar una variable global:
    set setEstado(estado) {
        this.#estado = estado
    }
    get getEstudiante() {
        return this.#estudiante // Indicamos que es privado.
    }

    agregarNuevoEstudiante() {  
        const clone = templateEstudiantes.cloneNode(true)
        clone.querySelector('h5 .text-primary').textContent = this.nombre
        clone.querySelector('h6').textContent = this.getEstudiante
        clone.querySelector('.lead').textContent = this.edad

        // Verificamos el estado del alumno:
        if(this.#estado) {
            clone.querySelector('.badge').className = "badge bg-success"
            clone.querySelector('.btn-success').disable = true
            clone.querySelector('.btn-danger').disable = false
        } else {
            clone.querySelector('.badge').className = "badge bg-danger"
            clone.querySelector('.btn-success').disable = false
            clone.querySelector('.btn-danger').disable = true
        }
                                                    // Es un if ? true : false
        clone.querySelector('.badge').textContent = this.#estado ? 'Aprobado' : 'Reprobado'

        // Para saber de que persona recibe la informacion:
        clone.querySelector('.btn-success').dataset.uid = this.uid
        clone.querySelector('.btn-danger').dataset.uid = this.uid

        return clone
    }
}

class Profesor extends Persona {
    #profesor = 'Profesor'

    agregarNuevoProfesor() {
        const clone = templateProfesores.cloneNode(true) 
        clone.querySelector('h5').textContent = this.nombre
        clone.querySelector('h6').textContent = this.#profesor
        clone.querySelector('.lead').textContent = this.edad
        return clone
    }
}

// Boton de submit:
formulario.addEventListener('submit', (e) => {
    e.preventDefault() // Para que NO haga refresh en el post
    alert.classList.add('d-none')
    const datos = new FormData(formulario) // Pasamos todo el formulario a la variable datos.

    // Empezamos con las constantes:
    const [nombre, edad, opcion] = [...datos.values()] // Toma valors que regreso el objeto de datos

    // Validamos espacios en blanco
    if(!nombre.trim() || !edad.trim() || !opcion.trim()) {
        alert.classList.remove('d-none')
        return
    }

    if(opcion === 'Estudiante') {
        const estudiante = new Estudiante(nombre,edad)
        estudiantes.push(estudiante)
        Persona.pintarPersonaUI(estudiantes, opcion)
    }

    if(opcion === 'Profesor') {
        const profesor = new Profesor(nombre,edad)
        profesores.push(profesor)
        Persona.pintarPersonaUI(profesores, opcion)
    }
})
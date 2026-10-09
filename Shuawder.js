/* =======================================================
   IETC - Información de Laboratorios
   shuawder.js

   Sistema de control de equipos del liceo.

   FUNCIONES PRINCIPALES:
   - Control de equipos
   - Estados Libre / Ocupado
   - Conectividad simulada
   - Dashboard
   - Persistencia mediante localStorage
   - Navegación entre secciones
   - Registro de usuarios
   ======================================================= */


/* =======================================================
   BASE DE DATOS INICIAL DE EQUIPOS
   =======================================================
   Esta información representa los equipos iniciales
   del sistema.

   Los datos pueden modificarse posteriormente desde
   JavaScript y los cambios se almacenan en localStorage.
   ======================================================= */

const equiposBase = [

    // ---------------------------------------------------
    // LABORATORIO 1
    // ---------------------------------------------------

    {
        id: "PC-LAB01-01",
        ubicacion: "Laboratorio 1",
        specs: "Intel i5-10400 · 8GB RAM · 256GB SSD",
        ocupado: false,
        sistema: "Windows 11",
        conectado: true
    },

    {
        id: "PC-LAB01-02",
        ubicacion: "Laboratorio 1",
        specs: "Intel i5-10400 · 8GB RAM · 256GB SSD",
        ocupado: true,
        sistema: "Windows 11",
        conectado: true
    },

    {
        id: "PC-LAB01-03",
        ubicacion: "Laboratorio 1",
        specs: "Intel i3-10100 · 4GB RAM · 128GB SSD",
        ocupado: false,
        sistema: "Windows 10",
        conectado: false
    },


    // ---------------------------------------------------
    // LABORATORIO 2
    // ---------------------------------------------------

    {
        id: "PC-LAB02-01",
        ubicacion: "Laboratorio 2",
        specs: "AMD Ryzen 5 5600G · 16GB RAM · 512GB SSD",
        ocupado: true,
        sistema: "Ubuntu 22.04",
        conectado: true
    },

    {
        id: "PC-LAB02-02",
        ubicacion: "Laboratorio 2",
        specs: "AMD Ryzen 5 5600G · 16GB RAM · 512GB SSD",
        ocupado: false,
        sistema: "Ubuntu 22.04",
        conectado: true
    },

    {
        id: "PC-LAB02-03",
        ubicacion: "Laboratorio 2",
        specs: "Intel i5-11400 · 16GB RAM · 512GB SSD",
        ocupado: false,
        sistema: "Debian 12",
        conectado: true
    },


    // ---------------------------------------------------
    // LABORATORIO 3
    // ---------------------------------------------------

    {
        id: "PC-LAB03-01",
        ubicacion: "Laboratorio 3",
        specs: "Intel i5-12400 · 16GB RAM · 512GB SSD",
        ocupado: true,
        sistema: "Windows 11",
        conectado: true
    },

    {
        id: "PC-LAB03-02",
        ubicacion: "Laboratorio 3",
        specs: "Intel i5-12400 · 16GB RAM · 512GB SSD",
        ocupado: false,
        sistema: "Windows 11",
        conectado: false
    },

    {
        id: "NOTE-01",
        ubicacion: "Laboratorio 3",
        specs: "Laptop HP 15 · 8GB RAM · 256GB SSD",
        ocupado: false,
        sistema: "Windows 11",
        conectado: true
    },


    // ---------------------------------------------------
    // OTROS EQUIPOS
    // ---------------------------------------------------

    {
        id: "PC-BIB-01",
        ubicacion: "Biblioteca",
        specs: "Intel i3-9100 · 8GB RAM · 240GB SSD",
        ocupado: true,
        sistema: "Windows 10",
        conectado: true
    },

    {
        id: "PC-ADM-01",
        ubicacion: "Administración",
        specs: "Intel i7-11700 · 16GB RAM · 1TB SSD",
        ocupado: true,
        sistema: "Windows 11",
        conectado: true
    },

    {
        id: "NOTE-02",
        ubicacion: "Sala Móvil",
        specs: "Laptop Lenovo · 8GB RAM · 256GB SSD",
        ocupado: false,
        sistema: "Windows 11",
        conectado: false
    }

];


/* =======================================================
   ARRAY PRINCIPAL DE EQUIPOS
   =======================================================
   Este array será el que realmente utilizará la aplicación.

   equiposBase = información original.

   equipos = información actual modificada por el usuario.
   ======================================================= */

let equipos = [];


/* =======================================================
   CARGAR EQUIPOS DESDE LOCALSTORAGE
   =======================================================
   localStorage permite conservar los cambios aunque
   el usuario cierre o recargue la página.
   ======================================================= */

function cargarEquipos() {

    const guardado =
        localStorage.getItem("cct_equipos");


    // ---------------------------------------------------
    // SI EXISTEN DATOS GUARDADOS
    // ---------------------------------------------------

    if (guardado) {

        try {

            equipos = JSON.parse(guardado);


            // Revisamos cada equipo.

            equipos.forEach(e => {

                // Si no tiene última conexión,
                // asignamos la hora actual.

                if (e.ultimaConexion === undefined) {

                    e.ultimaConexion = Date.now();

                }


                // Si no tiene estado de conexión,
                // lo dejamos conectado.

                if (e.conectado === undefined) {

                    e.conectado = true;

                }

            });

        }


        // ------------------------------------------------
        // SI EL LOCALSTORAGE ESTÁ CORRUPTO
        // ------------------------------------------------

        catch (err) {

            console.warn(
                "Error al leer localStorage. Se utilizarán los datos base."
            );

            equipos =
                JSON.parse(JSON.stringify(equiposBase));


            equipos.forEach(e => {

                e.ultimaConexion =
                    Date.now() -
                    Math.random() * 3600000;

            });

        }

    }


    // ---------------------------------------------------
    // SI NO EXISTEN DATOS GUARDADOS
    // ---------------------------------------------------

    else {

        equipos =
            JSON.parse(JSON.stringify(equiposBase));


        equipos.forEach(e => {

            e.ultimaConexion =
                Date.now() -
                Math.floor(Math.random() * 7200000);

        });


        guardarEquipos();

    }

}


/* =======================================================
   GUARDAR EQUIPOS
   =======================================================
   Convierte el array de equipos a JSON y lo guarda
   dentro del navegador.
   ======================================================= */

function guardarEquipos() {

    localStorage.setItem(
        "cct_equipos",
        JSON.stringify(equipos)
    );

}


/* =======================================================
   FORMATEAR TIEMPO RELATIVO
   =======================================================
   Convierte una fecha como:

   2026-09-24 10:00

   en algo más fácil de leer:

   "hace 5 min"
   "hace 2 h"
   "hace 1 d"
   ======================================================= */

function tiempoRelativo(timestamp) {

    const diff =
        Date.now() - timestamp;


    const min =
        Math.floor(diff / 60000);


    if (min < 1) {

        return "hace unos segundos";

    }


    if (min < 60) {

        return `hace ${min} min`;

    }


    const horas =
        Math.floor(min / 60);


    if (horas < 24) {

        return `hace ${horas} h`;

    }


    return `hace ${Math.floor(horas / 24)} d`;

}


/* =======================================================
   NAVEGACIÓN ENTRE PÁGINAS
   =======================================================
   Esta función permite cambiar entre:

   - menu
   - dashboard
   - lab1
   - lab2
   - lab3
   - docs
   - contactos

   IMPORTANTE:

   Los nombres deben coincidir exactamente con los
   "id" utilizados en index.html.
   ======================================================= */

function irA(id) {


    // ---------------------------------------------------
    // OCULTAR TODAS LAS SECCIONES
    // ---------------------------------------------------

    document
        .querySelectorAll(".page")
        .forEach(p => {

            p.classList.remove("active");

        });


    // ---------------------------------------------------
    // BUSCAR LA SECCIÓN SELECCIONADA
    // ---------------------------------------------------

    const seccion =
        document.getElementById(id);


    // ---------------------------------------------------
    // MOSTRAR LA SECCIÓN
    // ---------------------------------------------------

    if (seccion) {

        seccion.classList.add("active");

    }


    // ---------------------------------------------------
    // ACTUALIZAR INFORMACIÓN SEGÚN LA SECCIÓN
    // ---------------------------------------------------

    if (id === "dashboard") {

        actualizarDashboard();

    }


    if (id === "lab1") {

        renderLab(
            "lab1",
            "Laboratorio 1"
        );

    }


    if (id === "lab2") {

        renderLab(
            "lab2",
            "Laboratorio 2"
        );

    }


    if (id === "lab3") {

        renderLab(
            "lab3",
            "Laboratorio 3"
        );

    }

}


/* =======================================================
   DASHBOARD
   =======================================================
   Calcula automáticamente:

   - Total de equipos
   - Equipos libres
   - Equipos ocupados
   - Cantidad de sistemas operativos
   ======================================================= */

function actualizarDashboard() {


    const total =
        equipos.length;


    const libres =
        equipos.filter(
            e => !e.ocupado
        ).length;


    const ocupados =
        total - libres;


    const sistemas =
        [
            ...new Set(
                equipos.map(
                    e => e.sistema
                )
            )
        ].length;


    // ---------------------------------------------------
    // FUNCIÓN AUXILIAR PARA ACTUALIZAR HTML
    // ---------------------------------------------------

    const set = (id, val) => {

        const el =
            document.getElementById(id);


        if (el) {

            el.textContent = val;

        }

    };


    set(
        "stat-total",
        total
    );


    set(
        "stat-libres",
        libres
    );


    set(
        "stat-ocupados",
        ocupados
    );


    set(
        "stat-sistemas",
        sistemas
    );

}


/* =======================================================
   RENDERIZAR LABORATORIO
   =======================================================
   Busca los equipos pertenecientes al laboratorio
   seleccionado y crea sus tarjetas visualmente.
   ======================================================= */

function renderLab(
    labId,
    ubicacion
) {


    const contenedor =
        document.getElementById(
            labId + "-lista"
        );


    if (!contenedor) {

        return;

    }


    // ---------------------------------------------------
    // FILTRAR EQUIPOS
    // ---------------------------------------------------

    const lista =
        equipos.filter(
            e => e.ubicacion === ubicacion
        );


    // Limpiamos el contenido anterior.

    contenedor.innerHTML = "";


    // ---------------------------------------------------
    // CREAR TARJETA PARA CADA EQUIPO
    // ---------------------------------------------------

    lista.forEach(eq => {


        const div =
            document.createElement("div");


        div.className =
            "equipo";


        // Estado de ocupación.

        const estadoTexto =
            eq.ocupado
                ? "Ocupado"
                : "Libre";


        const estadoClase =
            eq.ocupado
                ? "estado-ocupado"
                : "estado-libre";


        // Estado de conexión.

        const conexionTexto =
            eq.conectado
                ? "En línea"
                : "Desconectado";


        const conexionColor =
            eq.conectado
                ? "#34d399"
                : "#f87171";


        // ------------------------------------------------
        // CREAR CONTENIDO DE LA TARJETA
        // ------------------------------------------------

        div.innerHTML = `

            <div class="id">
                ${eq.id}
            </div>

            <div class="meta">
                ${eq.specs}
            </div>

            <div class="meta">

                Estado:

                <span class="${estadoClase}">
                    ${estadoTexto}
                </span>

                · ${eq.sistema}

            </div>

            <div
                class="meta"
                style="margin-top:4px;"
            >

                <span
                    style="
                        color:${conexionColor};
                        font-weight:600;
                    "
                >

                    ● ${conexionTexto}

                </span>

                · Última conexión:
                ${tiempoRelativo(eq.ultimaConexion)}

            </div>


            <div
                style="
                    margin-top:8px;
                    display:flex;
                    gap:8px;
                "
            >


                <!-- BOTÓN OCUPAR / LIBERAR -->

                <button
                    onclick="toggleOcupado('${eq.id}')"
                    style="
                        flex:1;
                        padding:6px 10px;
                        border:none;
                        border-radius:8px;
                        cursor:pointer;
                        font-size:0.8rem;
                        font-weight:600;

                        background:
                        ${
                            eq.ocupado
                            ? "rgba(34,197,94,0.15)"
                            : "rgba(239,68,68,0.15)"
                        };

                        color:
                        ${
                            eq.ocupado
                            ? "#34d399"
                            : "#f87171"
                        };
                    "
                >

                    ${
                        eq.ocupado
                        ? "Liberar"
                        : "Ocupar"
                    }

                </button>


                <!-- BOTÓN CONECTAR / DESCONECTAR -->

                <button
                    onclick="simularConexion('${eq.id}')"
                    style="
                        flex:1;
                        padding:6px 10px;
                        border:none;
                        border-radius:8px;
                        cursor:pointer;
                        font-size:0.8rem;
                        font-weight:600;

                        background:
                        rgba(59,130,246,0.15);

                        color:#60a5fa;
                    "
                >

                    ${
                        eq.conectado
                        ? "Desconectar"
                        : "Reconectar"
                    }

                </button>

            </div>

        `;


        // Agregar tarjeta al laboratorio.

        contenedor.appendChild(div);

    });


    // ---------------------------------------------------
    // ACTUALIZAR CONTADORES DEL LABORATORIO
    // ---------------------------------------------------

    const libres =
        lista.filter(
            e => !e.ocupado
        ).length;


    const ocupados =
        lista.length - libres;


    const elLibres =
        document.getElementById(
            labId + "-libres"
        );


    const elOcupados =
        document.getElementById(
            labId + "-ocupados"
        );


    if (elLibres) {

        elLibres.textContent =
            libres;

    }


    if (elOcupados) {

        elOcupados.textContent =
            ocupados;

    }

}


/* =======================================================
   CAMBIAR ESTADO OCUPADO / LIBRE
   =======================================================
   Cambia el estado del equipo:

   Ocupado → Libre

   Libre → Ocupado
   ======================================================= */

function toggleOcupado(id) {


    const eq =
        equipos.find(
            e => e.id === id
        );


    if (!eq) {

        return;

    }


    // Cambiar estado.

    eq.ocupado =
        !eq.ocupado;


    // Actualizar última actividad.

    eq.ultimaConexion =
        Date.now();


    // Guardar cambios.

    guardarEquipos();


    // Actualizar pantalla.

    actualizarPantallaActual();

}


/* =======================================================
   SIMULAR CONEXIÓN / DESCONEXIÓN
   =======================================================
   Esta función simula el estado de red de un equipo.

   No comprueba realmente si un PC está conectado a Internet,
   ya que el proyecto todavía no utiliza un servidor/backend.
   ======================================================= */

function simularConexion(id) {


    const eq =
        equipos.find(
            e => e.id === id
        );


    if (!eq) {

        return;

    }


    // Cambiar estado de conexión.

    eq.conectado =
        !eq.conectado;


    // Si vuelve a conectarse,
    // actualizamos la última conexión.

    if (eq.conectado) {

        eq.ultimaConexion =
            Date.now();

    }


    // Guardar cambios.

    guardarEquipos();


    // Actualizar pantalla.

    actualizarPantallaActual();

}


/* =======================================================
   ACTUALIZAR PANTALLA ACTUAL
   =======================================================
   Evita repetir código cuando cambiamos el estado
   de un equipo.
   ======================================================= */

function actualizarPantallaActual() {


    const activa =
        document.querySelector(
            ".page.active"
        );


    if (!activa) {

        return;

    }


    if (activa.id === "lab1") {

        renderLab(
            "lab1",
            "Laboratorio 1"
        );

    }


    if (activa.id === "lab2") {

        renderLab(
            "lab2",
            "Laboratorio 2"
        );

    }


    if (activa.id === "lab3") {

        renderLab(
            "lab3",
            "Laboratorio 3"
        );

    }


    if (activa.id === "dashboard") {

        actualizarDashboard();

    }

}


/* =======================================================
   LATIDO DE RED
   =======================================================
   Simulación de actividad de los equipos.

   Cada 30 segundos algunos equipos conectados
   actualizan su última conexión.

   Esto NO es una conexión real a los PCs.
   ======================================================= */

function latidoRed() {


    equipos.forEach(eq => {


        if (
            eq.conectado &&
            Math.random() > 0.7
        ) {

            eq.ultimaConexion =
                Date.now();

        }

    });


    guardarEquipos();


    // Si estamos viendo un laboratorio,
    // actualizamos la información.

    actualizarPantallaActual();

}


/* =======================================================
   REGISTRO DE USUARIO
   =======================================================
   Esta parte controla el formulario ubicado en:

   #contactos

   Actualmente los datos se guardan en localStorage
   solamente para fines de demostración del proyecto.

   IMPORTANTE:
   Para un sistema real NO se deben guardar contraseñas
   directamente en localStorage.
   ======================================================= */

function configurarRegistro() {


    const formulario =
        document.querySelector(
            ".contact-form"
        );


    // Si el formulario no existe,
    // terminamos la función.

    if (!formulario) {

        return;

    }


    // ---------------------------------------------------
    // DETECTAR ENVÍO DEL FORMULARIO
    // ---------------------------------------------------

    formulario.addEventListener(
        "submit",
        function (evento) {


            // Evita que la página se recargue.

            evento.preventDefault();


            // ------------------------------------------------
            // OBTENER DATOS
            // ------------------------------------------------

            const nombre =
                document.getElementById(
                    "nombre"
                ).value.trim();


            const apellido =
                document.getElementById(
                    "apellido"
                ).value.trim();


            const correo =
                document.getElementById(
                    "correo"
                ).value.trim();


            const telefono =
                document.getElementById(
                    "telefono"
                ).value.trim();


            const fecha =
                document.getElementById(
                    "fecha"
                ).value;


            const password =
                document.getElementById(
                    "password"
                ).value;


            const confirmarPassword =
                document.getElementById(
                    "confirmar-password"
                ).value;


            // ------------------------------------------------
            // COMPROBAR CONTRASEÑAS
            // ------------------------------------------------

            if (
                password !==
                confirmarPassword
            ) {

                alert(
                    "Las contraseñas no coinciden."
                );

                return;

            }


            // ------------------------------------------------
            // CREAR OBJETO DE USUARIO
            // ------------------------------------------------

            const usuario = {

                nombre: nombre,

                apellido: apellido,

                correo: correo,

                telefono: telefono,

                fecha: fecha,

                fechaRegistro:
                    new Date().toISOString()

            };


            /*
             * NOTA:
             *
             * No guardamos la contraseña.
             *
             * Un sistema real debería utilizar un backend
             * y almacenar las contraseñas de forma segura
             * mediante hash.
             */


            // ------------------------------------------------
            // OBTENER USUARIOS EXISTENTES
            // ------------------------------------------------

            let usuarios =
                JSON.parse(
                    localStorage.getItem(
                        "cct_usuarios"
                    )
                ) || [];


            // ------------------------------------------------
            // COMPROBAR SI EL CORREO YA EXISTE
            // ------------------------------------------------

            const existe =
                usuarios.some(
                    u =>
                        u.correo.toLowerCase() ===
                        correo.toLowerCase()
                );


            if (existe) {

                alert(
                    "Este correo ya está registrado."
                );

                return;

            }


            // ------------------------------------------------
            // GUARDAR NUEVO USUARIO
            // ------------------------------------------------

            usuarios.push(usuario);


            localStorage.setItem(
                "cct_usuarios",
                JSON.stringify(usuarios)
            );


            // ------------------------------------------------
            // MENSAJE DE CONFIRMACIÓN
            // ------------------------------------------------

            alert(
                `¡Registro exitoso, ${nombre}!`
            );


            // ------------------------------------------------
            // LIMPIAR FORMULARIO
            // ------------------------------------------------

            formulario.reset();


            // Volver al menú.

            irA("menu");

        }
    );

}


/* =======================================================
   INICIALIZACIÓN DEL SISTEMA
   =======================================================
   Este código se ejecuta cuando HTML termina de cargar.

   Aquí iniciamos:

   - Equipos
   - Dashboard
   - Laboratorios
   - Registro
   - Simulación de red
   ======================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        // ------------------------------------------------
        // CARGAR EQUIPOS
        // ------------------------------------------------

        cargarEquipos();


        // ------------------------------------------------
        // ACTUALIZAR DASHBOARD
        // ------------------------------------------------

        actualizarDashboard();


        // ------------------------------------------------
        // CARGAR LABORATORIOS
        // ------------------------------------------------

        renderLab(
            "lab1",
            "Laboratorio 1"
        );


        renderLab(
            "lab2",
            "Laboratorio 2"
        );


        renderLab(
            "lab3",
            "Laboratorio 3"
        );


        // ------------------------------------------------
        // CONFIGURAR REGISTRO
        // ------------------------------------------------

        configurarRegistro();


        // ------------------------------------------------
        // LATIDO DE RED
        // ------------------------------------------------
        // Cada 30 segundos se actualiza la actividad
        // simulada de los equipos.

        setInterval(
            latidoRed,
            30000
        );
    }
);

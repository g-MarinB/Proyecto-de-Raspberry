const SERVIDOR = "http://localhost:8000"; // cambia por la IP de la Pi si no es la misma máquina

const button = document.getElementById("lights");
const shower = document.getElementById("win");
const opener = document.getElementById("names");
const closer = document.getElementById("back");
let on = false;

// Actualiza solo la apariencia del botón según el valor de `on`
function actualizarBoton() {
    if (on) {
        button.style.setProperty('--hl', "#12f13f");
        button.textContent = "Encendido";
    } else {
        button.style.setProperty('--hl', "#dc143c");
        button.textContent = "Apagado";
    }
}

// Envía el estado de `on` al servidor Python
async function enviarEstado() {
    const ruta = on ? "/on" : "/off";
    const res = await fetch(SERVIDOR + ruta);
    return await res.json();
}

// Al cargar la página, lee el estado real del relé
async function sincronizar() {
    try {
        const res = await fetch(SERVIDOR + "/estado");
        const data = await res.json();
        on = (data.estado === "ENCENDIDO");
    } catch (error) {
        console.error("No se pudo conectar al servidor:", error);
    }
    actualizarBoton();
}

button.addEventListener("click", async () => {
    on = !on; // alterna true/false
    try {
        await enviarEstado();
        actualizarBoton();
    } catch (error) {
        on = !on; // si falla la conexión, deshace el cambio
        console.error("No se pudo conectar al servidor:", error);
        alert("No se pudo comunicar con el servidor.");
    }
});

opener.addEventListener("click", () => {
    shower.showModal();
});
closer.addEventListener("click", () => {
    shower.close();
});

sincronizar();
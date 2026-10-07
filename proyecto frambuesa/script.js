const SERVIDOR = "http://localhost:8000"; //IP de la Raspberry

const button = document.getElementById("lights");
const shower = document.getElementById("win");
const opener = document.getElementById("names");
const closer = document.getElementById("back");
let on = false;

function actualizarBoton() {
    if (on) {
        button.style.setProperty('--hl', "#12f13f");
        button.textContent = "Encendido";
    } else {
        button.style.setProperty('--hl', "#dc143c");
        button.textContent = "Apagado";
    }
}

async function enviarEstado() {
    const ruta = on ? "/on" : "/off";
    const res = await fetch(SERVIDOR + ruta);
    return await res.json();
}

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
    on = !on;
    try {
        await enviarEstado();
        actualizarBoton();
    } catch (error) {
        on = !on;
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
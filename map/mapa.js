document.addEventListener('DOMContentLoaded', () => {
    const areas = document.querySelectorAll('area');
    const modal = document.getElementById('modal-opciones');
    const modalContent = modal.querySelector('.botones-opciones');
    const modalTitulo = document.getElementById('modal-titulo');
    const cerrarBtn = modal.querySelector('.cerrar-modal');
    let sitiosData = [];

    // Función para cargar los datos de los sitios turísticos
    async function cargarSitios() {
        try {
            const response = await fetch('sitios.json');
            sitiosData = await response.json();
        } catch (error) {
            console.error('Error al cargar sitios.json:', error);
        }
    }

    // Función que genera el contenido del modal y lo muestra
    function mostrarModal(sitio) {
        modalTitulo.textContent = sitio.nombre;
        
        // 1. Botón de Información (URL externa)
        const btnInfo = `<a href="${sitio.info_url}" target="_blank" class="btn btn-info">Información</a>`;

        // 2. Botón de Video (TikTok)
        const btnVideo = `<a href="${sitio.video_url}" target="_blank" class="btn btn-video">Video (TikTok)</a>`;
        
        // 3. Botón de Ruta (Google Maps, usando la ubicación del usuario)
        const googleMapsUrl = `http://googleusercontent.com/maps.google.com/3${sitio.lat},${sitio.lon}&travelmode=driving`;
        const btnRuta = `<a href="${googleMapsUrl}" target="_blank" class="btn btn-ruta">Ruta (Google Maps)</a>`;

        // Insertar los botones en el modal
        modalContent.innerHTML = btnInfo + btnVideo + btnRuta;

        // Mostrar el modal
        modal.style.display = 'flex';
    }

    // 4. Lógica principal: Escuchar los clics en las áreas sensibles
    areas.forEach(area => {
        area.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que el navegador intente seguir el '#'

            const sitioId = parseInt(area.dataset.sitioId);
            const sitioEncontrado = sitiosData.find(s => s.id === sitioId);

            if (sitioEncontrado) {
                mostrarModal(sitioEncontrado);
            }
        });
    });

    // 5. Lógica para cerrar el modal
    cerrarBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cierra el modal si se hace clic fuera de su contenido
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Iniciar la carga de datos al cargar la página
    cargarSitios();
});

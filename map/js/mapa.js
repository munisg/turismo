document.addEventListener('DOMContentLoaded', () => {
    const areas = document.querySelectorAll('area');
    const modal = document.getElementById('modal-opciones');
    const modalContent = modal.querySelector('.botones-opciones');
    const modalTitulo = document.getElementById('modal-titulo');
    const cerrarBtn = modal.querySelector('.cerrar-modal');
    let sitiosData = [];

    // Función para cargar los datos de los sitios turísticos (Async)
    async function cargarSitios() {
        try {
            const response = await fetch('js/sitios.json');
            sitiosData = await response.json();
        } catch (error) {
            console.error('Error al cargar sitios.json:', error);
            // IMPORTANTE: Si hay un error, el script no podrá funcionar.
            alert('Error: No se pudieron cargar los datos turísticos.');
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
        // NOTA: Revisé la URL de Google Maps y la simplifiqué para la navegación con destino:
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${sitio.lat},${sitio.lon}`;
        const btnRuta = `<a href="${googleMapsUrl}" target="_blank" class="btn btn-ruta">Ruta (Google Maps)</a>`;

        // Insertar los botones en el modal
        modalContent.innerHTML = btnInfo + btnVideo + btnRuta;

        // Mostrar el modal
        modal.style.display = 'flex';
    }

    // Función principal asíncrona
    async function main() {
        // 1. ESPERAR A QUE LOS DATOS SE CARGUEN COMPLETAMENTE
        await cargarSitios(); 

        // 2. Lógica para cerrar el modal (puede ir antes de la carga, pero la ponemos aquí por orden)
        cerrarBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Cierra el modal si se hace clic fuera de su contenido
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // 3. INICIAR LA ESCUCHA DE CLICS SOLO DESPUÉS DE QUE LOS DATOS ESTÉN LISTOS
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
        imageMapResize();
    }

    // Ejecutar la función principal
    main();
});

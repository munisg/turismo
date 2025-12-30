document.addEventListener('DOMContentLoaded', () => {
    const areas = document.querySelectorAll('area');
    const modal = document.getElementById('modal-opciones');
    const modalContent = modal.querySelector('.botones-opciones');
    const modalTitulo = document.getElementById('modal-titulo');
    const cerrarBtn = modal.querySelector('.cerrar-modal');
    let sitiosData = [];

    // --- 2. CONSTANTES DE VIDEO Y AUDIO ---
    const bienvenidaDiv = document.getElementById('bienvenida-video');
    const videoIntro = document.getElementById('video-intro');
    const btnActivarSonido = document.getElementById('btn-activar-sonido');
    const musicaFondo = document.getElementById('musica-fondo');

    // Función para cargar los datos de los sitios turísticos (Async)
    async function cargarSitios() {
        try {
            const response = await fetch('js/sitios.json');
            sitiosData = await response.json();
        } catch (error) {
            console.error('Error al cargar sitios.json:', error);
            alert('Error: No se pudieron cargar los datos turísticos.');
        }
    }

    // Función que genera el contenido del modal y lo muestra
    function mostrarModal(sitio) {
    modalTitulo.textContent = sitio.nombre;
    const modalMedia = document.getElementById('modal-media');
    
    // Limpiar y cargar multimedia
    if (sitio.media_url) {
        const esVideo = sitio.media_url.toLowerCase().endsWith('.mp4');
        modalMedia.innerHTML = esVideo 
            ? `<video src="${sitio.media_url}" autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover;"></video>`
            : `<img src="${sitio.media_url}" alt="${sitio.nombre}" style="width:100%;height:100%;object-fit:cover;">`;
    }

    // BOTONES CORREGIDOS: Asegúrate de usar las comillas backticks ( ` )
    // La URL de Google Maps debe ser exactamente así:
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${sitio.lat},${sitio.lon}`;

    modalContent.innerHTML = `
        <a href="${sitio.info_url}" target="_blank" class="btn-info">ℹ️ Información</a>
        <a href="${sitio.video_url}" target="_blank" class="btn-video">🎥 Video TikTok</a>
        <a href="${googleMapsUrl}" target="_blank" class="btn-ruta">📍 Cómo llegar</a>
    `;

    modal.style.display = 'flex';
}

    // --- 4. FUNCIONES DE CONTROL DE VIDEO/AUDIO ---

    function finalizarVideo() {
        bienvenidaDiv.classList.add('oculto');
        setTimeout(() => {
            if (bienvenidaDiv) bienvenidaDiv.remove();
        }, 1000);
    }

    function manejarAudio() {
        musicaFondo.muted = false; 
        musicaFondo.play().catch(error => {
            console.warn('Reproducción de música bloqueada.');
        });
        btnActivarSonido.style.display = 'none';
        btnActivarSonido.removeEventListener('click', manejarAudio);
    }

    // Función principal asíncrona
    async function main() {
        // 1. ESPERAR A QUE LOS DATOS SE CARGUEN
        await cargarSitios(); 

        // 2. CONFIGURACIÓN DE LA SECUENCIA DE BIENVENIDA
        btnActivarSonido.addEventListener('click', manejarAudio);
        
        musicaFondo.play().catch(error => {
            console.warn('Música de fondo esperando interacción.');
        });

        videoIntro.addEventListener('ended', finalizarVideo);

        videoIntro.addEventListener('play', () => {
            btnActivarSonido.style.display = 'block'; 
        });

        videoIntro.play().catch(error => {
            console.warn('Autoplay bloqueado. Omitiendo intro.');
            finalizarVideo();
        });

        // 3. LÓGICA PARA CERRAR EL MODAL Y LIMPIAR MULTIMEDIA
        cerrarBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.getElementById('modal-media').innerHTML = ''; // Limpia video/imagen
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.getElementById('modal-media').innerHTML = ''; // Limpia video/imagen
            }
        });
        
        // 4. INICIAR LA ESCUCHA DE CLICS EN LAS ÁREAS DEL MAPA
        areas.forEach(area => {
            area.addEventListener('click', (e) => {
                e.preventDefault(); 
                const sitioId = parseInt(area.dataset.sitioId);
                const sitioEncontrado = sitiosData.find(s => s.id === sitioId);

                if (sitioEncontrado) {
                    mostrarModal(sitioEncontrado);
                }
            });
        });

        // 5. AJUSTAR COORDENADAS RESPONSIVAS
        if (typeof imageMapResize === 'function') {
            imageMapResize();
        }
    }

    main();
});

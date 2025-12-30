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
            // IMPORTANTE: Si hay un error, el script no podrá funcionar.
            alert('Error: No se pudieron cargar los datos turísticos.');
        }
    }

// Función que genera el contenido del modal y lo muestra
    function mostrarModal(sitio) {
        modalTitulo.textContent = sitio.nombre;
        
        // 1. REFERENCIA AL CONTENEDOR MULTIMEDIA (El rectángulo verde/negro)
        const modalMedia = document.getElementById('modal-media');
        
        // Verificamos si el archivo es un video o una imagen para mostrar el elemento correcto
        // Asegúrate de que en tu sitios.json el campo se llame 'media_url'
        const esVideo = sitio.media_url.toLowerCase().endsWith('.mp4');

        if (esVideo) {
            modalMedia.innerHTML = `
                <video src="${sitio.media_url}" autoplay loop muted playsinline 
                       style="width:100%; height:100%; object-fit:cover;">
                </video>`;
        } else {
            modalMedia.innerHTML = `
                <img src="${sitio.media_url}" alt="${sitio.nombre}" 
                     style="width:100%; height:100%; object-fit:cover;">`;
        }
        
        // 2. GENERACIÓN DE BOTONES
        const btnInfo = `<a href="${sitio.info_url}" target="_blank" class="btn-info">Información</a>`;
        const btnVideo = `<a href="${sitio.video_url}" target="_blank" class="btn-video">Video TikTok</a>`;
        
        // URL de Google Maps (simplificada para navegación)
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${sitio.lat},${sitio.lon}`;
        const btnRuta = `<a href="${googleMapsUrl}" target="_blank" class="btn-ruta">Cómo llegar</a>`;

        // Insertar los botones en el modal
        modalContent.innerHTML = btnInfo + btnVideo + btnRuta;

        // Mostrar el modal
        modal.style.display = 'flex';
    }

    // --- 4. FUNCIONES DE CONTROL DE VIDEO/AUDIO ---

    // Función que se llama al terminar el video o al ser omitido
    function finalizarVideo() {
        // La música ya está tocando (silenciada o no), solo la dejamos en bucle.
        bienvenidaDiv.classList.add('oculto');
        
        // Remover el elemento después de la transición (1 segundo)
        setTimeout(() => {
            bienvenidaDiv.remove();
        }, 1000);
    }

    // Función que se llama con el Clic del Turista (Desbloquea el sonido ambiental)
    function manejarAudio() {
        // Activa el sonido del audio ambiental
        musicaFondo.muted = false; 
        
        // Intenta forzar la reproducción (si el navegador no lo hizo automáticamente)
        musicaFondo.play().catch(error => {
            console.warn('Reproducción de música bloqueada en el primer intento.');
        });
        
        // Oculta el botón y elimina el listener (solo se necesita un clic)
        btnActivarSonido.style.display = 'none';
        btnActivarSonido.removeEventListener('click', manejarAudio);
    }

    // Función principal asíncrona
    async function main() {
        // 1. ESPERAR A QUE LOS DATOS SE CARGUEN COMPLETAMENTE
        await cargarSitios(); 


        // 2. CONFIGURACIÓN DE LA SECUENCIA DE BIENVENIDA
        
        // A. Asignar el evento de un solo clic para el desbloqueo de audio
        btnActivarSonido.addEventListener('click', manejarAudio);
        
        // B. Iniciar la reproducción silenciosa de la música de fondo
        musicaFondo.play().catch(error => {
            console.warn('Música de fondo no pudo iniciar automáticamente (silencio).');
        });

        // C. Escuchar cuando el video de intro termina para ocultarlo
        videoIntro.addEventListener('ended', finalizarVideo);

        // D. Mostrar el botón cuando el video inicie (interacción necesaria)
        videoIntro.addEventListener('play', () => {
            btnActivarSonido.style.display = 'block'; 
        });

        // E. Iniciar la reproducción del video (silencioso por defecto)
        videoIntro.play().catch(error => {
            // Si hay error (bloqueo), omitimos el video inmediatamente para mostrar el mapa
            console.warn('Autoplay del video bloqueado. Omitiendo intro.');
            finalizarVideo();
        });

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

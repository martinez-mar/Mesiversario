
// ============================================
// ⚙️ CONFIGURACIÓN DE LA PLANTILLA
// ============================================
// 
// 📝 INSTRUCCIONES:
// Este archivo controla TODO el contenido de tu sitio web de aniversario.
// Solo necesitas editar los textos, fechas y rutas de archivos aquí.
// NO necesitas tocar ningún otro archivo del proyecto.
//
// 💡 CONSEJOS:
// - Los textos entre comillas ("") pueden contener emojis
// - Las fechas deben estar en formato: "YYYY-MM-DD" (Año-Mes-Día)
// - Las rutas de archivos deben apuntar a la carpeta assets/
// - Puedes usar <br> para saltos de línea en los textos
// ============================================

const config = {
    // ============================================
    // 1️⃣ CONFIGURACIÓN GENERAL
    // ============================================
    // Este título aparecerá en la pestaña del navegador
    pageTitle: "Nuestro Aniversario ❤️",
    // Icono que aparece en la pestaña (puede ser .svg, .png, .ico)
    // Asegúrate de poner el archivo en la carpeta assets/
    favicon: "assets/favicon.svg",

    // ============================================
    // 2️⃣ MÚSICA DE FONDO
    // ============================================
    music: {
        // Ruta de tu canción favorita (debe estar en la carpeta assets/)
        // Formatos soportados: .mp3, .wav, .ogg
        path: "", // 🔇 Déjalo vacío si no tienes música aún

        // Volumen de la música (0.0 = silencio, 1.0 = máximo)
        volume: 0.3,

        // ¿Reproducir automáticamente? (true = sí, false = no)
        autoPlay: true
    },

    // ============================================
    // 3️⃣ PANTALLA DE CARGA
    // ============================================
    loading: {
        // Mensaje que aparece en la pantalla de inicio
        message: "Algo especial te espera...",

        // Texto del botón para comenzar
        buttonText: "Comenzar ✨",

        // Texto de ayuda que aparece arriba del botón
        clickHint: "Haz clic para comenzar"
    },

    // ============================================
    // 4️⃣ SECCIÓN HERO (PANTALLA PRINCIPAL)
    // ============================================
    hero: {
        // Título principal que aparece al inicio
        title: "Nuestra historia de amor...",

        // ⚠️ IMPORTANTE: Fecha de inicio de tu relación (YYYY-MM-DD)
        // El contador calculará automáticamente el tiempo transcurrido
        // Ejemplo: "2024-02-14" para el 14 de febrero de 2024
        startDate: "2024-01-01",

        // Texto que aparece después del contador
        finalText: "¡Y seguimos escribiendo nuestra historia!",

        // Texto del indicador de scroll
        scrollText: "Desliza para continuar"
    },

    // ============================================
    // 5️⃣ LÍNEA DE TIEMPO (TU HISTORIA)
    // ============================================
    // Aquí cuentas tu historia en eventos cronológicos
    // Puedes agregar o eliminar eventos según necesites
    timeline: [
        // ========== EVENTO 1 ==========
        {
            // Título del evento (puedes usar emojis)
            title: "🌟 El primer encuentro",

            // Descripción del evento (puedes usar HTML como <br> para saltos de línea)
            content: `Escribe aquí cómo se conocieron...<br>Puedes agregar varios párrafos.`,

            // Imágenes del evento (opcional)
            // Puedes agregar varias imágenes separadas por comas
            images: [
                "assets/placeholder.svg",
                "assets/placeholder.svg"
            ],

            // Videos del evento (opcional)
            // Descomenta la siguiente línea si quieres agregar videos
            // videos: ["assets/video1.mp4"],

            // Pie de foto o comentario adicional
            footer: "Ese día cambió todo..."
        },

        // ========== EVENTO 2 ==========
        {
            title: "💬 La primera conversación",
            content: `Describe ese primer mensaje o llamada que cambió todo...`,
            images: ["assets/placeholder.svg"],
            footer: "Desde ese momento, no dejamos de hablar"
        },

        // ========== EVENTO 3 ==========
        {
            title: "❤️ La primera cita",
            content: `Cuenta los detalles de su primera cita...<br>¿Dónde fueron? ¿Qué hicieron?`,
            images: ["assets/placeholder.svg"],
            footer: "Nervios, risas y mariposas en el estómago"
        },

        // ========== EVENTO 4 ==========
        {
            title: "🎉 Oficialmente juntos",
            content: `El día en que decidieron formalizar su relación...`,
            images: ["assets/placeholder.svg"],

            // Campo "extra" para agregar más contenido al final del evento
            extra: `<br>Y desde entonces, cada día es una nueva aventura juntos.`
        },

        // 💡 CONSEJO: Puedes copiar y pegar este bloque para agregar más eventos:
        /*
        {
            title: "🎈 Título del evento",
            content: `Descripción del evento...`,
            images: ["assets/placeholder.svg"],
            footer: "Comentario adicional"
        },
        */
    ],

    // ============================================
    // 6️⃣ GALERÍA DE FOTOS
    // ============================================
    gallery: {
        // Título de la sección de galería
        title: "Nuestros momentos favoritos",

        // Lista de fotos para la galería
        // Agrega tantas como quieras, separadas por comas
        images: [
            "assets/placeholder.svg",
            "assets/placeholder.svg",
            "assets/placeholder.svg",
            "assets/placeholder.svg",
            "assets/placeholder.svg",
            "assets/placeholder.svg",
            "assets/placeholder.svg",
            "assets/placeholder.svg",
            "assets/placeholder.svg",
            "assets/placeholder.svg",
            "assets/placeholder.svg",
            "assets/placeholder.svg"
            // Agrega más fotos aquí...
        ]
    },

    // ============================================
    // 7️⃣ MENSAJE FINAL
    // ============================================
    finalMessage: {
        // Mensaje de cierre (puedes usar <br> para saltos de línea)
        content: "Gracias por ser parte de mi vida ❤️<br>Te amo más cada día..."
    }
};

// ============================================
// ✅ ¡LISTO!
// ============================================
// Guarda este archivo y recarga tu navegador para ver los cambios.
// Recuerda colocar tus fotos, videos y música en la carpeta assets/
// ============================================

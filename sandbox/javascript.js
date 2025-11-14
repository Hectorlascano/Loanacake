// Sistema Modal para Álbumes de Google Photos
class AlbumModal {
    constructor() {
        this.modal = document.getElementById('albumModal');
        this.iframe = document.getElementById('albumFrame');
        this.closeBtn = document.querySelector('.modal-close');
        this.overlay = document.querySelector('.modal-overlay');
        
        this.init();
    }
    
    init() {
        // Configurar event listeners
        this.closeBtn.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', () => this.close());
        
        // Cerrar con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
        
        // Prevenir que clicks dentro del iframe cierren el modal
        this.iframe.addEventListener('load', () => {
            this.iframe.contentWindow.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
        
        // Configurar clicks en tarjetas de álbumes
        this.setupAlbumCards();
    }
    
    setupAlbumCards() {
        const albumCards = document.querySelectorAll('.category-card[data-album]');
        
        albumCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const albumId = card.getAttribute('data-album');
                this.open(albumId);
            });
        });
    }
    
    open(albumId) {
        // Construir URL del iframe de Google Photos
        const iframeUrl = this.buildIframeUrl(albumId);
        
        // Cargar el iframe
        this.iframe.src = iframeUrl;
        
        // Mostrar modal
        this.modal.classList.add('active');
        document.body.classList.add('modal-open');
        
        // Enfocar el botón de cerrar para accesibilidad
        this.closeBtn.focus();
    }
    
    buildIframeUrl(albumId) {
        // URL base para álbumes compartidos de Google Photos
        return `https://photos.app.goo.gl/${albumId}`;
    }
    
    close() {
        this.modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        
        // Limpiar el iframe para liberar memoria
        this.iframe.src = '';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new AlbumModal();
});

// Fallback: Si el modal no funciona, permitir click derecho para abrir en nueva pestaña
document.addEventListener('contextmenu', (e) => {
    const card = e.target.closest('.category-card[data-album]');
    if (card) {
        const originalHref = card.getAttribute('href');
        card.setAttribute('href', originalHref);
    }
});

// Manejar errores de carga del iframe
window.addEventListener('message', (e) => {
    // Aquí puedes manejar mensajes del iframe si es necesario
    console.log('Mensaje del iframe:', e.data);
});

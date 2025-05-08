import React, { useState, useEffect, useRef } from 'react';
import styles from './GaleriaMultimedia.module.css';

function NuestrosEventos() {
  const [eventos] = useState([
    { 
      id: 1, 
      title: 'Egresado Sobresaliente', 
      imageUrl: '/assets/eventos/egresado1.jpg', 
      linkUrl: '#',
      fecha: '12 Mayo, 2025' 
    },
    { 
      id: 2, 
      title: 'Conozca a Giovanni', 
      imageUrl: '/assets/eventos/evento2.jpg', 
      linkUrl: '#',
      fecha: '18 Mayo, 2025' 
    },
    { 
      id: 3, 
      title: 'Campamento XR', 
      imageUrl: '/assets/eventos/campamento.jpg', 
      linkUrl: '#',
      fecha: '25 Mayo, 2025' 
    },
    { 
      id: 4, 
      title: 'Especialización', 
      imageUrl: '/assets/eventos/ingenieria.jpg', 
      linkUrl: '#',
      fecha: '2 Junio, 2025' 
    },
    { 
      id: 5, 
      title: 'Feria de Empleo', 
      imageUrl: '/assets/eventos/feria.jpg', 
      linkUrl: '#',
      fecha: '10 Junio, 2025' 
    },
    { 
      id: 6, 
      title: 'Congreso Anual', 
      imageUrl: '/assets/eventos/congreso.jpg', 
      linkUrl: '#',
      fecha: '15 Junio, 2025' 
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Función para avanzar al siguiente evento
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % eventos.length);
  };

  // Función para ir al slide anterior
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + eventos.length) % eventos.length);
  };

  // Configurar el carrusel automático
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 3000); // Cambiar cada 3 segundos
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, eventos.length]);

  // Función para pausar/reanudar el carrusel
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className={styles.seccionEventos}>
      <div className={styles.eventosHeader}>
        <h3>Nuestros Eventos - Noticias Destacadas</h3>
        <button 
          className={styles.pauseButton}
          onClick={togglePause}
          aria-label={isPaused ? "Reanudar" : "Pausar"}
        >
          {isPaused ? "▶ Reanudar" : "⏸️ Pausar"}
        </button>
      </div>
      
      <div className={styles.singleCarouselContainer}>
        <button 
          className={`${styles.carouselBtn} ${styles.prevBtn}`}
          onClick={prevSlide}
          aria-label="Anterior"
        >
          &#10094;
        </button>
        
        <div className={styles.singleEventoContainer}>
          {eventos.map((evento, index) => (
            <div 
              key={evento.id} 
              className={`${styles.eventoSlide} ${index === currentIndex ? styles.activeSlide : ''}`}
            >
              {index === currentIndex && (
                <div className={styles.eventoCard}>
                  <a href={evento.linkUrl} target="_blank" rel="noopener noreferrer" className={styles.eventoCardA}>
                    <div className={styles.eventoImageContainer}>
                      <img src={evento.imageUrl} alt={evento.title} className={styles.eventoImagen} />
                    </div>
                    <div className={styles.eventoInfo}>
                      <div className={styles.eventoTitulo}>{evento.title}</div>
                      <div className={styles.eventoFecha}>{evento.fecha}</div>
                    </div>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <button 
          className={`${styles.carouselBtn} ${styles.nextBtn}`}
          onClick={nextSlide}
          aria-label="Siguiente"
        >
          &#10095;
        </button>
      </div>
      
      <div className={styles.carouselIndicators}>
        {eventos.map((_, index) => (
          <span 
            key={index} 
            className={`${styles.indicator} ${currentIndex === index ? styles.activeIndicator : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default NuestrosEventos;
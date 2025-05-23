import { useState, useEffect, useRef } from 'react';
import styles from './GaleriaMultimedia.module.css';

import jornadainvestigacionImg from '../../assets/jornadainvestigacion.jpg';
import estructuradatosImg from '../../assets/estructuradatos.jpg';
import talentotechImg from '../../assets/talentotech.jpg';
import innovacionamchamImg from '../../assets/innovacionamcham.jpg'; // Corregido: asumimos que el nombre del archivo es 'innovacionamcham.jpg'
import viverovirtualImg from '../../assets/viverovirtual.jpg';
import metaversoImg from '../../assets/metaverso.jpg';

function NuestrosEventos() {
  const [eventos] = useState([
    {
      id: 1,
      title: 'Jornada de Investigacion', // Corregido el typo "Sfotware" a "Software"
      imageUrl: jornadainvestigacionImg, // ¡USO LA VARIABLE IMPORTADA!
      linkUrl: '#',
      fecha: '2 Septiembre, 2019'
    },
    {
      id: 2,
      title: 'Primer Curso de Programación',
      imageUrl: estructuradatosImg, // ¡USO LA VARIABLE IMPORTADA!
      linkUrl: '#',
      fecha: '27 Marzo, 2023'
    },
    {
      id: 3,
      title: 'Talento Tech',
      imageUrl: talentotechImg, // ¡USO LA VARIABLE IMPORTADA!
      linkUrl: '#',
      fecha: '29 Febrero, 2025'
    },
    {
      id: 4,
      title: 'Innovación AmCham Panama',
      imageUrl: innovacionamchamImg, // ¡USO LA VARIABLE IMPORTADA!
      linkUrl: '#',
      fecha: '2 Marzo, 2025'
    },
    {
      id: 5,
      title: 'Vivero Virtual',
      imageUrl: viverovirtualImg, // ¡USO LA VARIABLE IMPORTADA!
      linkUrl: '#',
      fecha: '10 Junio, 2025'
    },
    {
      id: 6,
      title: 'Campamento XR Metaverso',
      imageUrl: metaversoImg, // ¡USO LA VARIABLE IMPORTADA!
      linkUrl: '#',
      fecha: '16 Junio, 2025'
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused] = useState(false); // Removed setIsPaused as it's unused
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
  }, [isPaused, eventos.length, nextSlide]);


  return (
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
                <div className={styles.eventoImageContainer}>
                  <a
                    href={evento.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.eventoCardA}
                  >
                    <img
                      src={evento.imageUrl}
                      alt={evento.title}
                      className={styles.eventoImagen}
                    />
                    <div className={styles.eventoInfo}>
                      <div className={styles.eventoTitulo}>{evento.title}</div>
                      <div className={styles.eventoFecha}>{evento.fecha}</div>
                    </div>
                  </a>
                </div>
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
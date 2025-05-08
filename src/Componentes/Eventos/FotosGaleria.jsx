import React, { useState } from 'react';
import styles from './GaleriaMultimedia.module.css';

function FotosGaleria() {
  const [imagenes] = useState([
    { 
      id: 1, 
      url: '/assets/eventos/foto1.jpg', 
      alt: 'Ceremonia de Graduación', 
      descripcion: 'Ceremonia de Graduación 2024' 
    },
    { 
      id: 2, 
      url: '/assets/eventos/foto2.jpg', 
      alt: 'Conferencia Internacional', 
      descripcion: 'Conferencia Internacional de Innovación' 
    },
    { 
      id: 3, 
      url: '/assets/eventos/foto3.jpg', 
      alt: 'Taller de Emprendimiento', 
      descripcion: 'Taller de Emprendimiento Sostenible' 
    },
    { 
      id: 4, 
      url: '/assets/eventos/foto4.jpg', 
      alt: 'Feria de Proyectos', 
      descripcion: 'Feria de Proyectos Estudiantiles' 
    },
    { 
      id: 5, 
      url: '/assets/eventos/foto5.jpg', 
      alt: 'Actividad Deportiva', 
      descripcion: 'Torneo Deportivo Interuniversitario' 
    },
    { 
      id: 6, 
      url: '/assets/eventos/foto6.jpg', 
      alt: 'Concierto Benéfico', 
      descripcion: 'Concierto Benéfico Anual' 
    },
    { 
      id: 7, 
      url: '/assets/eventos/foto7.jpg', 
      alt: 'Seminario Tecnológico', 
      descripcion: 'Seminario de Nuevas Tecnologías' 
    },
    { 
      id: 8, 
      url: '/assets/eventos/foto8.jpg', 
      alt: 'Voluntariado Comunitario', 
      descripcion: 'Jornada de Voluntariado Comunitario' 
    },
  ]);

  const [selectedImage, setSelectedImage] = useState(null);

  const openImage = (imagen) => {
    setSelectedImage(imagen);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className={styles.seccionFotos}>
      <h3>Fotografías de Eventos y Actividades</h3>
      
      <div className={styles.gridImagenes}>
        {imagenes.map(img => (
          <div 
            key={img.id} 
            className={styles.imagenWrapper}
            onClick={() => openImage(img)}
          >
            <img
              src={img.url}
              alt={img.alt}
              className={styles.imagenGaleria}
            />
            <div className={styles.imagenOverlay}>
              <p>{img.descripcion}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px',
            cursor: 'pointer'
          }}
          onClick={closeImage}
        >
          <div 
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            <img 
              src={selectedImage.url} 
              alt={selectedImage.alt}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
              }}
            />
            <div 
              style={{
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '0 0 8px 8px',
                textAlign: 'center'
              }}
            >
              <h4 style={{ margin: '0 0 5px 0' }}>{selectedImage.alt}</h4>
              <p style={{ margin: 0, color: '#666' }}>{selectedImage.descripcion}</p>
            </div>
            <button 
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                border: 'none',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '18px'
              }}
              onClick={closeImage}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FotosGaleria;
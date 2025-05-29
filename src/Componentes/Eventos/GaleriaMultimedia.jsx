import React, { useState } from 'react';
import NuestrosEventos from './NuestroEventos.jsx';    // “Promoción”
import EventosLista   from './EventoLista.jsx';       // nueva pestaña “Eventos”
import FotosGaleria   from './FotosGaleria.jsx';       // “Evidencia Fotográfica”
import VideosGaleria  from './VideosGaleria.jsx';
import styles        from './GaleriaMultimedia.module.css';

function GaleriaMultimedia() {
  const [activeTab, setActiveTab] = useState('promocion');

  const renderContent = () => {
    switch (activeTab) {
      case 'promocion': return <NuestrosEventos />;
      case 'eventos':   return <EventosLista />;
      case 'evidencia': return <FotosGaleria />;
      case 'videos':    return <VideosGaleria />;
      default:          return <NuestrosEventos />;
    }
  };

  return (
    <div className={styles.galeriaContainer}>
      <div className={styles.tituloBarra}>
        <h2>Galería Multimedia</h2>
      </div>
      
      <div className={styles.tabNav}>
        <button
          className={`${styles.tabButton} ${activeTab === 'promocion' ? styles.active : ''}`}
          onClick={() => setActiveTab('promocion')}
        >
          Promoción
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'eventos' ? styles.active : ''}`}
          onClick={() => setActiveTab('eventos')}
        >
          Eventos
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'evidencia' ? styles.active : ''}`}
          onClick={() => setActiveTab('evidencia')}
        >
          Evidencia Fotográfica
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'videos' ? styles.active : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          Videos
        </button>
      </div>
      
      <div className={styles.tabContent}>
        {renderContent()}
      </div>
    </div>
  );
}

export default GaleriaMultimedia;

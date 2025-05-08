import React, { useState } from 'react';
import NuestrosEventos from './NuestroEventos.jsx'; 
import FotosGaleria from './FotosGaleria.jsx';       
import VideosGaleria from './VideosGaleria.jsx';    
import styles from './GaleriaMultimedia.module.css';

function GaleriaMultimedia() {
  const [activeTab, setActiveTab] = useState('events');

  const renderContent = () => {
    switch (activeTab) {
      case 'eventos':
        return <NuestrosEventos />;
      case 'fotos':
        return <FotosGaleria />;
      case 'videos':
        return <VideosGaleria />;
      default:
        return <NuestrosEventos />;
    }
  };

  return (
    <div className={styles.galeriaContainer}>
      <div className={styles.tituloBarra}>
        <h2>Galería Multimedia</h2>
      </div>
      
      <div className={styles.tabNav}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'eventos' ? styles.active : ''}`}
          onClick={() => setActiveTab('eventos')}
        >
          Eventos
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'fotos' ? styles.active : ''}`}
          onClick={() => setActiveTab('fotos')}
        >
          Fotografías
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
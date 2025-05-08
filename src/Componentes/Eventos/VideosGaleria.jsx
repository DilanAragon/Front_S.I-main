import React from 'react';
import styles from './GaleriaMultimedia.module.css';

function VideosGaleria() {
  const videos = [
    {
      id: 1,
      title: 'Video Institucional',
      link: 'https://www.youtube.com/embed/your_video_id_1', // Reemplaza con el ID real del video de YouTube
      descripcion: 'Conozca nuestra institución, su historia y misión educativa'
    },
    {
      id: 2,
      title: 'Testimonio Egresado',
      link: 'https://www.youtube.com/embed/your_video_id_2', // Reemplaza con el ID real del video de YouTube
      descripcion: 'Historia de éxito de nuestros graduados en el campo profesional'
    },
  ];

  return (
    <div className={styles.seccionVideos}>
      <h3>Videos Institucionales y Testimoniales</h3>

      <div className={styles.videoGrid}>
        {videos.map(video => (
          <div key={video.id} className={styles.videoItem}>
            <div className={styles.videoItemHeader}>
              <h4>{video.title}</h4>
            </div>
            <div className={styles.videoContainer}>
              <iframe
                className={styles.videoContainerIframe}
                src={video.link}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            <div className={styles.videoInfo}>
              <p>{video.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideosGaleria;
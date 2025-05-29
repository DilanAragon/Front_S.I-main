import React, { useState, useEffect } from 'react';
import styles from './EventoLista.module.css';

export default function EventosLista() {
  const [eventos, setEventos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/eventos/`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setEventos(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return <p className={styles.error}>Error al cargar eventos: {error}</p>;
  }

  return (
    <div className={styles.listaContainer}>
      <h3 className={styles.subtitulo}>Listado de Eventos</h3>
      <table className={styles.eventosTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Asistentes</th>
            <th>Multimedia</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map(evt => (
            <tr key={evt.evento_id}>
              <td>{evt.evento_id}</td>
              <td>{evt.tipo}</td>
              <td>{evt.fecha}</td>
              <td>{evt.asistentes}</td>
              <td>{evt.multimedia}</td>
              <td>{evt.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React from "react";
import "./HistoriaDestacada.css";

const HistoriaDestacada = ({ historia }) => {
  return (
    <div className="historia-destacada">
      <div className="historia-imagen">
        <img src={historia.imagen} alt={historia.nombre} />
      </div>
      <div className="historia-contenido">
        <h3>{historia.nombre}</h3>
        <p className="historia-titulo">{historia.titulo}</p>
        <p className="historia-descripcion">{historia.descripcion}</p>

        {historia.logros && historia.logros.length > 0 && (
          <div className="historia-logros">
            <h4>Logros destacados:</h4>
            <ul>
              {historia.logros.map((logro, index) => (
                <li key={index}>{logro}</li>
              ))}
            </ul>
          </div>
        )}

        <button className="ver-mas-button">Ver historia completa</button>
      </div>
    </div>
  );
};

export default HistoriaDestacada;

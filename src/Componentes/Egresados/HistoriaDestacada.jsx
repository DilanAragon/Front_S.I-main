import React from "react";
import "./HistoriaDestacada.css";

const HistoriaDestacada = ({ historia }) => {
  return (
    <div className="historia-destacada">
      <div className="historia-imagen">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="placeholder-icon"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4zm0-2
            c-1.66 0-3-1.34-3-3s1.34-3 
            3-3 3 1.34 3 3-1.34 3-3 3z" 
          />
        </svg>
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
// HistoriaDestacada.css
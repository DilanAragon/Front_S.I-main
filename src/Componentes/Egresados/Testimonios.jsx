import React, { useState } from "react";
import "./Testimonios.css";

const Testimonios = ({ testimonios }) => {
  const [testimonioActivo, setTestimonioActivo] = useState(0);

  const avanzarTestimonio = () => {
    setTestimonioActivo((prevActivo) =>
      prevActivo === testimonios.length - 1 ? 0 : prevActivo + 1
    );
  };

  const retrocederTestimonio = () => {
    setTestimonioActivo((prevActivo) =>
      prevActivo === 0 ? testimonios.length - 1 : prevActivo - 1
    );
  };

  return (
    <div className="testimonios-container">
      <div className="testimonios-carousel">
        <button
          className="carousel-button prev-button"
          onClick={retrocederTestimonio}
          aria-label="Testimonio anterior"
        >
          &#8249;
        </button>

        <div className="testimonios-content">
          {testimonios.map((testimonio, index) => (
            <div
              key={testimonio.id}
              className={`testimonio-card ${
                index === testimonioActivo ? "active" : ""
              }`}
            >
              <div className="testimonio-header">
                <div className="testimonio-imagen">
                  <img src={testimonio.imagen} alt={testimonio.nombre} />
                </div>
                <div className="testimonio-info">
                  <h3>{testimonio.nombre}</h3>
                  <p className="testimonio-graduacion">
                    Promoción {testimonio.graduacion}
                  </p>
                </div>
              </div>
              <div className="testimonio-texto">
                <p>"{testimonio.testimonio}"</p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="carousel-button next-button"
          onClick={avanzarTestimonio}
          aria-label="Siguiente testimonio"
        >
          &#8250;
        </button>
      </div>

      <div className="testimonios-indicadores">
        {testimonios.map((_, index) => (
          <span
            key={index}
            className={`indicador ${
              index === testimonioActivo ? "active" : ""
            }`}
            onClick={() => setTestimonioActivo(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Testimonios;

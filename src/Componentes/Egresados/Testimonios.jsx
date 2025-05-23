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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="placeholder-icon"
                    viewBox="0 0 24 24"
                    width="48"
                    height="48"
                  >
                    <path
                      d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4zm0-2
        c-1.66 0-3-1.34-3-3s1.34-3 
        3-3 3 1.34 3 3-1.34 3-3 3z"
                    />
                  </svg>
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

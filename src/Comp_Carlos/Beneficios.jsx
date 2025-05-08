import React from 'react';
import '../Comp_Carlos/Empresas.css'; // importa los estilos de la card

export default function Beneficios() {
  return (
    <div className="p-6 w-full">
      {/* Título de la sección */}
      <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
        Beneficios de colaborar con el programa
      </h1>

      {/* Card centrada */}
      <div className="card-beneficios-container">
        <div className="card-beneficios">
          <h2 className="beneficios-heading">
            ¿Por qué asociarse con Ingeniería de Sistemas?
          </h2>
          <ul className="beneficios-list">
            <li>Acceso a estudiantes capacitados en tecnologías actuales.</li>
            <li>Participación en proyectos de investigación aplicada.</li>
            <li>Asesoría técnica gratuita en el desarrollo de soluciones.</li>
            <li>Reconocimiento en medios institucionales de la universidad.</li>
            <li>Alianzas a largo plazo para prácticas y empleabilidad.</li>
            <li>Networking con otros actores del sector TI regional.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

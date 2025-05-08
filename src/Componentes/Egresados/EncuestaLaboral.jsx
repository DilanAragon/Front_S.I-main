import React, { useState } from "react";
import "./EncuestaLaboral.css";

const EncuestaLaboral = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    documento: "",
    email: "",
    graduacionYear: "",
    situacionLaboral: "",
    tiempoConseguirEmpleo: "",
    tipoContrato: "",
    sectorEmpresa: "",
    salarioActual: "",
    satisfaccionLaboral: "",
    relacionTrabajoEstudios: "",
    formacionAdicional: [],
    sugerenciasPrograma: "",
  });

  const [enviando, setEnviando] = useState(false);
  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        formacionAdicional: [...formData.formacionAdicional, value],
      });
    } else {
      setFormData({
        ...formData,
        formacionAdicional: formData.formacionAdicional.filter(
          (item) => item !== value
        ),
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviando(true);

    // Simulación de envío del formulario
    setTimeout(() => {
      console.log("Datos de encuesta enviados:", formData);
      setEnviando(false);
      setMensajeEnviado(true);

      // Limpiar el formulario
      setFormData({
        nombre: "",
        documento: "",
        email: "",
        graduacionYear: "",
        situacionLaboral: "",
        tiempoConseguirEmpleo: "",
        tipoContrato: "",
        sectorEmpresa: "",
        salarioActual: "",
        satisfaccionLaboral: "",
        relacionTrabajoEstudios: "",
        formacionAdicional: [],
        sugerenciasPrograma: "",
      });

      // Resetear el mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setMensajeEnviado(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="encuesta-container">
      <div className="encuesta-info">
        <h3>¿Por qué completar esta encuesta?</h3>
        <p>Tu experiencia laboral es valiosa para nosotros y contribuye a:</p>
        <ul>
          <li>Mejorar la calidad del programa académico</li>
          <li>Actualizar el perfil profesional del egresado</li>
          <li>Identificar necesidades del mercado laboral</li>
          <li>Fortalecer las relaciones con el sector empresarial</li>
          <li>Preparar mejor a los futuros egresados</li>
        </ul>
        <p className="encuesta-disclaimer">
          <strong>Nota:</strong> Tus respuestas serán tratadas con
          confidencialidad y solo se utilizarán con fines estadísticos y
          académicos.
        </p>
      </div>

      <div className="encuesta-form-wrapper">
        {mensajeEnviado ? (
          <div className="mensaje-exito">
            <p>¡Gracias por completar la encuesta!</p>
            <p>
              Tu aporte es fundamental para el mejoramiento continuo del
              programa.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="encuesta-form">
            <div className="form-section">
              <h3>Información Personal</h3>

              <div className="form-group">
                <label htmlFor="nombre">Nombre Completo</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="documento">Número de Documento</label>
                  <input
                    type="text"
                    id="documento"
                    name="documento"
                    value={formData.documento}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Correo Electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="graduacionYear">Año de Graduación</label>
                <select
                  id="graduacionYear"
                  name="graduacionYear"
                  value={formData.graduacionYear}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar</option>
                  {Array.from(
                    { length: 30 },
                    (_, i) => new Date().getFullYear() - i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3>Situación Laboral Actual</h3>

              <div className="form-group">
                <label htmlFor="situacionLaboral">
                  ¿Cuál es tu situación laboral actual?
                </label>
                <select
                  id="situacionLaboral"
                  name="situacionLaboral"
                  value={formData.situacionLaboral}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Empleado en área de sistemas">
                    Empleado en área de sistemas
                  </option>
                  <option value="Empleado en otra área">
                    Empleado en otra área
                  </option>
                  <option value="Emprendedor/Empresario">
                    Emprendedor/Empresario
                  </option>
                  <option value="Freelance/Independiente">
                    Freelance/Independiente
                  </option>
                  <option value="Estudiando">Estudiando</option>
                  <option value="Desempleado buscando trabajo">
                    Desempleado buscando trabajo
                  </option>
                  <option value="Desempleado sin buscar trabajo">
                    Desempleado sin buscar trabajo
                  </option>
                </select>
              </div>

              {formData.situacionLaboral &&
                formData.situacionLaboral.includes("Empleado") && (
                  <>
                    <div className="form-group">
                      <label htmlFor="tiempoConseguirEmpleo">
                        ¿Cuánto tiempo te tomó conseguir tu primer empleo
                        después de graduarte?
                      </label>
                      <select
                        id="tiempoConseguirEmpleo"
                        name="tiempoConseguirEmpleo"
                        value={formData.tiempoConseguirEmpleo}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar</option>
                        <option value="Ya trabajaba antes de graduarme">
                          Ya trabajaba antes de graduarme
                        </option>
                        <option value="Menos de 3 meses">
                          Menos de 3 meses
                        </option>
                        <option value="Entre 3 y 6 meses">
                          Entre 3 y 6 meses
                        </option>
                        <option value="Entre 6 meses y 1 año">
                          Entre 6 meses y 1 año
                        </option>
                        <option value="Más de 1 año">Más de 1 año</option>
                      </select>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="tipoContrato">Tipo de Contrato</label>
                        <select
                          id="tipoContrato"
                          name="tipoContrato"
                          value={formData.tipoContrato}
                          onChange={handleChange}
                        >
                          <option value="">Seleccionar</option>
                          <option value="Término indefinido">
                            Término indefinido
                          </option>
                          <option value="Término fijo">Término fijo</option>
                          <option value="Prestación de servicios">
                            Prestación de servicios
                          </option>
                          <option value="Obra o labor">Obra o labor</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="sectorEmpresa">
                          Sector de la Empresa
                        </label>
                        <select
                          id="sectorEmpresa"
                          name="sectorEmpresa"
                          value={formData.sectorEmpresa}
                          onChange={handleChange}
                        >
                          <option value="">Seleccionar</option>
                          <option value="Tecnología/Software">
                            Tecnología/Software
                          </option>
                          <option value="Educación">Educación</option>
                          <option value="Salud">Salud</option>
                          <option value="Gobierno">Gobierno</option>
                          <option value="Banca/Finanzas">Banca/Finanzas</option>
                          <option value="Telecomunicaciones">
                            Telecomunicaciones
                          </option>
                          <option value="Retail/Comercio">
                            Retail/Comercio
                          </option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="salarioActual">
                        Rango Salarial Actual (Mensual)
                      </label>
                      <select
                        id="salarioActual"
                        name="salarioActual"
                        value={formData.salarioActual}
                        onChange={handleChange}
                      >
                        <option value="">Seleccionar</option>
                        <option value="Menos de 1 SMMLV">
                          Menos de 1 SMMLV
                        </option>
                        <option value="Entre 1 y 2 SMMLV">
                          Entre 1 y 2 SMMLV
                        </option>
                        <option value="Entre 2 y 3 SMMLV">
                          Entre 2 y 3 SMMLV
                        </option>
                        <option value="Entre 3 y 4 SMMLV">
                          Entre 3 y 4 SMMLV
                        </option>
                        <option value="Entre 4 y 6 SMMLV">
                          Entre 4 y 6 SMMLV
                        </option>
                        <option value="Más de 6 SMMLV">Más de 6 SMMLV</option>
                      </select>
                    </div>
                  </>
                )}
            </div>

            <div className="form-section">
              <h3>Evaluación de la Formación Recibida</h3>

              <div className="form-group">
                <label htmlFor="satisfaccionLaboral">
                  ¿Qué tan satisfecho estás con tu situación laboral actual?
                </label>
                <div className="rating-container">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating} className="rating-option">
                      <input
                        type="radio"
                        id={`rating-${rating}`}
                        name="satisfaccionLaboral"
                        value={rating}
                        checked={
                          formData.satisfaccionLaboral === rating.toString()
                        }
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor={`rating-${rating}`}>{rating}</label>
                    </div>
                  ))}
                </div>
                <div className="rating-labels">
                  <span>Muy insatisfecho</span>
                  <span>Muy satisfecho</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="relacionTrabajoEstudios">
                  ¿Qué tan relacionado está tu trabajo actual con tus estudios
                  en Ingeniería de Sistemas?
                </label>
                <div className="rating-container">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating} className="rating-option">
                      <input
                        type="radio"
                        id={`relacionTrabajoEstudios-${rating}`}
                        name="relacionTrabajoEstudios"
                        value={rating}
                        checked={
                          formData.relacionTrabajoEstudios === rating.toString()
                        }
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor={`relacionTrabajoEstudios-${rating}`}>
                        {rating}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="rating-labels">
                  <span>Nada relacionado</span>
                  <span>Totalmente relacionado</span>
                </div>
              </div>

              <div className="form-group">
                <label>
                  ¿Qué formación adicional has realizado o consideras necesaria
                  para tu desarrollo profesional?
                </label>
                <div className="checkbox-group">
                  {[
                    "Cursos técnicos especializados",
                    "Certificaciones profesionales",
                    "Especialización",
                    "Maestría",
                    "Doctorado",
                    "Idiomas",
                    "Habilidades blandas/liderazgo",
                  ].map((option) => (
                    <div key={option} className="checkbox-option">
                      <input
                        type="checkbox"
                        id={`formacion-${option}`}
                        name="formacionAdicional"
                        value={option}
                        checked={formData.formacionAdicional.includes(option)}
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor={`formacion-${option}`}>{option}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="sugerenciasPrograma">
                  ¿Qué sugerencias tienes para mejorar el programa de Ingeniería
                  de Sistemas?
                </label>
                <textarea
                  id="sugerenciasPrograma"
                  name="sugerenciasPrograma"
                  value={formData.sugerenciasPrograma}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Comparte tus sugerencias para mejorar el contenido o la metodología del programa..."
                ></textarea>
              </div>
            </div>

            <div className="form-group checkbox-group">
              <input type="checkbox" id="terminos" required />
              <label htmlFor="terminos">
                Acepto que mis datos sean utilizados con fines estadísticos y
                académicos de acuerdo con la política de privacidad.
              </label>
            </div>

            <div className="form-buttons">
              <button
                type="submit"
                className="submit-button"
                disabled={enviando}
              >
                {enviando ? "Enviando..." : "Enviar Encuesta"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EncuestaLaboral;

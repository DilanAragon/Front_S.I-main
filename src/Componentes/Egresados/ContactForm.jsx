import React, { useState } from "react";
import "./ContactForm.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviando(true);

    // Simulación de envío del formulario
    setTimeout(() => {
      console.log("Formulario enviado:", formData);
      setEnviando(false);
      setMensajeEnviado(true);

      // Limpiar el formulario
      setFormData({
        nombre: "",
        email: "",
        asunto: "",
        mensaje: "",
      });

      // Resetear el mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setMensajeEnviado(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="contact-form-container">
      <div className="contact-form-info">
        <h3>Datos de Contacto</h3>
        <p>
          <strong>Coordinación de Egresados</strong>
          <br />
          Programa de Ingeniería de Sistemas
          <br />
          Universidad Popular del Cesar
        </p>
        <p>
          <strong>Dirección:</strong> Sede Sabanas, Valledupar, Cesar
          <br />
          <strong>Teléfono:</strong> (605) 589 8030
          <br />
          <strong>Email:</strong> egresadosingsistemas@unicesar.edu.co
        </p>
        <p className="contact-disclaimer">
          También puedes seguirnos en nuestras redes sociales para estar al
          tanto de noticias, eventos y oportunidades laborales.
        </p>
        <div className="social-links">
          <a
            href="https://www.instagram.com/ingsistemasunicesar/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/IngenieriaDeSistemasUPC/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            Facebook
          </a>
        </div>
      </div>

      <div className="contact-form-wrapper">
        <h3>Envíanos un mensaje</h3>

        {mensajeEnviado ? (
          <div className="mensaje-exito">
            <p>¡Tu mensaje ha sido enviado con éxito!</p>
            <p>Nos pondremos en contacto contigo lo antes posible.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
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

            <div className="form-group">
              <label htmlFor="asunto">Asunto</label>
              <input
                type="text"
                id="asunto"
                name="asunto"
                value={formData.asunto}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows="6"
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-button" disabled={enviando}>
              {enviando ? "Enviando..." : "Enviar Mensaje"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactForm;

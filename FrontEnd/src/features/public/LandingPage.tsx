import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

// COMPONENTE DE PÁGINA DE INICIO (LANDING PAGE)
export const LandingPage: React.FC = () => {
    const navegar = useNavigate();

    // REDIRECCIÓN ÚNICA A LOGIN
    const irALogin = () => {
        navegar('/login');
    };

    return (
        <div className="contenedor_landing">
            {/* BARRA DE NAVEGACIÓN */}
            <nav className="barra_navegacion">
                <div className="contenedor_logo">
                    <span className="material-icons">pets</span>
                    <span>patitas felices</span>
                </div>
                <div className="enlaces_nav">
                    <a href="#inicio">Inicio</a>
                    <a href="#servicios">Servicios</a>
                    <a href="#nosotros">Nosotros</a>
                    <a href="#contacto">Contacto</a>
                    <button className="boton_login_nav" onClick={irALogin}>
                        INGRESAR
                    </button>
                </div>
            </nav>

            {/* SECCIÓN HERO (PRINCIPAL) */}
            <header id="inicio" className="seccion_hero">
                <div className="contenido_hero">
                    <h1 className="titulo_hero">
                        patitas felices <br />
                        <span>veterinaria</span>
                    </h1>
                    <p className="descripcion_hero">
                        Cuidamos a tus mejores amigos con el amor y la dedicación que se merecen.
                        Servicios profesionales para mascotas felices.
                    </p>
                    <button className="boton_principal" onClick={irALogin}>
                        RESERVA AHORA
                    </button>
                </div>
                <div className="area_imagen_hero">
                    <div className="imagen_bola">
                        <span className="material-icons" style={{ fontSize: '10rem', color: 'var(--primario)', opacity: 0.3 }}>pets</span>
                    </div>
                </div>
            </header>

            {/* SECCIÓN DE SERVICIOS */}
            <section id="servicios" className="seccion_servicios">
                <div className="encabezado_seccion">
                    <h2>Nuestros Servicios</h2>
                    <div className="linea_decorativa"></div>
                </div>

                <div className="cuadricula_servicios">
                    <div className="columna_servicios">
                        {/* TARJETA: CONSULTAS */}
                        <div className="tarjeta_servicio">
                            <div className="titulo_tarjeta">
                                <span className="material-icons">medical_services</span>
                                <h3>Consultas</h3>
                            </div>
                            <p className="texto_tarjeta">Agenda tus consultas generales y de especialidad online fácilmente.</p>
                            <button className="boton_tarjeta" onClick={irALogin}>Haz click para agendar</button>
                        </div>

                        {/* TARJETA: SERVICIOS / ESTÉTICA */}
                        <div className="tarjeta_servicio">
                            <div className="titulo_tarjeta" style={{ color: 'var(--secundario)' }}>
                                <span className="material-icons">content_cut</span>
                                <h3>Servicios</h3>
                            </div>
                            <p className="texto_tarjeta">Baño, peluquería y spa. Agenda tus servicios de cuidado estético.</p>
                            <button className="boton_tarjeta" onClick={irALogin}>Haz click para agendar</button>
                        </div>
                    </div>

                    <div className="centro_decorativo">
                        <div className="circulo_centro">
                            <span className="material-icons" style={{ fontSize: '6rem', color: 'var(--primario)', opacity: 0.1 }}>pets</span>
                        </div>
                    </div>

                    <div className="columna_servicios">
                        {/* TARJETA: VACUNAS */}
                        <div className="tarjeta_servicio">
                            <div className="titulo_tarjeta" style={{ color: 'var(--secundario)' }}>
                                <span className="material-icons">vaccines</span>
                                <h3>Vacunas</h3>
                            </div>
                            <p className="texto_tarjeta">Consulta y gestiona el calendario de vacunación de tu mascota.</p>
                            <button className="boton_tarjeta" onClick={irALogin}>Haz click para ver</button>
                        </div>

                        {/* TARJETA: HISTORIAL */}
                        <div className="tarjeta_servicio">
                            <div className="titulo_tarjeta" style={{ color: '#48BB78' }}>
                                <span className="material-icons">history_edu</span>
                                <h3>Historial</h3>
                            </div>
                            <p className="texto_tarjeta">Accede al historial médico completo y recetas de tus mascotas.</p>
                            <button className="boton_tarjeta" onClick={irALogin}>Haz click para ver</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN NOSOTROS / VALORES */}
            <section id="nosotros" className="seccion_valores">
                <h2 style={{ fontSize: '2.5rem', marginBottom: '4rem' }}>Confianza y Excelencia</h2>
                <div className="cuadricula_valores">
                    <div className="item_valor">
                        <div className="icono_central_valores" style={{ marginBottom: '1.5rem', width: '70px', height: '70px' }}>
                            <span className="material-icons">military_tech</span>
                        </div>
                        <h3>Experiencia</h3>
                        <p>Años de experiencia gestionando el mejor servicio para el bienestar de tus mascotas.</p>
                    </div>

                    <div className="icono_central_valores">
                        <span className="material-icons" style={{ fontSize: '5rem' }}>pets</span>
                    </div>

                    <div className="item_valor">
                        <div className="icono_central_valores" style={{ marginBottom: '1.5rem', width: '70px', height: '70px' }}>
                            <span className="material-icons">favorite</span>
                        </div>
                        <h3>Valores</h3>
                        <p>Sabemos la importancia de nuestras mascotas y son parte fundamental de nuestra familia.</p>
                    </div>
                </div>
            </section>

            {/* PIE DE PÁGINA / CONTACTO */}
            <footer id="contacto" className="pie_pagina">
                <div className="cuadricula_footer">
                    <div className="info_contacto">
                        <h2>
                            <span className="material-icons" style={{ fontSize: '2.5rem' }}>pets</span>
                            Contacto
                        </h2>
                        <div className="lista_contacto">
                            <div className="item_contacto">
                                <span className="material-icons" style={{ color: 'var(--secundario)' }}>email</span>
                                <div>
                                    <span className="etiqueta_contacto">Mail</span>
                                    <p className="valor_contacto">contacto@patitasfelices.com</p>
                                </div>
                            </div>
                            <div className="item_contacto">
                                <span className="material-icons" style={{ color: 'var(--secundario)' }}>phone</span>
                                <div>
                                    <span className="etiqueta_contacto">Número</span>
                                    <p className="valor_contacto">+54 11 1234 5678</p>
                                </div>
                            </div>
                            <div className="item_contacto">
                                <span className="material-icons" style={{ color: 'var(--secundario)' }}>schedule</span>
                                <div>
                                    <span className="etiqueta_contacto">Horarios</span>
                                    <p className="valor_contacto">Lun - Sab: 08:00 AM - 5:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="area_mapa">
                        <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
                            <iframe
                                title="Mapa Buenos Aires"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105073.44367090601!2d-58.5213669642939!3d-34.61582377319985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca3b4ef90cbd%3A0xa0b3812e88e88e0!2sBuenos%20Aires%2C%20CABA!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar"
                                width="100%"
                                height="100%"
                                style={{ border: 0, borderRadius: 'var(--radio-xl)' }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>

                <div className="barra_inferior">
                    <p>© 2026 Jenifer Cruz - Patitas Felices Veterinaria. Todos los derechos reservados.</p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Av. Rivadavia 1234, CABA, Buenos Aires, Argentina</p>
                    <div className="redes_sociales">
                        <a href="#">Facebook</a>
                        <a href="#">Instagram</a>
                        <a href="#">Twitter</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

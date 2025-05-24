"use client";

import React, { useState } from 'react';
import Link from 'next/link'; // Importar Link para la navegación

const landing = () => {
    const [isDashboardButtonHovered, setIsDashboardButtonHovered] = useState(false);
    const [isStoreButtonHovered, setIsStoreButtonHovered] = useState(false);
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.mainTitle}>Bienvenido a RiegOS</h1>
                <p style={styles.headerSubtitle}>Soluciones Inteligentes para la Gestión y Monitoreo</p>
            </header>

            <section id="que-somos" style={{ ...styles.section, ...styles.quienesSomosSection }}>
                <h2 style={{ ...styles.sectionTitle, ...styles.quienesSomosText }}>¿Quiénes somos?</h2>
                <p style={{ ...styles.sectionText, ...styles.quienesSomosText }}>
                    En RiegOS, somos pioneros en la integración de hardware y software para ofrecerte un control total y eficiente.
                    Desarrollamos tecnología que te permite medir, analizar y actuar sobre datos cruciales de tu entorno,
                    facilitando la toma de decisiones inteligentes.
                </p>
            </section>

            <section id="que-hacemos" style={{ ...styles.section, ...styles.queHacemosSection }}>
                <h2 style={{ ...styles.sectionTitle, ...styles.queHacemosText }}>¿Qué hacemos?</h2>
                <p style={{ ...styles.sectionText, ...styles.queHacemosText }}>
                    Nos dedicamos a diseñar y comercializar sensores de alta precisión capaces de medir una amplia gama de variables.
                    Estos datos se integran de manera fluida con nuestra aplicación web, una plataforma intuitiva y potente
                    que te ofrecemos de manera gratuita para que puedas visualizar, gestionar y entender toda la información recolectada.
                </p>
            </section>

            <section id="que-vendemos" style={styles.section}>
                <h2 style={styles.sectionTitle}>¿Qué vendemos?</h2>
                <p style={styles.sectionText}>
                    Nuestro principal producto son los **sensores RiegOS**, diseñados para ofrecerte mediciones exactas y confiables.
                    Al adquirir nuestros sensores, obtienes acceso gratuito y completo a nuestra aplicación web RiegOS, donde podrás:
                </p>
                <ul style={styles.list}>
                    <li style={styles.listItem}>Visualizar datos en tiempo real y consultar históricos.</li>
                    <li style={styles.listItem}>Configurar alertas personalizadas.</li>
                    <li style={styles.listItem}>Analizar tendencias y patrones para optimizar recursos.</li>
                    <li style={styles.listItem}>Gestionar múltiples sensores y ubicaciones desde un solo lugar.</li>
                </ul>
                <p style={styles.sectionText}>
                    Con RiegOS, inviertes en hardware de calidad y recibes el software como un valor añadido fundamental.
                </p>
                {/* Botón para ir a la tienda */}
                <div style={styles.sectionButtonContainer}>
                    <Link
                        href="/store"
                        style={{
                            ...styles.ctaButton, // Reutilizamos el estilo del botón CTA
                            ...(isStoreButtonHovered ? styles.ctaButtonHover : {})
                        }}
                        onMouseEnter={() => setIsStoreButtonHovered(true)}
                        onMouseLeave={() => setIsStoreButtonHovered(false)}
                    >
                        Ir a la Tienda
                    </Link>
                </div>
            </section>

            {/* Sección para el botón de Call to Action */}
            <div style={styles.ctaContainer}>
                <Link
                    href="/dashboard"
                    style={{
                        ...styles.ctaButton,
                        ...(isDashboardButtonHovered ? styles.ctaButtonHover : {})
                    }}
                    onMouseEnter={() => setIsDashboardButtonHovered(true)}
                    onMouseLeave={() => setIsDashboardButtonHovered(false)}
                >
                    Ir al Dashboard
                </Link>
            </div>
        </div>
    );
};

const palette = {
    primary: '#4cd964',       // Verde principal del dashboard/header
    primaryDark: '#3cc456',   // Verde más oscuro para hover, como en SensorStatus
    secondary: '#e67e22',     // Naranja para acentos y llamadas a la acción (no usado actualmente)
    background: '#ecf0f1',   // Gris muy claro para el fondo general
    textPrimary: '#2c3e50',   // Gris oscuro para texto principal
    textSecondary: '#7f8c8d', // Gris medio para texto secundario
    lightBorder: '#bdc3c7',   // Gris claro para bordes sutiles
    headerBackground: '#4cd964', // Verde principal para el fondo del header
    white: '#ffffff',
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        lineHeight: 1.6,
        color: palette.textPrimary,
        margin: 0,
        padding: 0,
        backgroundColor: palette.background, // Fondo general de la página
    },
    header: {
        backgroundColor: palette.headerBackground,
        color: palette.white, // Texto blanco para contraste con fondo oscuro
        padding: '2rem 1rem',
        textAlign: 'center',
        marginBottom: '20px', // Espacio después del header
    },
    mainTitle: { // Estilo para el título principal
        fontSize: '2.5em', // Tamaño de fuente más grande para el título principal
        fontWeight: 'bold',
    },
    headerSubtitle: { // Estilo para el subtítulo del header
        fontSize: '1.5em', // Aumentado el tamaño del subtítulo
        color: palette.white, // Cambiado a blanco
        marginTop: '0.5rem',
    },
    quienesSomosSection: {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/quienesSomos.png')`, // Oscurece la imagen y la establece como fondo
        backgroundSize: 'cover', // Asegura que la imagen cubra toda la sección
        backgroundPosition: 'center', // Centra la imagen
        color: palette.white, // Color de texto por defecto para esta sección
    },
    quienesSomosText: { // Estilo específico para el texto dentro de la sección "Quiénes Somos"
        color: palette.white, // Texto blanco
        textShadow: '0px 1px 3px rgba(0, 0, 0, 0.7)', // Sombra de texto para mejorar legibilidad
    },
    queHacemosSection: {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/queHacemos.png')`, // Oscurece la imagen y la establece como fondo
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: palette.white,
    },
    queHacemosText: { // Estilo específico para el texto dentro de la sección "Qué Hacemos"
        color: palette.white,
        textShadow: '0px 1px 3px rgba(0, 0, 0, 0.7)',
    },
    section: {
        padding: '30px 20px', // Más padding vertical
        margin: '20px auto',  // Centrar secciones si tienen un maxWidth
        maxWidth: '960px',    // Limitar el ancho para mejor legibilidad en pantallas grandes
        backgroundColor: palette.white, // Fondo blanco para las secciones para que destaquen (excepto las que tienen imagen)
        borderRadius: '8px', // Bordes redondeados para suavizar
        boxShadow: `0 2px 4px rgba(0,0,0,0.1)`, // Sombra sutil
        borderBottom: `1px solid ${palette.lightBorder}`, // Borde inferior más sutil
    },
    sectionTitle: {
        color: palette.primary, // Usar color primario para títulos de sección (será sobrescrito por quienesSomosText y queHacemosText)
        fontSize: '1.8em', // Aumentado el tamaño del título
        fontWeight: 'bold', // Añadido para mayor énfasis
        textAlign: 'center', // Centrar el título
        marginBottom: '20px', // Ajustado el margen inferior
    },
    sectionButtonContainer: { // Contenedor para centrar el botón dentro de una sección
        textAlign: 'center',
        marginTop: '25px', // Espacio arriba del botón dentro de la sección
        marginBottom: '10px', // Espacio debajo del botón dentro de la sección
    },
    sectionText: {
        color: palette.textSecondary, // Usar color de texto secundario (será sobrescrito por quienesSomosText y queHacemosText)
        fontSize: '1.1em', // Ligeramente más grande para mejor lectura
    },
    list: {
        listStyleType: 'disc',
        marginLeft: '20px',
        paddingLeft: '20px',
    },
    listItem: {
        marginBottom: '10px', // Más espacio entre ítems
        color: palette.textSecondary,
    },
    ctaContainer: { // Estilos para el contenedor del botón
        textAlign: 'center',
        padding: '30px 20px',
        marginTop: '20px', // Espacio arriba del botón
    },
    ctaButton: { // Estilos para el botón de Call to Action
        display: 'inline-block',
        backgroundColor: palette.primary, // Color principal del botón
        color: palette.white,
        padding: '12px 28px', // Padding similar a tus otros botones
        borderRadius: '12px', // rounded-xl
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '1.2em', // Tamaño de fuente del botón
        boxShadow: '0 4px 14px 0 rgba(76, 217, 100, 0.39)', // Sombra similar a tus botones
        transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
    },
    ctaButtonHover: { // Estilos para el hover del botón
        backgroundColor: palette.primaryDark, // Color más oscuro al pasar el mouse
        transform: 'translateY(-2px)', // Ligero efecto de elevación
        boxShadow: '0 6px 20px 0 rgba(76, 217, 100, 0.45)', // Sombra más pronunciada en hover
    },
};

export default landing;

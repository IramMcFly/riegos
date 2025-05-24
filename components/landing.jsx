"use client";

import React, { useState } from 'react';
import Link from 'next/link'; // Importar Link para la navegación

const landing = () => {
    const [isDashboardButtonHovered, setIsDashboardButtonHovered] = useState(false);
    const [isStoreButtonHovered, setIsStoreButtonHovered] = useState(false);
    const [hoveredSection, setHoveredSection] = useState(null);

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.mainTitle}>Bienvenido a RiegOS</h1>
                <p style={styles.headerSubtitle}>Soluciones Inteligentes para la Gestión y Monitoreo de Riego</p>
            </header>

            <section
                id="que-somos"
                style={{
                    ...styles.section,
                    ...styles.quienesSomosSection,
                    ...(hoveredSection === 'que-somos' ? styles.sectionHover : {})
                }}
                onMouseEnter={() => setHoveredSection('que-somos')}
                onMouseLeave={() => setHoveredSection(null)}
            >
                <h2 style={{ ...styles.sectionTitle, ...styles.quienesSomosText }}>¿Quiénes somos?</h2>
                <p style={{ ...styles.sectionText, ...styles.quienesSomosText }}>
                    En RiegOS, somos pioneros en la integración de hardware y software para ofrecerte un control total y eficiente.
                    Desarrollamos tecnología que te permite medir, analizar y actuar sobre datos cruciales de tu entorno,
                    facilitando la toma de decisiones inteligentes.
                </p>
            </section>

            <section
                id="que-hacemos"
                style={{
                    ...styles.section,
                    ...styles.queHacemosSection,
                    ...(hoveredSection === 'que-hacemos' ? styles.sectionHover : {})
                }}
                onMouseEnter={() => setHoveredSection('que-hacemos')}
                onMouseLeave={() => setHoveredSection(null)}
            >
                <h2 style={{ ...styles.sectionTitle, ...styles.queHacemosText }}>¿Qué hacemos?</h2>
                <p style={{ ...styles.sectionText, ...styles.queHacemosText }}>
                    Nos dedicamos a diseñar y comercializar sensores de alta precisión capaces de medir una amplia gama de variables.
                    Estos datos se integran de manera fluida con nuestra aplicación web, una plataforma intuitiva y potente
                    que te ofrecemos de manera gratuita para que puedas visualizar, gestionar y entender toda la información recolectada.
                </p>
            </section>

            <section
                id="que-vendemos"
                style={{
                    ...styles.section,
                    ...styles.queVendemosSection,
                    ...(hoveredSection === 'que-vendemos' ? styles.sectionHover : {})
                }}
                onMouseEnter={() => setHoveredSection('que-vendemos')}
                onMouseLeave={() => setHoveredSection(null)}
            >
                <h2 style={{ ...styles.sectionTitle, ...styles.queVendemosText }}>¿Qué vendemos?</h2>
                <p style={{ ...styles.sectionText, ...styles.queVendemosText }}>
                    Nuestro principal producto son los sensores RiegOS, diseñados para ofrecerte mediciones exactas y confiables.
                    Al adquirir nuestros sensores, obtienes acceso gratuito y completo a nuestra aplicación web RiegOS, donde podrás:
                </p>
                <ul style={{ ...styles.list, ...styles.queVendemosList }}> {/* Aplicar estilo para la lista */}
                    <li style={{ ...styles.listItem, ...styles.queVendemosText }}>Visualizar datos en tiempo real y consultar históricos.</li>
                    <li style={{ ...styles.listItem, ...styles.queVendemosText }}>Vista alertas personalizadas.</li>
                    <li style={{ ...styles.listItem, ...styles.queVendemosText }}>Analizar tendencias y patrones para optimizar recursos.</li>
                    <li style={{ ...styles.listItem, ...styles.queVendemosText }}>Gestionar múltiples sensores y ubicaciones desde un solo lugar.</li>
                </ul>
                <p style={{ ...styles.sectionText, ...styles.queVendemosText }}>
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

            {/* Sección para el botón de Call to Action general */}
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
                    Probar ahora
                </Link>
            </div>
        </div>
    );
};

const palette = {
    primary: '#4cd964',       // Verde principal del dashboard/header
    primaryDark: '#3cc456',   // Verde más oscuro para hover
    background: '#ecf0f1',   // Gris muy claro para el fondo general
    textPrimary: '#2c3e50',   // Gris oscuro para texto principal (usado en secciones sin imagen de fondo)
    textSecondary: '#7f8c8d', // Gris medio para texto secundario (usado en secciones sin imagen de fondo)
    lightBorder: '#bdc3c7',   // Gris claro para bordes sutiles
    headerBackground: '#4cd964', // Verde principal para el fondo del header
    white: '#ffffff',
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        lineHeight: 1.6,
        color: palette.textPrimary, // Color de texto por defecto para el contenedor
        margin: 0,
        padding: 0,
        backgroundColor: palette.background,
    },
    header: {
        backgroundColor: palette.headerBackground,
        color: palette.white,
        padding: '2rem 1rem',
        textAlign: 'center',
        marginBottom: '20px',
    },
    mainTitle: {
        fontSize: '2.5em',
        fontWeight: 'bold',
        color: palette.white, // Aseguramos que el título principal sea blanco
    },
    headerSubtitle: {
        fontSize: '1.5em',
        color: palette.white,
        marginTop: '0.5rem',
    },
    // Estilos para secciones con imagen de fondo
    quienesSomosSection: {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/quienesSomos.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: palette.white, // El texto dentro de esta sección será blanco por defecto
    },
    quienesSomosText: {
        color: palette.white,
        textShadow: '0px 1px 3px rgba(0, 0, 0, 0.7)',
    },
    queHacemosSection: {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/queHacemos.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: palette.white,
    },
    queHacemosText: {
        color: palette.white,
        textShadow: '0px 1px 3px rgba(0, 0, 0, 0.7)',
    },
    queVendemosSection: {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/queVendemos.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: palette.white,
    },
    queVendemosText: {
        color: palette.white,
        textShadow: '0px 1px 3px rgba(0, 0, 0, 0.7)',
    },
    queVendemosList: {
        // Aquí puedes añadir estilos específicos para la lista si es necesario,
        // por ejemplo, para cambiar el color de los bullets si no se ven bien.
        // Por ahora, los bullets deberían tomar el color del texto (blanco).
    },
    // Estilo base para todas las secciones
    section: {
        padding: '40px 20px', // Aumentado el padding vertical para más espacio con imágenes
        margin: '20px auto',
        maxWidth: '960px',
        // backgroundColor: palette.white, // Removido, ya que las secciones con imagen tienen su propio fondo
        borderRadius: '8px',
        boxShadow: `0 4px 12px rgba(0,0,0,0.15)`, // Sombra base más pronunciada
        // borderBottom: `1px solid ${palette.lightBorder}`, // Removido, puede no verse bien con imágenes de fondo
        position: 'relative', // Útil si necesitas posicionar elementos absolutamente dentro
        overflow: 'hidden', // Para asegurar que los bordes redondeados corten la imagen de fondo
        transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Transición suave para el hover
    },
    sectionHover: {
        transform: 'translateY(-5px)', // Eleva la tarjeta ligeramente
        boxShadow: `0 8px 20px rgba(0,0,0,0.2)`, // Sombra más intensa en hover
    },
    sectionTitle: {
        // color: palette.primary, // El color será sobrescrito por los estilos de texto específicos de cada sección
        fontSize: '1.8em',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '20px',
    },
    sectionText: {
        // color: palette.textSecondary, // El color será sobrescrito
        fontSize: '1.1em',
        lineHeight: 1.7, // Mejorado el interlineado para texto sobre imágenes
    },
    list: {
        listStyleType: 'disc',
        marginLeft: '20px', // Margen estándar para listas
        paddingLeft: '20px', // Padding para los bullets
    },
    listItem: {
        marginBottom: '10px',
        // color: palette.textSecondary, // El color será sobrescrito
    },
    sectionButtonContainer: {
        textAlign: 'center',
        marginTop: '25px',
        marginBottom: '10px',
    },
    // Estilo para el botón de Call to Action general (fuera de las secciones)
    ctaContainer: {
        textAlign: 'center',
        padding: '30px 20px',
        marginTop: '20px',
    },
    // Estilo base para los botones de acción
    ctaButton: {
        display: 'inline-block',
        backgroundColor: palette.primary,
        color: palette.white,
        padding: '12px 28px',
        borderRadius: '12px',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '1.2em',
        boxShadow: '0 4px 14px 0 rgba(76, 217, 100, 0.39)',
        transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
    },
    ctaButtonHover: {
        backgroundColor: palette.primaryDark,
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px 0 rgba(76, 217, 100, 0.45)',
    },
};

export default landing;

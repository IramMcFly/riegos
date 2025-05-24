"use client";

import React from "react";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

const productsData = [
  {
    id: 1,
    image: "/imgSensorBase.jpg",
    title: "Sistema de Riego Básico",
    description: "Este sistema es ideal si tienes un jardín pequeño o un huerto. Viene con un sensor de humedad que ajusta el riego según las necesidades de tus plantas. Perfecto para mantener tus espacios verdes sin complicaciones.",
    price: "$20.00",
    rating: 4.5,
  },
  {
    id: 2,
    image: "https://concepto.de/wp-content/uploads/2019/11/producto-e1572738593909.jpg",
    title: "Sistema de Riego Inteligente para Jardines Grandes",
    description: "Tienes un jardín grande o un césped extenso. Este sistema tiene sensores inteligentes que ajustan el riego según el clima y el tipo de suelo. También puedes controlar todo desde tu teléfono para ahorrar agua y mantener tu jardín en su mejor estado.",
    price: "$100.00",
    rating: 4.2,
  },

  {
    id: 3,
    image: "https://concepto.de/wp-content/uploads/2019/11/producto-e1572738593909.jpg",
    title: "Sistema de Riego Avanzado con Instalación",
    description: "Este paquete incluye todo lo que necesitas para automatizar el riego de tu jardín. Con instalación incluida, nuestros expertos lo configuran todo por ti. Además, tendrás una app para gestionar el conteo de sensores y optimizar el riego según las necesidades de tu espacio.",
    price: "$50.00",
    rating: 3.8,
  },
  {
    id: 4,
    image: "https://concepto.de/wp-content/uploads/2019/11/producto-e1572738593909.jpg",
    title: "Sistema de Riego para Hectáreas y Grandes Superficies",
    description: "Si ya tienes un sistema de riego en tu campo o hectárea, pero necesitas algo más eficiente, este es tu paquete. Está diseñado para integrar sensores avanzados y automatizar el riego a gran escala, asegurando que todas las zonas reciban el agua que necesitan de forma óptima.",
    price: "$200.00",
    rating: 4.6,
  },
];

const Products = () => {
  const router = useRouter();

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">

      {/* Cuadro verde en la parte superior */}
      <div className="bg-[#34D399] p-4 text-center text-white flex justify-center items-center mb-6">
        <Image src="/logo.png" alt="RiegOS logo" width={36} height={36} />
        <span className="ml-2 text-lg font-semibold">RiegOS - Soluciones de Riego</span>
      </div>

      {/* Contenedor de título y pequeña descripción */}
      <div className="text-center mb-8 max-w-4xl mx-auto">
        <h3 className="text-[#2D6A4F] font-bold text-5xl sm:text-6xl mb-4 tracking-wide">Nuestros productos</h3>
        <p className="text-gray-700 text-lg sm:text-xl">Soluciones de riego adaptadas a tus necesidades, ya sea para tu hogar o tu campo.</p>
      </div>

      {/* Contenedor de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mx-auto">
        {productsData.map((product) => (
          <div
            key={product.id}
            className="flex flex-col items-center px-6 py-8 border-2 border-[#60A5FA] rounded-xl shadow-md bg-white hover:bg-[#F1FAF4] transition-all max-w-xl" // Ancho aumentado
          >
            {/* Contenedor de la imagen con mayor tamaño */}
            <div className="relative w-full h-[350px] mb-4 overflow-hidden rounded-lg"> {/* Altura reducida */}
              <img
                src={product.image}
                alt={product.title}
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-90" // Imagen con efecto de alejarse en hover
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#34D399]/80 to-transparent p-4 rounded-b-lg">
                <h4 className="text-white font-semibold text-2xl">{product.title}</h4> {/* Fuente más grande */}
              </div>
            </div>

            <div className="text-sm text-gray-700 font-light mb-3">{product.description}</div>

            <div className="text-lg font-semibold text-[#34D399] mb-3">{product.price}</div>
            <div className="flex items-center gap-1 mb-4">
              <FaStar className="text-yellow-400" size={16} />
              <span className="text-sm text-gray-700">{product.rating}</span>
            </div>
            <button
              onClick={() => router.push(`/product/${product.id}`)}
              className="mt-4 px-6 py-3 bg-[#2D6A4F] text-white rounded-full shadow hover:bg-[#10B981] transition-all duration-200" >
              Ver detalles
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;

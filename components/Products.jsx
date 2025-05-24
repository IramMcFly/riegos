"use client";

import React from "react";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";

const productsData = [
  {
    id: 1,
    image: "https://concepto.de/wp-content/uploads/2019/11/producto-e1572738593909.jpg", // Cambia esta URL cuando necesites
    title: "Producto 1",
    description: "Descripción corta del producto 1.",
    price: "$20.00",
    rating: 4.5,
  },
  {
    id: 2,
    image: "https://concepto.de/wp-content/uploads/2019/11/producto-e1572738593909.jpg", // Cambia esta URL cuando necesites
    title: "Producto 2",
    description: "Descripción corta del producto 2.",
    price: "$25.00",
    rating: 3.8,
  },
  {
    id: 3,
    image: "https://concepto.de/wp-content/uploads/2019/11/producto-e1572738593909.jpg", // Cambia esta URL cuando necesites
    title: "Producto 3",
    description: "Descripción corta del producto 3.",
    price: "$30.00",
    rating: 4.2,
  },
  {
    id: 4,
    image: "https://concepto.de/wp-content/uploads/2019/11/producto-e1572738593909.jpg", // Cambia esta URL cuando necesites
    title: "Producto 4",
    description: "Descripción corta del producto 4.",
    price: "$15.00",
    rating: 4.7,
  },
  {
    id: 5,
    image: "https://concepto.de/wp-content/uploads/2019/11/producto-e1572738593909.jpg", // Cambia esta URL cuando necesites
    title: "Producto 5",
    description: "Descripción corta del producto 5.",
    price: "$10.00",
    rating: 3.5,
  },
];

const Products = () => {
  const router = useRouter();

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen pb-28">
      <div className="text-center mb-6">
        <h3 className="text-[#4cd964] font-semibold text-3xl sm:text-4xl mb-2">Nuestros productos</h3>
        <p className="text-gray-700 text-lg sm:text-xl">Nuestras propuestas para mejorar tu experiencia.</p>
      </div>

      <div className="border-2 border-[#5ac8fa] p-6 rounded-3xl shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsData.map((product) => (
            <div
              key={product.id}
              className="flex flex-col items-center px-4 py-6 border-2 border-[#5ac8fa] rounded-xl shadow-md bg-white"
            >
              {/* Contenedor de imagen con fondo completo */}
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                <img
                  src={product.image}
                  alt={product.title}
                  className="object-cover w-full h-full"
                />
                {/* Fondo gradiente sutil sobre el texto */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#4cd964]/70 to-transparent p-4 rounded-b-lg">
                  <h4 className="text-white font-semibold text-xl">{product.title}</h4>
                  <p className="text-white text-sm">{product.description}</p>
                </div>
              </div>

              {/* Información del producto */}
              <div className="text-lg font-semibold text-[#4cd964] mb-3">{product.price}</div>
              <div className="flex items-center gap-1 mb-4">
                <FaStar className="text-yellow-400" size={16} />
                <span className="text-sm text-gray-700">{product.rating}</span>
              </div>
              <button
                onClick={() => router.push(`/product/${product.id}`)}
                className="mt-4 px-4 py-2 bg-[#4cd964] text-white rounded-full shadow hover:bg-[#3cc456]"
              >
                Ver detalles
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;

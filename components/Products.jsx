"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const productsData = [
  {
    id: 1,
    image: "5pack.png",
    title: "Paquete de 5 sensores + Controlador Central",
    description:
      "Este paquete incluye 5 sensores y un controlador central. Ideal para quienes buscan una solución completa para el riego de su campo. Con tecnología avanzada, podrás gestionar el riego de manera eficiente y ahorrar agua.",
    price: "$5,999.00",
  },
  {
    id: 2,
    image: "5packNoMaster.png",
    title: "Paquete de 5 sensores (Sin Controlador)",
    description:
      "Este paquete es ideal para quienes ya tienen un controlador central y solo necesitan sensores adicionales. Perfecto para ampliar tu sistema de riego existente y optimizar el uso del agua en tu campo.",
    price: "$3,999.00",
  },
  {
    id: 3,
    image: "10pack.png",
    title: "Paquete de 10 sensores + Controlador Central",
    description:
      "Este paquete es perfecto para quienes buscan una solución integral para el riego de grandes superficies. Incluye 10 sensores y un controlador central, lo que te permitirá gestionar el riego de manera eficiente y ahorrar agua.",
    price: "$9,999.00",
  },
  {
    id: 4,
    image: "10packNoMaster.png",
    title: "Paquete de 10 sensores (Sin Controlador)",
    description:
      "Este paquete es ideal para quienes ya tienen un controlador central y solo necesitan sensores adicionales. Perfecto para ampliar tu sistema de riego existente y optimizar el uso del agua en tu campo.",
    price: "$7,999.00",
  },
];

const Products = () => {
  const router = useRouter();

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-[#E0F7EC] min-h-screen font-sans">
      
      {/* Botón de volver */}
      <div className="mb-4">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-[#10B981] text-white rounded-lg shadow hover:bg-[#059669] transition-colors"
        >
          ← Volver
        </button>
      </div>

      {/* Header */}
      <div className="bg-[#34D399] p-4 text-center text-white flex justify-center items-center mb-6 rounded-lg shadow-md">
        <Image src="/logo.png" alt="RiegOS logo" width={36} height={36} />
        <span className="ml-2 text-lg font-semibold">RiegOS - Soluciones de Riego</span>
      </div>

      {/* Título */}
      <div className="text-center mb-8 max-w-4xl mx-auto">
        <h3 className="text-[#2D6A4F] font-bold text-5xl sm:text-6xl mb-4 tracking-wide">
          Nuestros productos
        </h3>
        <p className="text-gray-700 text-lg sm:text-xl">
          Soluciones de riego adaptadas a tus necesidades, ya sea para tu hogar o tu campo.
        </p>
      </div>

      {/* Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mx-auto">
        {productsData.map((product) => (
          <div
            key={product.id}
            className="flex flex-col items-center px-6 py-8 rounded-2xl shadow-sm bg-white hover:shadow-lg hover:scale-[1.01] transition-all duration-300 ease-in-out max-w-xl"
          >
            {/* Imagen */}
            <div className="relative w-full h-[350px] mb-4 overflow-hidden rounded-xl">
              <img
                src={product.image}
                alt={product.title}
                className="object-contain w-full h-full"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#34D399]/90 to-transparent p-4 rounded-b-xl">
                <h4 className="text-white font-semibold text-2xl">{product.title}</h4>
              </div>
            </div>

            {/* Descripción */}
            <div className="text-sm text-gray-700 font-light mb-3 text-center">
              {product.description}
            </div>

            {/* Precio */}
            <div className="text-lg font-semibold text-[#2D6A4F] mb-4">{product.price}</div>

            {/* Botón */}
            <button
              onClick={() => router.push(`/product/${product.id}`)}
              className="mt-2 px-6 py-3 bg-[#2D6A4F] text-white rounded-full shadow hover:bg-[#10B981] transition-all duration-200"
            >
              Ver detalles
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;

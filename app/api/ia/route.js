//app/api/ia/route.js

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    // Validar que se reciban mensajes en el cuerpo
    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json({ error: "Formato incorrecto: falta 'messages'" }, { status: 400 });
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: body.model || "llama3-8b-8192",
        messages: body.messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    const data = await res.json();

    // Extraer respuesta del asistente
    const mensaje = data.choices?.[0]?.message?.content?.trim() || "No se pudo obtener respuesta.";

    return NextResponse.json({ mensaje });
  } catch (error) {
    console.error("❌ Error al conectar con Groq:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

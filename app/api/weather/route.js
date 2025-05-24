export async function GET() {
  const apiKey = process.env.API_CLIMA_KEY; // Asegúrate de que esta variable de entorno esté configurada
  const city = "Chihuahua";

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    // Verifica si hubo error en la respuesta
    if (!res.ok) {
      const errorText = await res.text();
      return new Response(
        JSON.stringify({
          error: "Error al obtener datos del clima.",
          status: res.status,
          message: errorText || res.statusText,
        }),
        {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Error de red o fetch fallido
    return new Response(
      JSON.stringify({
        error: "Error de red al conectar con OpenWeatherMap.",
        message: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

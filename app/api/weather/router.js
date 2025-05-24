// app/api/weather/route.js
export async function GET() {
  const apiKey = "2f8a596c6fdbc0414c909b0235dd38a2";
  const city = "Chihuahua";
  const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
  const data = await res.json();

  return Response.json(data);
}

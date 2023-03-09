export const GET = async _ => {
  // const geo = await fetch(process.env.GEO_ENDPOINT)
  //   .then(response => response.json())
  //   .catch(err => ({ error: JSON.stringify(err) }))
  const geo = { country: { name: 'Canada' } }
  return new Response(JSON.stringify(geo))
}

// get-location.js  (Node 18+)
(async () => {
    const token = process.env.SQUARE_ACCESS_TOKEN;
    if (!token) {
      console.error("Missing SQUARE_ACCESS_TOKEN");
      process.exit(1);
    }
  
    const res = await fetch("https://connect.squareupsandbox.com/v2/locations", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Square-Version": "2024-06-26",
        "Content-Type": "application/json",
      },
    });
  
    const data = await res.json();
    if (!res.ok) {
      console.error("Square API error:", data);
      process.exit(1);
    }
  
    if (!data.locations?.length) {
      console.log("No locations found.");
      return;
    }
  
    console.log("Locations:");
    for (const l of data.locations) {
      console.log(`${l.name} → ${l.id}`);
    }
  })();
  
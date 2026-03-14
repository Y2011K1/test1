import fs from "fs";

// Load directly from .env to ensure we get exactly the user's secret key
const envContent = fs.readFileSync(".env", "utf8");
const secretKeyLine = envContent.split('\n').find(line => line.startsWith("CLERK_SECRET_KEY="));
const secretKey = secretKeyLine ? secretKeyLine.split("=")[1].trim() : null;

async function checkPlans() {
  try {
    const res = await fetch("https://api.clerk.com/v1/billing/plans", {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });
    
    if (!res.ok) {
      console.log('Error:', res.status, await res.text());
      return;
    }
    
    const data = await res.json();
    fs.writeFileSync("plans.json", JSON.stringify(data, null, 2));
    console.log("Wrote plans.json");
  } catch (err) {
    console.error(err);
  }
}

checkPlans();

const SWAGGER_URL =
  process.env.SWAGGER_URL || "http://localhost:5001/api-docs.json";

async function sync() {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const outputPath = path.join(process.cwd(), "openapi/swagger.json");

  console.log(`Fetching Swagger from ${SWAGGER_URL}...`);

  let res;
  try {
    res = await fetch(SWAGGER_URL);
  } catch (err) {
    throw new Error(
      `Could not connect to Swagger endpoint at ${SWAGGER_URL}. Make sure the backend is running and SWAGGER_URL points to the backend swagger.json URL.`,
      { cause: err },
    );
  }

  if (!res.ok) {
    throw new Error(
      `Failed to fetch Swagger from ${SWAGGER_URL}: ${res.status} ${res.statusText}`,
    );
  }

  const json = await res.json();

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(json, null, 2));

  console.log(`Swagger saved to ${path.relative(process.cwd(), outputPath)}`);
}

sync().catch((err) => {
  console.error(err);
  process.exit(1);
});

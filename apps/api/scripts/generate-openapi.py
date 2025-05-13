import json
from pathlib import Path

from api.main import app


def generate_openapi_spec():
    openapi_schema = app.openapi()
    output_dir = Path("generated")
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / "openapi.json"

    with open(output_path, "w") as f:
        json.dump(openapi_schema, f, indent=2)
    print(f"OpenAPI spec generated at: {output_path.resolve()}")


if __name__ == "__main__":
    generate_openapi_spec()

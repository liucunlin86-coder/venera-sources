
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX_FILE = ROOT / "index.json"


def fail(message):
    print(f"ERROR: {message}")
    return 1


def read_js_field(source, field):
    pattern = rf"""^\s*{re.escape(field)}\s*=\s*(["'])(.*?)\1\s*;"""
    match = re.search(pattern, source, re.MULTILINE)
    return match.group(2) if match else None


def validate_source_interface(source, prefix, errors):
    required_patterns = {
        "search object": r"\bsearch\s*=\s*\{",
        "search.load": r"\bload\s*:\s*(?:async\s*)?\(",
        "comic object": r"\bcomic\s*=\s*\{",
        "comic.loadInfo": r"\bloadInfo\s*:\s*(?:async\s*)?\(",
        "comic.loadEp": r"\bloadEp\s*:\s*(?:async\s*)?\("
    }

    for name, pattern in required_patterns.items():
        if not re.search(pattern, source):
            errors.append(
                f"{prefix}: missing required interface: {name}"
            )


def main():
    if not INDEX_FILE.is_file():
        sys.exit(fail("index.json not found"))

    try:
        with INDEX_FILE.open(encoding="utf-8") as file:
            entries = json.load(file)
    except Exception as error:
        sys.exit(fail(f"Cannot read index.json: {error}"))

    if not isinstance(entries, list):
        sys.exit(fail("index.json must contain an array"))

    errors = []
    keys = set()

    for number, entry in enumerate(entries, start=1):
        prefix = f"Entry {number}"

        if not isinstance(entry, dict):
            errors.append(f"{prefix}: must be an object")
            continue

        for field in ("key", "version", "name"):
            value = entry.get(field)
            if not isinstance(value, str) or not value.strip():
                errors.append(f"{prefix}: missing or invalid {field}")

        key = entry.get("key")
        if isinstance(key, str) and key:
            if not re.fullmatch(r"[A-Za-z0-9_]+", key):
                errors.append(f"{prefix}: invalid source key: {key}")
            if key in keys:
                errors.append(f"{prefix}: duplicate source key: {key}")
            keys.add(key)

        url = entry.get("url")
        filename = entry.get("fileName")

        has_url = isinstance(url, str) and bool(url.strip())
        has_file = isinstance(filename, str) and bool(filename.strip())

        if has_url == has_file:
            errors.append(
                f"{prefix}: needs exactly one non-empty url or fileName"
            )
            continue

        if has_url:
            if not url.startswith(("https://", "http://")):
                errors.append(f"{prefix}: url must use HTTP or HTTPS")
            continue

        relative_path = Path(filename)

        if relative_path.is_absolute() or ".." in relative_path.parts:
            errors.append(f"{prefix}: unsafe fileName path")
            continue

        source_file = ROOT / relative_path

        if not source_file.is_file():
            errors.append(f"{prefix}: source file not found: {filename}")
            continue

        if source_file.suffix.lower() != ".js":
            errors.append(f"{prefix}: source file must be JavaScript")
            continue

        try:
            source = source_file.read_text(encoding="utf-8")
        except Exception as error:
            errors.append(f"{prefix}: cannot read source file: {error}")
            continue

        if not re.search(
            r"\bclass\s+[A-Za-z_$][\w$]*\s+extends\s+ComicSource\b",
            source
        ):
            errors.append(
                f"{prefix}: no class extending ComicSource found"
            )

        for field in ("name", "key", "version"):
            expected = entry.get(field)
            actual = read_js_field(source, field)

            if actual is None:
                errors.append(
                    f"{prefix}: source is missing {field} property"
                )
            elif actual != expected:
                errors.append(
                    f"{prefix}: {field} mismatch "
                    f"(index={expected!r}, source={actual!r})"
                )

        validate_source_interface(source, prefix, errors)

    if errors:
        print("Source validation failed:")
        for error in errors:
            print(f"- {error}")
        sys.exit(1)

    print(f"OK: validated {len(entries)} source entries")


if __name__ == "__main__":
    main()

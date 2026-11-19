import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent.parent
VALIDATOR = REPO_ROOT / "scripts" / "validate_sources.py"

VALID_SOURCE = '''
class DemoSource extends ComicSource {
  name = "Demo Comic";
  key = "demo_source";
  version = "1.0.0";
}
'''


class ValidateSourcesTests(unittest.TestCase):

    def run_validator(
        self,
        entries=None,
        source_files=None,
        index_content=None,
        create_index=True
    ):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)

            scripts_dir = root / "scripts"
            sources_dir = root / "sources"
            scripts_dir.mkdir()
            sources_dir.mkdir()

            shutil.copy2(
                VALIDATOR,
                scripts_dir / "validate_sources.py"
            )

            if create_index:
                content = (
                    index_content
                    if index_content is not None
                    else json.dumps(entries)
                )
                (root / "index.json").write_text(
                    content,
                    encoding="utf-8"
                )

            for filename, content in (source_files or {}).items():
                target = root / filename
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(content, encoding="utf-8")

            result = subprocess.run(
                [
                    sys.executable,
                    str(scripts_dir / "validate_sources.py")
                ],
                capture_output=True,
                text=True
            )

            return result.returncode, result.stdout + result.stderr

    def valid_entry(self):
        return {
            "key": "demo_source",
            "name": "Demo Comic",
            "version": "1.0.0",
            "fileName": "sources/demo.js"
        }

    def test_valid_source_passes(self):
        code, output = self.run_validator(
            [self.valid_entry()],
            {"sources/demo.js": VALID_SOURCE}
        )

        self.assertEqual(code, 0, output)
        self.assertIn("OK: validated 1 source entries", output)

    def test_missing_source_file_fails(self):
        code, output = self.run_validator(
            [self.valid_entry()]
        )

        self.assertNotEqual(code, 0)
        self.assertIn("source file not found", output)

    def test_key_mismatch_fails(self):
        entry = self.valid_entry()
        entry["key"] = "another_key"

        code, output = self.run_validator(
            [entry],
            {"sources/demo.js": VALID_SOURCE}
        )

        self.assertNotEqual(code, 0)
        self.assertIn("key mismatch", output)

    def test_version_mismatch_fails(self):
        entry = self.valid_entry()
        entry["version"] = "2.0.0"

        code, output = self.run_validator(
            [entry],
            {"sources/demo.js": VALID_SOURCE}
        )

        self.assertNotEqual(code, 0)
        self.assertIn("version mismatch", output)

    def test_name_mismatch_fails(self):
        entry = self.valid_entry()
        entry["name"] = "Wrong Name"

        code, output = self.run_validator(
            [entry],
            {"sources/demo.js": VALID_SOURCE}
        )

        self.assertNotEqual(code, 0)
        self.assertIn("name mismatch", output)

    def test_duplicate_key_fails(self):
        first = self.valid_entry()
        second = self.valid_entry()
        second["fileName"] = "sources/another.js"

        code, output = self.run_validator(
            [first, second],
            {
                "sources/demo.js": VALID_SOURCE,
                "sources/another.js": VALID_SOURCE
            }
        )

        self.assertNotEqual(code, 0)
        self.assertIn("duplicate source key", output)

    def test_unsafe_path_fails(self):
        entry = self.valid_entry()
        entry["fileName"] = "../outside.js"

        code, output = self.run_validator([entry])

        self.assertNotEqual(code, 0)
        self.assertIn("unsafe fileName path", output)

    def test_missing_index_file_fails(self):
        code, output = self.run_validator(create_index=False)

        self.assertNotEqual(code, 0)
        self.assertIn("index.json not found", output)

    def test_invalid_json_fails(self):
        code, output = self.run_validator(
            index_content="{ invalid json"
        )

        self.assertNotEqual(code, 0)
        self.assertIn("Cannot read index.json", output)

    def test_non_array_index_fails(self):
        code, output = self.run_validator(
            index_content='{"key": "demo_source"}'
        )

        self.assertNotEqual(code, 0)
        self.assertIn("index.json must contain an array", output)


if __name__ == "__main__":
    unittest.main()
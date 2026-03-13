#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


def replace_or_fail(path: Path, pattern: str, repl: str, count: int = 1) -> None:
    text = path.read_text(encoding="utf-8")
    updated, matches = re.subn(pattern, repl, text, count=count, flags=re.MULTILINE)
    if matches == 0:
        raise SystemExit(f"Pattern not found in {path}")
    path.write_text(updated, encoding="utf-8")


def update_package_json(path: Path, version: str) -> None:
    data = json.loads(path.read_text(encoding="utf-8"))
    if "version" not in data:
        raise SystemExit(f"Missing version field in {path}")
    data["version"] = version
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def update_package_lock(path: Path, version: str) -> None:
    data = json.loads(path.read_text(encoding="utf-8"))
    if "version" not in data:
        raise SystemExit(f"Missing top-level version field in {path}")
    packages = data.get("packages")
    if not isinstance(packages, dict) or "" not in packages:
        raise SystemExit(f"Missing root package entry in {path}")
    if "version" not in packages[""]:
        raise SystemExit(f"Missing root package version in {path}")
    data["version"] = version
    packages[""]["version"] = version
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Update version fields across AquaBle files.")
    parser.add_argument("version", help="New semver version, e.g. 1.2.3")
    args = parser.parse_args()

    if not re.fullmatch(r"\d+\.\d+\.\d+", args.version):
        raise SystemExit("Version must be in semver format (e.g., 1.2.3)")

    repo_root = Path(__file__).resolve().parents[1]
    replace_or_fail(repo_root / "pyproject.toml", r'^version = ".*"$', f'version = "{args.version}"')
    replace_or_fail(
        repo_root / "aquable" / "config.yaml",
        r'^version: ".*"$',
        f'version: "{args.version}"',
    )
    replace_or_fail(
        repo_root / "aquable" / "build.yaml",
        r'^  AQUA_BLE_VERSION: ".*"$',
        f'  AQUA_BLE_VERSION: "{args.version}"',
    )
    replace_or_fail(
        repo_root / "src" / "aquable" / "service.py",
        r'("version":\s*")[^"]+(")',
        rf"\g<1>{args.version}\g<2>",
    )
    update_package_json(repo_root / "frontend" / "package.json", args.version)
    update_package_lock(repo_root / "frontend" / "package-lock.json", args.version)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

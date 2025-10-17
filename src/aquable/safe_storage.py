"""Safe file storage utilities for handling permission errors gracefully."""

import json
import logging
from pathlib import Path
from typing import Any, Callable

logger = logging.getLogger(__name__)


def safe_mkdir(path: Path | str, purpose: str = "storage") -> bool:
    """Create a directory, logging warnings on permission errors instead of crashing.

    Args:
        path: Directory path to create
        purpose: Description of what this directory is for (for logging)

    Returns:
        True if created successfully, False if permission denied
    """
    path = Path(path)
    try:
        path.mkdir(parents=True, exist_ok=True)
        return True
    except PermissionError:
        logger.warning(
            f"Could not create {purpose} directory {path}: "
            "Permission denied. Storage may not persist."
        )
        return False


def safe_write_json(
    file_path: Path,
    data: Any,
    tmp_suffix: str = ".tmp",
    purpose: str = "file",
) -> bool:
    """Atomically write JSON to a file, handling permission errors gracefully.

    Args:
        file_path: Path where to write the JSON file
        data: Data to serialize and write
        tmp_suffix: Suffix for temporary file during atomic write
        purpose: Description of what this file is for (for logging)

    Returns:
        True if written successfully, False if permission denied
    """
    try:
        tmp_file = file_path.with_suffix(tmp_suffix)
        tmp_file.write_text(
            json.dumps(data, indent=2, sort_keys=True),
            encoding="utf-8",
        )
        tmp_file.replace(file_path)
        return True
    except PermissionError:
        logger.warning(
            f"Could not write {purpose} {file_path}: "
            "Permission denied. Data will not persist to storage."
        )
        return False


def safe_write_json_with_callback(
    file_path: Path,
    data_fn: Callable[[], Any],
    tmp_suffix: str = ".tmp",
    purpose: str = "file",
) -> bool:
    """Write JSON with a callback to generate data, for lazy evaluation.

    Useful when you need to generate data from model.model_dump() conditionally.

    Args:
        file_path: Path where to write the JSON file
        data_fn: Callable that returns data to serialize
        tmp_suffix: Suffix for temporary file during atomic write
        purpose: Description of what this file is for (for logging)

    Returns:
        True if written successfully, False if permission denied
    """
    try:
        data = data_fn()
        tmp_file = file_path.with_suffix(tmp_suffix)
        tmp_file.write_text(
            json.dumps(data, indent=2, sort_keys=True),
            encoding="utf-8",
        )
        tmp_file.replace(file_path)
        return True
    except PermissionError:
        logger.warning(
            f"Could not write {purpose} {file_path}: "
            "Permission denied. Data will not persist to storage."
        )
        return False

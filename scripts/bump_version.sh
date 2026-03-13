#!/usr/bin/env bash
# Bump version across all project files

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <new_version>"
    echo "Example: $0 2.1.0"
    exit 1
fi

NEW_VERSION="$1"

# Validate version format (basic semver check)
if ! [[ "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Version must be in semver format (e.g., 2.1.0)"
    exit 1
fi

echo "Bumping version to $NEW_VERSION"
echo ""

# Get current version from pyproject.toml
CURRENT_VERSION=$(grep '^version = ' pyproject.toml | sed 's/version = "\(.*\)"/\1/')
echo "Current version: $CURRENT_VERSION"
echo "New version: $NEW_VERSION"
echo ""

# Confirm with user
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

# Update versioned files
echo "📝 Updating versioned files..."
python scripts/update_version.py "$NEW_VERSION"

# Update CHANGELOG
echo "📝 Adding entry to aquable/CHANGELOG.md..."
if [ ! -s aquable/CHANGELOG.md ]; then
    # File is empty, create header
    cat > aquable/CHANGELOG.md << EOF
# Changelog

All notable changes to AquaBle will be documented in this file.

## [$NEW_VERSION] - $(date +%Y-%m-%d)

### Added
- TODO: Add new features here

### Changed
- TODO: Add changes here

### Fixed
- TODO: Add fixes here

EOF
else
    # File exists, prepend new version entry after header
    TEMP_FILE=$(mktemp)
    {
        # Keep first 4 lines (header)
        head -n 4 aquable/CHANGELOG.md
        # Add new version entry
        cat << EOF

## [$NEW_VERSION] - $(date +%Y-%m-%d)

### Added
- TODO: Add new features here

### Changed
- TODO: Add changes here

### Fixed
- TODO: Add fixes here

EOF
        # Add rest of file
        tail -n +5 aquable/CHANGELOG.md
    } > "$TEMP_FILE"
    mv "$TEMP_FILE" aquable/CHANGELOG.md
fi

echo ""
echo "✅ Version bumped to $NEW_VERSION"
echo ""
echo "📋 Files updated:"
echo "   • pyproject.toml"
echo "   • aquable/config.yaml"
echo "   • frontend/package.json"
echo "   • aquable/build.yaml"
echo "   • frontend/package-lock.json"
echo "   • src/aquable/service.py"
echo "   • aquable/CHANGELOG.md"
echo ""
echo "⚠️  Next steps:"
echo "   1. Edit aquable/CHANGELOG.md to document changes"
echo "   2. Review the changes: git diff"
echo "   3. Commit: git add -A && git commit -m 'Bump version to $NEW_VERSION'"
echo "   4. Tag: git tag v$NEW_VERSION"
echo "   5. Push: git push && git push --tags"

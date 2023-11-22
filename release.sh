#!/bin/bash
set -e

VERSION=$(npx release-it --release-version --npm.skipChecks)

npm version "$VERSION" --no-git-tag-version
npm run build
npm publish --access public

git add package.json package-lock.json
git commit -m "chore: release v$VERSION"
git tag "$VERSION"
git push origin HEAD
git push --tags

#!/bin/sh
# Публикация сайта на GitHub Pages: собирает проект и кладёт dist в ветку gh-pages.
# Сайт: https://bykatyusha.github.io/gq-site/
set -e
repo="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo"
npm run build

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
cp -R dist/. "$tmp"
touch "$tmp/.nojekyll"            # без Jekyll: файлы раздаются как есть

cd "$tmp"
git init -q -b gh-pages
git config user.name "$(git -C "$repo" config user.name)"
git config user.email "$(git -C "$repo" config user.email)"
git add -A
git commit -q -m "Сборка от $(git -C "$repo" rev-parse --short HEAD)"
git push -q -f "$(git -C "$repo" remote get-url origin)" gh-pages
echo "Опубликовано: https://bykatyusha.github.io/gq-site/ (обновится через минуту)"

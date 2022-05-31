
git add --all
git commit -m "update"

call npm version patch

git push

call npm publish --access public

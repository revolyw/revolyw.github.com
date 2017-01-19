#! /bin/zsh
hexo clean
hexo generate
hexo deploy

git add .
git commit -m "modify some properties or blogs"
git push


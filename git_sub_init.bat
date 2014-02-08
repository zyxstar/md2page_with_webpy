git remote add -f lib https://github.com/zyxstar/md2page_sub_lib.git
git subtree add --prefix=lib lib master --squash
git remote add -f static https://github.com/zyxstar/md2page_sub_static.git
git subtree add --prefix=static static master --squash

pause
cd ~/webhook/gdtm
git pull
mkdir -p /etc/nginx/websites/gdtm
\cp * /etc/nginx/websites/gdtm
systemctl restart nginx

#!/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

DATE=$(date +%Y_%m_%d)
mv /var/log/nginx/yukotabi-nginx-access.log /var/log/nginx/yukotabi-nginx-access.log.$DATE
mv /var/log/nginx/yukotabi-nginx-error.log /var/log/nginx/yukotabi-nginx-error.log.$DATE
kill -USR1 `cat /var/run/nginx.pid`
sleep 1
# gzip /var/log/nginx/yukotabi-nginx-access.log.$DATE
# gzip /var/log/nginx/yukotabi-nginx-error.log.$DATE

#!/bin/bash
touch /etc/crontab /etc/cron.*/*
service cron start
nginx -g 'daemon off;'

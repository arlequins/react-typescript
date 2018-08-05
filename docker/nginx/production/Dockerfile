FROM nginx:stable

ENV TZ 'Asia/Tokyo'

RUN set -x \
	&& apt-get update \
	&& apt-get install --no-install-recommends --no-install-suggests -y curl vim cron tzdata

RUN apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
	&& ln -sf /dev/stderr /var/log/nginx/error.log

COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY html /var/www/html

RUN chown -R nginx:nginx /var/www/html

COPY conf/sites-enabled /etc/nginx/sites-enabled

# logs
COPY cron/rotatenginxlogs.sh /usr/local/sbin/rotatenginxlogs.sh
RUN chmod 770 /usr/local/sbin/rotatenginxlogs.sh

RUN service cron start
ADD cron/nginxlogs-cron-task /etc/cron.d/nginxlogs-cron-task
RUN chmod 0600 /etc/cron.d/nginxlogs-cron-task

RUN echo $TZ > /etc/timezone && \
	rm /etc/localtime && \
	ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
	dpkg-reconfigure -f noninteractive tzdata

EXPOSE 80

STOPSIGNAL SIGTERM

ADD run.sh /usr/local/bin/run.sh
RUN chmod 755 /usr/local/bin/run.sh

ENTRYPOINT ["/usr/local/bin/run.sh"]

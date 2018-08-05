FROM keymetrics/pm2:8-stretch

ENV TZ 'Asia/Tokyo'
ENV NPM_CONFIG_LOGLEVEL warn
ENV TARGET_BUILD localhost
ENV APP_PATH /usr/src/app
ENV APP_NAME app

WORKDIR $APP_PATH
COPY $APP_NAME $APP_PATH

RUN mkdir /var/log/$APP_NAME
RUN yarn install --production

RUN echo $TZ > /etc/timezone && \
	rm /etc/localtime && \
	ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
	dpkg-reconfigure -f noninteractive tzdata

EXPOSE 3000

CMD pm2 start --no-daemon $$APP_PATH/pm2/process.json --env $TARGET_BUILD

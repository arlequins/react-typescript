# react-typescript

## NODE CMD
### DEV
```
npm run start
```

### BUILD
```
npm run build
```

### DEPLOY
```
DEPLOY_PATH=*DEPLOY_PATH* \
AWS_BUCKET=*AWS_BUCKET* \
BASE_PATH=*BASE_PATH* \
AWS_ACCESS_KEY_ID=*AWS_ACCESS_KEY_ID* \
AWS_SECRET_ACCESS_KEY=*AWS_SECRET_ACCESS_KEY* \
npm run deploy
```

## GRADLEW CMD
### BUILD
```
sh gradlew reactBuild
```

### DEPLOY
```
sh gradlew reactDeploy \
-Parg1=*"AWS_ACCESS_KEY_ID"* \
-Parg2=*"AWS_SECRET_ACCESS_KEY"* \
-Parg3=*"DEPLOY_PATH"* \
-Parg4=*"AWS_BUCKET"* \
-Parg5=*"BASE_PATH"*
```

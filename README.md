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
DEPLOY_PATH=DEPLOY_PATH \
AWS_BUCKET=AWS_BUCKET \
BASE_PATH=BASE_PATH \
AWS_ACCESS_KEY_ID=AWS_ACCESS_KEY_ID \
AWS_SECRET_ACCESS_KEY=AWS_SECRET_ACCESS_KEY \
npm run deploy
```

## GRADLEW CMD
### BUILD
```
sh gradlew reactBuild
```

### DEPLOY TO S3
```
sh gradlew reactDeployS3 \
-Pdeploy:s3=true \
-PaccessKeyId="AWS_ACCESS_KEY_ID" \
-PsecrectAccessKey="AWS_SECRET_ACCESS_KEY" \
-PdeployPath="DEPLOY_PATH" \
-PawsBucket="AWS_BUCKET" \
-PbasePath="BASE_PATH"
```

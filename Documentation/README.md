# WeAre Components Documentation
## Run container locally
### DEVELOPMENT
#### Login into Amazon ECR registry
```
aws ecr get-login-password --region eu-west-1 --profile dev-athenaeum | docker login --password-stdin --username AWS 856366986372.dkr.ecr.eu-west-1.amazonaws.com
```

#### Start container
```
docker run -d -p 8080:8080 --name weare-components-documentation 856366986372.dkr.ecr.eu-west-1.amazonaws.com/weare-components-documentation:latest
```
Navigate to -> http://localhost:8080

#### Stop container
```
docker stop weare-components-documentation
```
#### Remove container
```
docker rm weare-components-documentation
```
#### Remove image
```
docker rmi -f 856366986372.dkr.ecr.eu-west-1.amazonaws.com/weare-components-documentation:latest
```
### PRODUCTION
TODO

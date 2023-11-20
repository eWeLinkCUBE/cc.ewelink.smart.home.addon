version=$(cat ./version)

# 1. enter docker image name
read -p "enter your image name: " image_name
echo $(date +%Y-%m-%d" "%H:%M:%S) '[enter image name - '$image_name'] - done'

# 2. build docker image
echo `pwd`
docker build -t $image_name --platform=linux/arm/v7 .
docker build -t $image_name:v$version --platform=linux/arm/v7 .

echo $(date +%Y-%m-%d" "%H:%M:%S) '[build image] - done'

# 3. login docker
read -p "enter your docker username: " username
read -s -p "enter your docker password: " password

docker login -u=$username -p=$password
echo $(date +%Y-%m-%d" "%H:%M:%S) '[login docker hub account] - done'

# 4 push docker image
docker push $image_name
docker push $image_name:v$version

echo $(date +%Y-%m-%d" "%H:%M:%S) '[push image] - done'

# 5. logout docker
docker logout

echo $(date +%Y-%m-%d" "%H:%M:%S) '[docker logout] - done'
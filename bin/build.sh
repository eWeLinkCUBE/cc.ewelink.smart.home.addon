# !/bin/bash

npm install -g @vercel/ncc

version=$(cat ./version)
output_dir=node-app
deploy_dir=deploy

# 1. Clean previous output
rm -rf $output_dir
rm -rf $deploy_dir
rm -r *.tar.gz

# 2. Build web pages
cd web
rm -f .env
echo $version
echo VITE_VERSION=$version > .env
npm install --save-exact
npm run build
echo $(date +%Y-%m-%d" "%H:%M:%S) '[build web pages] - done'
cd ..

# 3. Build server app
cd server
npm install
npm run build
echo $(date +%Y-%m-%d" "%H:%M:%S) '[build server app] - done'
cd ..

# 4. Merge web pages code to server app
mkdir $output_dir
# Copy server code
cp server/package.json $output_dir
cp -r server/dist $output_dir/src
# Copy web code
cp -r web/dist $output_dir/src/public
# Install dependencies
cd $output_dir
npm install --production --save-exact
echo $(date +%Y-%m-%d" "%H:%M:%S) '[merge] - done'

# 5. Encrypto code
cd ..
ncc build $output_dir/src/index.js -m -o $deploy_dir
cp -r $output_dir/src/public $deploy_dir
cp -r Dockerfile .dockerignore $deploy_dir
echo $(date +%Y-%m-%d" "%H:%M:%S) '[encrypto code] - done'

# 6. Copy push.sh to deploy
cp bin/push.sh version $deploy_dir
echo $(date +%Y-%m-%d" "%H:%M:%S) '[copy push.sh] - done'

# 7. Compress deploy directory
tar cf $deploy_dir.tar $deploy_dir
gzip $deploy_dir.tar
echo $(date +%Y-%m-%d" "%H:%M:%S) '[compress] - done'
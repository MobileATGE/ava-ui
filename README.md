# ava-ui

> My Ava UI Nuxt.js project

## Build Setup

``` bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

# sample Ava UI URL
http://localhost:8080/chat?name=Test&id=D40905817&email=test%40test.com

https://mobileatge.github.io/ava-ui/chat/?name=Test&id=D40905817&email=test%40test.com

# update change on Github
git add .
git commit -m "comment"
git push
npm run generate
npm run deploy

# Server WSS for dev, qa, and prod
wss://ava-chat-server-dev.herokuapp.com
wss://ava-chat-server-qa.herokuapp.com
wss://ava-chat-server.herokuapp.com

# Import login id to Redis Database
## Import csv to Canvas DEV Redis
```script
cat Chamberlain_id.csv | awk 'BEGIN { FS = "," } ; FNR > 1 { print "hset id:lookup \""$8"\" " $5 }' | redis-cli --pipe -h ec2-107-21-225-183.compute-1.amazonaws.com -a password -p 24389
```
## Import csv to Canvas QA Redis
```script
cat Chamberlain_id.csv | awk 'BEGIN { FS = "," } ; FNR > 1 { print "hset id:lookup \""$8"\" " $5 }' | redis-cli --pipe -h ec2-35-153-239-108.compute-1.amazonaws.com -a password -p 31499
```
## Import csv to Canvas PROD Redis
```script
cat Chamberlain_id.csv | awk 'BEGIN { FS = "," } ; FNR > 1 { print "hset id:lookup \""$8"\" " $5 }' | redis-cli --pipe -h ec2-3-222-111-21.compute-1.amazonaws.com -a password -p 15429

cat STU_list.txt | awk 'BEGIN { FS = ",\n" } { print substr($1, 1, length($1)-1) }' > student_faq.txt

cat EMP_list.txt | awk 'BEGIN { FS = ",\n" } { print substr($1, 1, length($1)-1) }' > emp_faq.txt

cat STU_list.txt | awk 'BEGIN { FS = ",\n" } { print "sadd student:faq \"" substr($1, 1, length($1)-1) "\""}' | redis-cli --pipe -h ec2-3-229-46-115.compute-1.amazonaws.com -a password -p 30239

cat EMP_list.txt | awk 'BEGIN { FS = ",\n" } { print "sadd emp:faq \"" substr($1, 1, length($1)-1) "\""}' | redis-cli --pipe -h ec2-3-229-46-115.compute-1.amazonaws.com -a password -p 30239

sscan student:faq 0 match *office* COUNT 11000
```

# Redis GUI Client
Medis https://github.com/luin/medis
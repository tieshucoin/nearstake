# First

setup env

```shell
cp example.env .env
```

and set Kyes.

# Trigger

```shell
npm install
npm start
```

# Crontab

```shell
0 0 * * * cd /root/notifi && /usr/bin/node build/index.js > /dev/null 2>&1
```

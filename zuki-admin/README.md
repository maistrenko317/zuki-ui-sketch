# ZUKI Admin Services #

This container expores web services used to manage ZUKI's games and finance structure.

## Enviroment Variables ##

The following enviroment variables must be defined the build/runtime system (jenkins, scripts):

1. ZUKI_DB_URL: JDBC (MySQL) url.
2. ZUKI_DB_USER: User name
3. ZUKI_DB_PASSWORD: Password
4. ZUKI_SERVICE_PORT: http(s) port (inbound)
5. ZUKI_SERVICE_MY_PORT: MySQL Port (the same which appears in ZUKI_JDBC_URL, outbound).

### Bootstraping the Service ###

The next code snipped is used as example to illustrate how to bootstrap the service:

```
$ docker run -e ZUKI_DB_URL \
 -e ZUKI_DB_USER \
 -e ZUKI_DB_PASSWORD \
 -e ZUKI_SERVICE_PORT \
 --network "host" \
 --expose ${ZUKI_SERVICE_PORT} \
 --expose ${ZUKI_SERVICE_MY_PORT} \
 zuki-scm.shoutgameplay.com:5000/zuki-admin:0.05
```

### Building Docker image ###

Once you've setup your env vars, just run the build script.


```
$ ./build.sh
```

### Deploying to docker registry ###
```
$ echo "FjClPWK4e6yHpaC4a2PcVk40s2sASyLwJJHkQd26" | docker login--username zuki --password-stdin
$ docker push zuki-scm.shoutgameplay.com:5000/zuki-admin:0.02
```
### Testing end points with Curl ###

SESSION_KEY
ZUKI_ADMIN_DOMAIN

```
$ curl --insecure --header "X-REST-SESSION-KEY: 001313" https://3.227.21.80:27073/referral/summary
```
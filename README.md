#Auth

An authentication service for senders.io


![0.0.0-SNAPSHOT](https://api.shippable.com/projects/55c0a2a99ad8e50b00cc63c6/badge/master)

## API

###GET /  and /ping

Ping route

###POST /api/v1/login

Login route. Accepts json.

```javascript
{
  username:'username'
  ,password: 'password'
}
```

Return a token to be used when authenticating the user.

Also sends back the username in a special header.

###POST /api/v1/verify

Verification route. Accepts json.

```javascript
{
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3RndXkiLCJpYXQiOjEsImV4cCI6IjE1IiwiaXNzIjoiaW8uc2VuZGVycy5hdXRoIn0.FEnYK839D1mM6uKByiZaZGrQIrbtj0dx_KFSpCgguo0'
}
```

Username must be passed in header, as well as optional token regen flag.

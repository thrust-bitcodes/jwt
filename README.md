JWT
===============

JWT é um *bitcode* de serialização/deserialização de JSON Web Token para [ThrustJS](https://github.com/thrustjs/thrust)

## Tutorial

```javascript
var jwt = require('thrust-bitcodes/jwt')
```

O modulo jwt conterá os seguintes métodos

```javascript
/**
  * Função que gera um **jwt** a partir de um *payload*.
  * @param {Object} payload - propriedades que serão inseridas no payload do jwt.
  * @param {Boolean} encrypt - indica se o token deve ou não ser criptografado. Por padrão não é criptografado.
  * @return {String} retorna o jwt.
  */
serialize(payload, encrypt)

/**
  * Função que extrai o *payload* de um **jwt** serializado.
  * @param {String} serializedJwt - jwt em formato string (*serializado*).
  * @param {Boolean} encrypt - indica se o token a ser lido está criptografado.
  * @return {String} retorna o payload serializado (JSON).
  */
deserialize(serializedJwt, encrypted)
```

## Parâmetros de configuração
As propriedades abaixo devem ser configuradas no arquivo *config.json* (distribuído juntamente com o ThrustJS):

``` javascript
...
"jwt": { /*Configuração do jwt*/
  "jwsKey": /*String Usado com criptografia*/,
  "jwtKey": /*String Usado sem criptografia*/,
}
```

Exemplo:

```javascript
/**
@file config.json
*/
{
    "jwt": {
      "jwsKey": "abcdefgh12345678",
      "jwtKey": "abcdefgh12345678",
    }
}
```

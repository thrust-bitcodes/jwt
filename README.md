# JWT 0.1.4

JWT é um *bitcode* de serialização/deserialização de JSON Web Token para [ThrustJS](https://github.com/thrustjs/thrust)

## Instalação

Posicionado em um app [ThrustJS](https://github.com/thrustjs/thrust), no seu terminal:

```sh
tpm install ozaijr/jwt
```

## Tutorial

```javascript
let jwt = require('jwt')

let token = jwt.serialize({
  nome: 'Bruno',
  role: 'Admin
}, true)

show(token)

```

## API

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

Este módulo é usado juntamente com o *bitcode* [thrust-bitcodes/authentication](https://github.com/thrust-bitcodes/authentication).

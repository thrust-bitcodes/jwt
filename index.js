/** @ignore */
var JsonWebEncryption = Java.type('org.jose4j.jwe.JsonWebEncryption')
/** @ignore */
var JsonWebSignature = Java.type('org.jose4j.jws.JsonWebSignature')
/** @ignore */
var AlgorithmIdentifiers = Java.type('org.jose4j.jws.AlgorithmIdentifiers')
/** @ignore */
var HmacKey = Java.type('org.jose4j.keys.HmacKey')
/** @ignore */
var AesKey = Java.type('org.jose4j.keys.AesKey')
/** @ignore */
var KeyManagementAlgorithmIdentifiers = Java.type('org.jose4j.jwe.KeyManagementAlgorithmIdentifiers')
/** @ignore */
var ContentEncryptionAlgorithmIdentifiers = Java.type('org.jose4j.jwe.ContentEncryptionAlgorithmIdentifiers')
/** @ignore */
var AlgorithmConstraints = Java.type('org.jose4j.jwa.AlgorithmConstraints')
/** @ignore */
var ConstraintType = Java.type('org.jose4j.jwa.AlgorithmConstraints.ConstraintType')

var BufferedWriter = Java.type('java.io.BufferedWriter')
var ByteArrayOutputStream = Java.type('java.io.ByteArrayOutputStream')
var OutputStreamWriter = Java.type('java.io.OutputStreamWriter')

var jwt = {
    version: '0.1.4',
    /**
    * Função que gera um **jwt** a partir de um *payload*.
    * @param {Object} payload - propriedades que serão inseridas no payload do jwt.
    * @param {Boolean} encrypt - indica se o token deve ou não ser criptografado. Por padrão não é criptografado.
    * @return {String} retorna o jwt.
    */
    serialize: function (payload, encrypt) {
        return encrypt ? serializeEncryptedToken(payload) : serializeToken(payload)
    },
    /**
    * Função que extrai o *payload* de um **jwt** serializado.
    * @param {String} serializedJwt - jwt em formato string (*serializado*).
    * @param {Boolean} encrypt - indica se o token a ser lido está criptografado.
    * @return {String} retorna o payload serializado (JSON).
    */
    deserialize: function (serializedJwt, encrypted) {
        return encrypted ? deserializeEncryptedToken(serializedJwt) : deserializeToken(serializedJwt)
    }
}

function getBytes (str, charset) {
    str = str || ''
    charset = charset || 'utf-8'
    if (!str.getBytes) {
        var bos = new ByteArrayOutputStream()
        var out = new BufferedWriter(new OutputStreamWriter(bos, charset))
        out.append(str)
        out.flush()
        var strBytes = bos.toByteArray()
        out.close()

        return strBytes
    }
    return str.getBytes(charset)
}

function serializeToken (payload) {
    var jws = new JsonWebSignature()
    jws.setPayload(JSON.stringify(payload))
    jws.setKey(getKey())
    jws.setAlgorithmHeaderValue(AlgorithmIdentifiers.HMAC_SHA256)
    jws.setHeader('typ', 'JWT')
    jws.setDoKeyValidation(false)
    return jws.getCompactSerialization()
}

function deserializeToken (token) {
    var jws = new JsonWebSignature()
    jws.setCompactSerialization(token)
    jws.setKey(getKey())
    jws.setDoKeyValidation(false)
    return jws.getPayload()
}

function serializeEncryptedToken (payload) {
    var jwe = new JsonWebEncryption()
    var key = getEncryptionKey()
    jwe.setAlgorithmHeaderValue(KeyManagementAlgorithmIdentifiers.A128KW)
    jwe.setEncryptionMethodHeaderParameter(ContentEncryptionAlgorithmIdentifiers.AES_128_CBC_HMAC_SHA_256)
    jwe.setPayload(JSON.stringify(payload))
    jwe.setKey(key)
    return jwe.getCompactSerialization()
}

function deserializeEncryptedToken (encryptJWT) {
    var jwe = new JsonWebEncryption()
    var key = getEncryptionKey()
    jwe.setAlgorithmConstraints(new AlgorithmConstraints(ConstraintType.WHITELIST, KeyManagementAlgorithmIdentifiers.A128KW))
    jwe.setContentEncryptionAlgorithmConstraints(new AlgorithmConstraints(ConstraintType.WHITELIST, ContentEncryptionAlgorithmIdentifiers.AES_128_CBC_HMAC_SHA_256))
    jwe.setKey(key)
    jwe.setCompactSerialization(encryptJWT)
    return jwe.getPayload()
}

function jwtConfig (name) {
    try {
        return env('jwt.' + name)
    } catch (e) {
        var cfg = getConfig()
        return cfg && cfg.jwt && cfg.jwt[name]
    }
}

function getKey () {
    var key = jwtConfig('jwtKey')
    return new HmacKey(getBytes(key))
}

function getEncryptionKey () {
    var key = jwtConfig('jwsKey')
    if (!key) {
        throw new Error('No jwsKey from config for JWT')
    }
    return new AesKey(getBytes(jwtConfig('jwsKey')))
}

exports = jwt

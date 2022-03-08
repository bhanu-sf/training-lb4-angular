import {Middleware, MiddlewareContext} from '@loopback/rest';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';


export const authMiddleware: Middleware = async (middlewareCtx, next) => {
  const {request, response} = middlewareCtx;
  console.log('Request: %s %s', request.method, request.originalUrl);
  try {
    console.log('printing cookies');
    let cookiesMap = getCookiesMap(request.headers.cookie);
    let token = cookiesMap.token;
    
    // var ciphertext = CryptoJS.AES.encrypt(JSON.stringify({
    //   userId: 1
    // }), 'secret key').toString();

    var bytes  = CryptoJS.AES.decrypt(token, 'secret key');
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    JSON.parse(originalText).userId;

    let jwtToken = jwt.sign(JSON.parse(originalText), 'jwt secret key');
    request.headers['token'] = jwtToken;

    console.log(console.log(request.headers));

    const result = await next();

    return result;
  } catch (err) {
    // Catch errors from downstream middleware
    console.error(
      'Error received for %s %s',
      request.method,
      request.originalUrl,
    );
    throw err;
  }
};

function getCookiesMap(cookiesStr?: string) {
  let map: any = {};
  cookiesStr
    ?.split('; ')
    .map(v => {
      const obj = v.split('=');
      return {
        key: obj[0],
        value: obj[1],
      };
    })
    .forEach(v => {
      map[v.key] = v.value;
    });
  return map;
}

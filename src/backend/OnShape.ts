import { error, copyObject } from './util';
import { credentialsFileError, credentialsFormatError, badBaseUrlError, notOKError, getError, postError, deleteError }from './config/errors';
import { createHmac } from 'crypto';
import { parse } from 'url';
import { stringify, parse as _parse } from 'querystring';
import { statSync, createReadStream } from 'fs';
import { basename } from 'path';
import { query } from 'express';
import {opts} from './types/opts';
type creds = {
    baseUrl: string;
    accessKey: string;
    secretKey: string;
}
export default class OnShape {
    creds: creds|null;
    protocol?: any = null;
    constructor() {
        try {
            this.creds = require('./config/apikey.js');
            
            if (this.creds === null) return;
            // basic error checking on key
            if (typeof this.creds.baseUrl !== 'string' ||
                typeof this.creds.accessKey !== 'string' ||
                typeof this.creds.secretKey !== 'string') {
                error(credentialsFormatError);
            }
            if (this.creds.baseUrl.indexOf('http://') === 0) {
                this.protocol = require('http');
            } else if (this.creds.baseUrl.indexOf('https://') === 0) {
                this.protocol = require('https');
            } else {
                error(badBaseUrlError);
            }
        } catch (e) {
            error(credentialsFileError);
            this.creds = null
        }
    }

    buildNonce() {
        var chars = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
            'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
            'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0',
            '1', '2', '3', '4', '5', '6', '7', '8', '9'
        ];
        var nonce = '';
        for (var i = 0; i < 25; i++) {
            nonce += chars[Math.floor(Math.random() * chars.length)];
        }
        return nonce;
    }


    /**
   * opts: {
   *   d: document ID
   *   w: workspace ID (only one of w, v, m)
   *   v: version ID (only one of w, v, m)
   *   m: microversion ID (only one of w, v, m)
   *   e: elementId
   *   baseUrl: base URL; if present, overrides apikey.js
   *   resource: top-level resource (partstudios)
   *   subresource: sub-resource, if any (massproperties)
   *   path: from /api/...; if present, overrides the other options
   *   accept: accept header (default: application/vnd.onshape.v1+json)
   *   query: query object
   *   headers: headers object
   * }
   */
    get(opts: opts, cb: Function) {
        var path = '';
        if (typeof opts.path !== 'undefined') {
            path = opts.path;
        } else {
            path = this.buildDWMVEPath(opts);
        }
        var baseUrl = ('baseUrl' in opts) ? opts.baseUrl : this.creds?.baseUrl;
        var queryString = this.buildQueryString(opts);
        var inputHeaders = this.inputHeadersFromOpts(opts);
        var headers = this.buildHeaders('GET', path, queryString, inputHeaders);
        if (queryString !== '') queryString = '?' + queryString;
        var requestOpts: any = parse(baseUrl + path + queryString);
        requestOpts.method = 'GET';
        requestOpts.headers = headers;
        console.log(requestOpts);
        
        var req = this.protocol.request(requestOpts,  (res: any) => {
            
            var wholeData = '';
            res.on('data', function (data: any) {
                wholeData += data;
            });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    cb(wholeData);
                } else if (res.statusCode === 307) {
                    var redirectParsedUrl: any = parse(res.headers.location);
                    console.log('Redirecting to ' + res.headers.location);
                    // the redirect contains a query string, which the API key mechanism needs to encrypt
                    var redirectOpts: opts = {
                        baseUrl: redirectParsedUrl.protocol + '//' + redirectParsedUrl.host,
                        path: redirectParsedUrl.pathname,
                        headers: inputHeaders,
                        query: _parse(redirectParsedUrl.query)
                    };
                    this.get(redirectOpts, cb);
                } else {
                    console.log(requestOpts.method + ' ' + baseUrl + path + queryString);
                    console.log('Status: ' + res.statusCode);
                    if (wholeData) {
                        console.log(wholeData.toString());
                    }
                    error(notOKError);
                }
            });
        }).on('error', function (e: Error) {
            console.log(requestOpts.method + ' ' + baseUrl + path + queryString);
            console.log(e);
            error(getError);
        });
        req.end();
    }
    buildHeaders(method: string, path: string, queryString: string, inputHeaders: string) {
        var headers = copyObject(inputHeaders);
        // the Date header needs to be reasonably (5 minutes) close to the server time when the request is received
        var authDate = (new Date()).toUTCString();
        // the On-Nonce header is a random (unique) string that serves to identify the request
        var onNonce = this.buildNonce();
        if (!('Content-Type' in headers)) {
            headers['Content-Type'] = 'application/json';
        }
        // the Authorization header needs to have this very particular format, which the server uses to validate the request
        // the access key is provided for the server to retrieve the API key; the signature is encrypted with the secret key
        var hmacString = (method + '\n' + onNonce + '\n' + authDate + '\n' +
            headers['Content-Type'] + '\n' + path + '\n' + queryString + '\n').toLowerCase();
        var hmac = createHmac('sha256', this.creds?.secretKey ?? "");
        hmac.update(hmacString);
        var signature = hmac.digest('base64');
        var asign = 'On ' + this.creds?.accessKey + ':HmacSHA256:' + signature;

        headers['On-Nonce'] = onNonce;
        headers['Date'] = authDate;
        headers['Authorization'] = asign;
        
        
        if (!('Accept' in headers)) {
            headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9';
        }

        return headers;
    }
    
    buildDWMVEPath(opts: opts) {
    var path = '/api/v5/' + opts.resource + '/d/' + opts.d;
    if ('w' in opts) {
        path += '/w/' + opts.w;
    } else if ('v' in opts) {
        path += '/v/' + opts.v;
    } else if ('m' in opts) {
        path += '/m/' + opts.m;
    }
    if ('e' in opts) {
        path += '/e/' + opts.e;
    }
    if ('subresource' in opts) {
        path += '/' + opts.subresource;
    }

    return path;
}

buildQueryString(opts: opts) {
    if (!('query' in opts) || typeof opts.query !== 'object' || opts.query == null) {
        return '';
    }
    return stringify(opts.query);
}

inputHeadersFromOpts(opts: opts) {
    return (!('headers' in opts) || typeof opts.headers !== 'object' || opts.headers == null) ?
        {} : copyObject(opts.headers);
}
}

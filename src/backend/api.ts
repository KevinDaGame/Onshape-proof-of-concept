// ...at top of file
var u = require('url');
import * as crypto from 'crypto';
import './OnShape';
import OnShape from './OnShape';
import { opts } from './types/opts';

const onShape = new OnShape();
export async function getDocuments(queryObject: object, cb: Function) {
  libGetDocuments(queryObject, (data: any) => {
    let result = [];
    var docs = JSON.parse(data.toString()).items;
    for (var i = 0; i < docs.length; i++) {
      var privacy = docs[i].public ? 'public' : 'private';
      var ownerName = (docs[i].owner && ('name' in docs[i].owner)) ? docs[i].owner.name : 'nobody';
      console.log(docs[i].name + '    ' + privacy + '   Owned by: ' + ownerName);
      result.push(docs[i]);
      
    }
    console.log(result);
    
    cb(result);
  });
};

async function libGetDocuments(queryObject: object, cb: Function) {
  var opts: opts = {
    path: '/api/documents',
    query: queryObject
  }
  
  onShape.get(opts, cb);
}

export function getGLTF(opts: opts, cb: Function) {
  libGetGLTF(opts, (data: any) => {
    cb(data);
  });
}

async function libGetGLTF(opts:opts, cb: Function) {
  onShape.get(opts, cb);
}
export function error(err:any) {
  console.log(err.msg);
  process.exit(err.status);
}

export function copyObject(object:any) {
	var copy: any = {};
	var keys: any = Object.keys(object);
	for (var i = 0; i < keys.length; i++) {
		if (object.hasOwnProperty(keys[i])) {
			copy[keys[i]] = copyObject(object[keys[i]]);
		}
	}
	return copy;
}
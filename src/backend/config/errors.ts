export let versionContextError = {
  'msg': 'You must specify exactly one of -w (workspaceId), -v (versionId), or -m (microversionId).',
  'status': 1
}
export let missingDocumentOrElementError = {
  'msg': 'You must specify a -d (documentId) and -e (elementId).',
  'status': 1
}
export let missingDocumentOrWorkspaceError = {
  'msg': 'You must specify a -d (documentId) and -w (workspaceId).',
  'status': 1
}
export let missingDWEError = {
  'msg': 'You must specify a -d (documentId), -w (workspaceId), and -e (elementId).',
  'status': 1
}
export let missingMimeType = {
  'msg': 'You must specify a -t (MIME type)',
  'status': 1
}
export let missingFile = {
  'msg': 'Yom must specify a -f (file)',
  'status': 1
}
export let credentialsFileError = {
  'msg': 'You must provide an API key file named config/apikey.js; please see config/apikeyexample.js for an example.',
  'status': 2
}
export let credentialsFormatError = {
  'msg': 'Fields in config/apikey.js have an incorrect format.',
  'status': 2
}
export let badBaseUrlError = {
  'msg': 'baseUrl field in config/apikey.js is invalid (must begin with http:// or https://).',
  'status': 2
}
export let getError = {
  'msg': 'GET request failed.',
  'status': 3
}
export let postError = {
  'msg': 'POST request failed.',
  'status': 3
}
export let deleteError = {
  'msg': 'DELETE request failed.',
  'status': 3
}
export let notOKError = {
  'msg': 'API call failed.',
  'status': 3
}
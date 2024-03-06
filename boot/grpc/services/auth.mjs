// import model here

// Define your service implementation
/**
 * Implements the login RPC method.
 */
function login(call, callback) {
  console.log('Request params call: ', call.request);
  callback(null, { token: 'day la du lieu tra ve tu server', message: 'ngon nha' });
}

function init(call, callback) {
  console.log('Request params call: ', call.request.ping);
  callback(null, { pong: 'server pong...' });
}

// Define your service implementation
/**
   * Implements the logout RPC method.
   */
function logout(call, callback) {
  console.log('Request params call: ', call.request);
  callback(null, { token: 'ahhahhshsh', message: 'ngon nha' });
}

export {
  login,
  logout,
  init,
};

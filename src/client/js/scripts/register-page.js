import PostUserRequest from '../requests/PostUserRequest.js';
import FakeRequestAuthorizer from '../requests/FakeRequestAuthorizer.js';
import Registration from './Registration.js';

function $(id) {
  return document.getElementById(id);
}
const authorizer = new FakeRequestAuthorizer();
const request = new PostUserRequest('localhost:3000', authorizer);
const registration = new Registration($('sign-up'));
$('sign-up').addEventListener('submit', (e) => {
  e.preventDefault();
  registration.register(request);
});

import PostUserRequest from '../requests/PostUserRequest.js';
import FakeRequestAuthorizer from '../requests/FakeRequestAuthorizer.js';
import Registration from './Registration.js';

const authorizer = new FakeRequestAuthorizer();
const request = new PostUserRequest('http://localhost:3000', authorizer);
const form = document.getElementById('regForm');
const registration = new Registration(form);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  registration.register(request);
});

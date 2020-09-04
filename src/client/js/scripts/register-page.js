import PostUserRequest from '../requests/PostUserRequest.js';
import FakeRequestAuthorizer from '../requests/FakeRequestAuthorizer.js';
import Registration from './Registration.js';
import RegisterPageErrorHandler from './RegisterPageErrorHandler.js';
import PostAuthRequest from '../requests/PostAuthRequest.js';

const authorizer = new FakeRequestAuthorizer();
const postUserRequest = new PostUserRequest('http://localhost:3000', authorizer);
const postAuthRequest = new PostAuthRequest('http://localhost:3000', authorizer);
const registerForm = document.getElementById('regForm');
const authorizeForm = document.getElementById('authForm');
const submitHandler = new Registration(authorizeForm, registerForm, document.getElementById('resultText'));
const errorHandler = new RegisterPageErrorHandler(document.getElementById('resultText'));
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  submitHandler.register(postUserRequest, errorHandler);
});
authorizeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  submitHandler.authorize(postAuthRequest, errorHandler);
});
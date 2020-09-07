import PostUserRequest from '../requests/PostUserRequest.js';
import FakeRequestAuthorizer from '../requests/FakeRequestAuthorizer.js';
import RegisterPageBackend from './RegisterPageBackend.js';
import RegisterPageResultHandler from './RegisterPageResultHandler.js';
import PostAuthRequest from '../requests/PostAuthRequest.js';

const baseURL = `${document.location.protocol}//${document.location.host}`;
const accountPageURL = `${baseURL}/personal account.html`;
const authorizer = new FakeRequestAuthorizer();
const postUserRequest = new PostUserRequest(baseURL, authorizer);
const postAuthRequest = new PostAuthRequest(baseURL, authorizer);
const registerForm = document.getElementById('regForm');
const authorizeForm = document.getElementById('authForm');
const submitHandler = new RegisterPageBackend(authorizeForm, registerForm, document.getElementById('resultText'));
const resultHandler = new RegisterPageResultHandler(document.getElementById('resultText'), accountPageURL);
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  submitHandler.register(postUserRequest, resultHandler);
});
authorizeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  submitHandler.authorize(postAuthRequest, resultHandler);
});

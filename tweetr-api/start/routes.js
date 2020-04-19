'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.get('/me', 'UserController.me');
  Route.put('/update_profile', 'UserController.updateProfile');
  Route.get('/users_to_follow', 'UserController.usersToFollow');
  Route.put('/change_password', 'UserController.changePassword');
})
  .prefix('account')
  .middleware(['auth:jwt']);

Route.post('/tweet', 'TweetController.tweet').middleware(['auth:jwt'])
Route.post('/tweets/reply/:id', 'TweetController.reply').middleware(['auth:jwt']);
Route.delete('/tweets/destroy/:id', 'TweetController.destroy').middleware(['auth:jwt'])
Route.get('/tweets/:id', 'TweetController.show')
Route.group(() => {
  Route.post('/create', 'FavoriteController.favorite')
  Route.delete('/destroy/:id', 'FavoriteController.unFavorite');
})
  .prefix('favorites')
  .middleware(['auth:jwt'])


Route.post('/signup', 'UserController.signup');
Route.post('/login', 'UserController.login');
Route.get(':username', 'UserController.showProfile');
Route.post('/follow/', 'UserController.follow').middleware(['auth:jwt'])
Route.delete('/unfollow/:id', 'UserController.unFollow').middleware(['auth:jwt'])
Route.get('users/timeline', 'UserController.timeline').middleware(['auth:jwt'])

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})


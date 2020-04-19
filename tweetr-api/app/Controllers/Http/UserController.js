'use strict'
  // add to the top of the file
const User = use('App/Models/User');
const Hash = use('Hash');
const Tweet = use('App/Models/Tweet')

class UserController {

  async signup ({ request, auth, response }) {
      // get user data from signup form
      const userData = request.only(['name', 'username', 'email', 'password'])

      try {
          // save user to database
          const user = await User.create(userData)
          // generate JWT token for user
          const token = await auth.generate(user)

          return response.json({
              status: 'success',
              data: token
          })
      } catch (error) {
          return response.status(400).json({
              status: 'error',
              message: 'There was a problem creating the user, please try again later.'
          })
      }
  }
  async login ({ request, auth, response }) {
    try {
        // validate the user credentials and generate a JWT token
        const token = await auth.attempt(
            request.input('email'),
            request.input('password')
        )

        return response.json({
            status: 'success',
            data: token
        })
    } catch (error) {
      console.log(error)
        response.status(400).json({
            status: 'error',
            message: 'Invalid email/password'
        })
    }
  }
  async me ({ auth, response }) {
    const user = await User.query()
        .where('id', auth.current.user.id)
        .with('tweets', builder => {
            builder.with('user')
            builder.with('favorites')
            builder.with('replies')
        })
        .with('following')
        .with('followers')
        .with('favorites')
        .with('favorites.tweet', builder => {
            builder.with('user')
            builder.with('favorites')
            builder.with('replies')
        })
        .firstOrFail()

    return response.json({
        status: 'success',
        data: user
    })
  }
  async updateProfile ({ request, auth, response }) {
    try {
        // get currently authenticated user
        const user = auth.current.user

        // update with new data entered
        if(request.input('name'))
          user.name = request.input('name')

        if(request.input('username'))
          user.username = request.input('username')

        if(request.input('email'))
          user.email = request.input('email')

        if(request.input('location'))
          user.location = request.input('location')

        if(request.input('bio'))
          user.bio = request.input('bio')

        if(request.input('website_url'))
          user.website_url = request.input('website_url')

        await user.save()

        return response.json({
            status: 'success',
            message: 'Profile updated!',
            data: user
        })
    } catch (error) {
        return response.status(400).json({
            status: 'error',
            message: 'There was a problem updating profile, please try again later.'
        })
    }
  }
  async changePassword ({ request, auth, response }) {
    // get currently authenticated user
    const user = auth.current.user

    // verify if current password matches
    const verifyPassword = await Hash.verify(
        request.input('password'),
        user.password
    )

    // display appropriate message
    if (!verifyPassword) {
        return response.status(400).json({
            status: 'error',
            message: 'Current password could not be verified! Please try again.'
        })
    }

    // hash and save new password
    user.password = request.input('newPassword');
    await user.save()

    return response.json({
        status: 'success',
        message: 'Password updated!'
    })
  }
  async showProfile ({ request, params, response }) {
    try {
        const user = await User.query()
            .where('username', params.username)
            .with('tweets', builder => {
                builder.with('user')
                builder.with('favorites')
                builder.with('replies')
            })
            .with('following')
            .with('followers')
            .with('favorites')
            .with('favorites.tweet', builder => {
                builder.with('user')
                builder.with('favorites')
                builder.with('replies')
            })
            .firstOrFail()

        return response.json({
            status: 'success',
            data: user
        })
    } catch (error) {
        return response.status(404).json({
            status: 'error',
            message: 'User not found'
        })
    }
  }
  async usersToFollow ({ params, auth, response }) {
    // get currently authenticated user
    const user = auth.current.user

    // get the IDs of users the currently authenticated user is already following
    const usersAlreadyFollowing = await user.following().ids();

    // fetch users the currently authenticated user is not already following
    const usersToFollow = await User.query()
        .whereNot('id', user.id)
        .whereNotIn('id', usersAlreadyFollowing)
        .pick(3);

    return response.json({
        status: 'success',
        data: usersToFollow
    });
  }
  async follow ({ request, auth, response }) {
    // get currently authenticated user
    const user = auth.current.user

    // add to user's followers
    await user.following().attach(request.input('user_id'))

    return response.json({
        status: 'success',
        data: null
    })
  }
  async unFollow ({ params, auth, response }) {
    // get currently authenticated user
    const user = auth.current.user

    // remove from user's followers
    await user.following().detach(params.id)

    return response.json({
        status: 'success',
        data: null
    })
  }
  async timeline ({ auth, response }) {
    const user = await User.find(auth.current.user.id)

    // get an array of IDs of the user's followers
    const followersIds = await user.following().ids()

    // add the user's ID also to the array
    followersIds.push(user.id)

    const tweets = await Tweet.query()
        .whereIn('user_id', followersIds)
        .with('user')
        .with('favorites')
        .with('replies')
        .fetch()

    return response.json({
        status: 'success',
        data: tweets
    })
  }

}

module.exports = UserController

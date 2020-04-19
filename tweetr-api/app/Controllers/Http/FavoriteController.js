'use strict'

const Favorite = use('App/Models/Favorite')

class FavoriteController {
  async favorite ({ request, auth, response }) {
    // get currently authenticated user
    const user = auth.current.user

    const tweetId = request.input('tweet_id')

    const favorite = await Favorite.findOrCreate(
        { user_id: user.id, tweet_id: tweetId },
        { user_id: user.id, tweet_id: tweetId }
    )

    return response.json({
        status: 'success',
        data: favorite
    })
  }
  async unFavorite ({ params, auth, response }) {
    // get currently authenticated user
    const user = auth.current.user

    // fetch favorite
    await Favorite.query()
        .where('user_id', user.id)
        .where('tweet_id', params.id)
        .delete()

    return response.json({
        status: 'success',
        data: null
    })
  }
}

module.exports = FavoriteController

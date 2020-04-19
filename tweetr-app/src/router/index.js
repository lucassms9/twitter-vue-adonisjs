import Vue from 'vue'
import Router from 'vue-router'
import SignUpForm from '@/components/Auth/SignUpForm'
import Home from '@/components/Home'
import LogInForm from '@/components/Auth/LogInForm'
import UserProfileSettings from '@/components/User/Settings/UserProfileSettings'
import UserPasswordSettings from '@/components/User/Settings/UserPasswordSettings'
import SingleTweet from '@/components/Tweet/SingleTweet'
import UserProfile from '@/components/User/Profile/UserProfile'
import UsersFollowing from '@/components/User/Profile/UsersFollowing'
import UserFollowers from '@/components/User/Profile/UserFollowers'
import FavoriteTweets from '@/components/User/Profile/FavoriteTweets'

Vue.use(Router)

export default new Router(
  {
    // mode: 'history',
    routes: [
      {
        path: '/favorites',
        component: FavoriteTweets
      },
      {
        path: '/:username/favorites',
        component: FavoriteTweets,
        props: true
      },
      {
        path: '/followers',
        component: UserFollowers
      },
      {
        path: '/:username/followers',
        component: UserFollowers,
        props: true
      },
      {
        path: '/following',
        component: UsersFollowing
      },
      {
        path: '/:username/following',
        component: UsersFollowing,
        props: true
      },
      {
        path: '/settings/password',
        component: UserPasswordSettings
      },
      {
        path: '/signup/',
        component: SignUpForm
      },
      {
        path: '/',
        component: Home
      },
      {
        path: '/login',
        component: LogInForm
      },
      {
        path: '/settings/profile',
        component: UserProfileSettings
      },
      {
        path: '/:username/status/:id',
        component: SingleTweet,
        props: true
      },
      {
        path: '/:username',
        component: UserProfile,
        props: true
      }
    ]
  })

'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Reply extends Model {

  user () {
    return this.belongsTo('App/Models/User')
  }

  tweet() {
    return this.belongsTo('App/Models/Tweet')
  }


}

module.exports = Reply

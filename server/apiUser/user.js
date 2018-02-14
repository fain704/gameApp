'use strict';

//////////////////////////////////////////////////////////////////////////
///////////////////////////// Mongodb Functions /////////////////////////
////////////////////////////////////////////////////////////////////////
const User =     require('../db/schemas/User')


module.exports = {

  get: function() {

    return new Promise((resolve, reject) => {
      User.find({}, function(err, response) {
          if (err) {
            if (err.error !== 'not_found') {
              resolve(err)
            } else {
              reject(err)
            }};
          resolve(response);
        });
       })
     },

     
    }

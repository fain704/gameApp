
'use strict';

//////////////////////////////////////////////////////////////////////////
///////////////////////////// Mongodb Functions /////////////////////////
////////////////////////////////////////////////////////////////////////
const Member =     require('../db/schemas/Characters')

module.exports = {

  get: function() {

    return new Promise((resolve, reject) => {
      Member.find({}, function(err, response) {
          if (err) {
            if (err.error !== 'not_found') {
              resolve(err)
            } else {
              reject(err)
            }};
          resolve(response);
        });
       })
      }
    }

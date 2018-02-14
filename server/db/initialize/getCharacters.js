'use strict';

///////////////////////////////////////////////////////////////////////
///////           load a test data set of agents if needed    ////////
/////////////////////////////////////////////////////////////////////

const Character  =          require('../schemas/Characters')
const mongoose =            require('mongoose')
const dbCharacters  =       require('../data/characters')

const limit = 1;

function getCharacters () {
      Character.find({}).limit(limit).exec(function (err, collection){
          if (collection.length === 0) {
            // iterate over the set of agents for initialization and create entries
            dbCharacters.map(function(dbChar) {
                let newCharacter = new Character(dbChar)
                newCharacter.save(function (err, data) {
                  if(err) {
                    console.log(err);
                    return res.status(500).json({msg: 'internal server error'});
                  }
                })
              })
            console.log('DB Characters Initialized in MongoDB')
            return
          }
          else {
            console.log('DB Characters Exist in MongoDB')
          }
        })
      }

module.exports = {
  getCharacters: getCharacters
}

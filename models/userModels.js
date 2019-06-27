const connection = require('../db/connection');

const fetchAuser = ({username}) => {



return connection('users').where('username', username)


}

  module.exports = fetchAuser
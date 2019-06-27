const connection = require('../db/connection');

const fetchAllTopics = () => {

   
 return connection.select('*').from('topics').then((data) => {return {'topics':data}});
  };

  module.exports = fetchAllTopics
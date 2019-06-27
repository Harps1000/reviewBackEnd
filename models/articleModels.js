const connection = require('../db/connection');


const fetchArticleById = ({article_id}) => {
  return connection('articles')
  .select('articles.*')
  .where('articles.article_id','=', article_id)
  .count({ comment_count: 'articles.article_id'})
  .leftJoin('comments', 'articles.article_id', 'comments.article_id')
  .groupBy('articles.article_id')
}

const patchArticleVotes = ({article_id},{inc_votes})=>{

return connection('articles')
  .where('articles.article_id','=', article_id)
  .increment('votes', inc_votes)
  .returning('*')

}

const fetchAllArticles = ()=>{
  console.log("hehuheudh")
}


  module.exports = {fetchArticleById, patchArticleVotes, fetchAllArticles}
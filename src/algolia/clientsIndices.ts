import algoliasearch from 'algoliasearch'

const algolia = algoliasearch(process.env.VUE_APP_ALGOLIA_APP_ID,
  process.env.VUE_APP_ALGOLIA_API_KEY)

const algoindex = algolia.initIndex(process.env.VUE_APP_ALGOLIA_INDEX_CLIENTS)

export default algoindex

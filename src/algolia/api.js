import * as algoliasearch from 'algoliasearch'

const algolia = algoliasearch(process.env.VUE_APP_ALGOLIA_APP_ID,
  process.env.VUE_APP_ALGOLIA_API_KEY)

const index = algolia.initIndex(process.env.VUE_APP_ALGOLIA_INDEX_NAME)

export default index

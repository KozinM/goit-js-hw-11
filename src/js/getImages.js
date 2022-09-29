import axios from 'axios'
export { getImages }

axios.defaults.baseURL = 'https://pixabay.com/api/'
const KEY = '30164013-1853a266bd8cbfed0fcba1603'
//const perPage = 40;

async function getImages(query, pageNumber, resultsPerPage) {
  const response = await axios.get(
    `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=${resultsPerPage}`,
  )
  return response
}
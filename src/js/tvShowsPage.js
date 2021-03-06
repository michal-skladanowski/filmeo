import Glide from '@glidejs/glide';
import apiCall from './apiCall';
import { carouselConfig } from '../utilis/carousel';
import { apiImagesUrl } from '../apiConfig';
import overviewTemplate from '../templates/overviewTemplate.handlebars';

const renderTvShowsPage = async (app) => {
  // Select the spp root element
  const el = document.querySelector('#app');

  // Clear previous page content (for better UX)
  el.innerHTML = '';

  // Create paths to API endpoints
  const queryPopular = 'tv/popular';
  const queryTopRated = 'tv/top_rated';
  const queryNowPlaying = 'tv/on_the_air';

  // Set the page title
  const pageTitle = 'Filmeo - TV Shows';
  if (document.title !== pageTitle) document.title = pageTitle;

  // Specify a ISO 3166-1 code to filter release dates.
  const region = 'PL';

  // Calls to The Movie Database API
  const responsePopular = await apiCall(queryPopular, region);
  const responseTopRatedRaw = await apiCall(queryTopRated, region);
  const responseNowPlaying = await apiCall(queryNowPlaying);

  // Filter result to cut off Japan tv series
  const responseTopRatedResults = responseTopRatedRaw.results.filter((result) => {
    return result.origin_country[0] !== 'JP';
  });

  // Inject templates to the DOM
  app.innerHTML = overviewTemplate({
    apiImagesUrl,
    popularCarouselContext: {
      type: 'popular',
      media: 'tv',
      results: responsePopular.results,
    },
    topRatedCarouselContext: {
      type: 'top_rated',
      media: 'tv',
      results: responseTopRatedResults,
    },
    nowPlayingCarouselContext: {
      type: 'now_playing',
      media: 'tv',
      results: responseNowPlaying.results,
    },
  });

  // Create instances of Glide carousels
  if (responsePopular.results) new Glide('#popular', carouselConfig).mount();
  if (responseTopRatedResults) new Glide('#top_rated', carouselConfig).mount();
  if (responseNowPlaying.results) new Glide('#now_playing', carouselConfig).mount();
};

export default renderTvShowsPage;

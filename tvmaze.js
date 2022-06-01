"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const TVMAZE = 'https://api.tvmaze.com';



/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchTerm) {

  const tvMazeURL = `${TVMAZE}/search/shows`;
  const showInfo = await axios.get(tvMazeURL, { params: { q: searchTerm } });
  console.log('showInfo', showInfo);

  const allShows = showInfo.data.map((listing) => {
    return {
      id: listing.show.id,
      name: listing.show.name,
      summary: listing.show.summary,
      image: listing.show.image ? listing.show.image.original : 'https://tinyurl.com/tv-missing'
    };
  });

  return allShows;
}

/** Given list of shows, create markup for each and add to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}



/** Handle search form submission: get shows from API and display.
 *  Hide episodes area (that only gets shown if they ask for episodes)
 */
async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and await returned (promise) array of episodes:
 *      { id, name, season, number }
 */
async function getEpisodesOfShow(id) {
  const episodesAPI = TVMAZE + `/shows/${id}/episodes`;
  const listOfEpisodes = await axios.get(episodesAPI);

  const episodesOfShow = listOfEpisodes.data.map(episode => {
    return {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number
    };
  });

  return episodesOfShow;
}

/** Function populateEpisodes takes an array of episodes
 * Appends a list of episodes to episode list in the DOM
 * returns undefined
 */
function populateEpisodes(episodes) {
  $('#episodesArea').show();


  /**appendEpisode takes an episode object as input
   * Creates an li element
   * fills the li element with episode info
   * appends the created li
   */
  function _appendEpisode(ep) {
    const listing = $(`<li>${ep.name} (Season ${ep.season}, number ${ep.number})</li>`);
    $('#episodesList').append(listing);
  }

  episodes.forEach(_appendEpisode);
}

/**Function defineEpisode takes an event target as input
 * defines the show id of the episode button clicked.
 * Calls the getEpisodes of Show()
 * passes the array of episodes to populateEpisodes
 *
 */
async function makeEpisodeListAndDisplay(evt) {
  console.log($(evt.target).closest('.Show'));
  $('#episodesList').empty();
  const showID = $(evt.target).closest('.Show').data('show-id');
  populateEpisodes(await getEpisodesOfShow(showID));
}

$('#showsList').on('click', 'button', makeEpisodeListAndDisplay);



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

async function getShowsByTerm(searchTerm="") {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const allShows = [];
  const tvMazeURL = 'https://api.tvmaze.com/search/shows';


  const showInfo = await axios.get(tvMazeURL,{params: {q:searchTerm}});
  console.log('showInfo',showInfo);
  const idNameSumImg = showInfo.data.map((listing) => {
    return {id:listing.show.id,
    name:listing.show.name,
    summary:listing.show.summary,
    image:listing.show.image? listing.show.image.original:'https://tinyurl.com/tv-missing'
  }});

  // {
  //   image:show.image?valid:tinyURL
  // }
    // for(let i=0;i<10;i++){
    //   try{
    //     allShows.push({
    //       id:showInfo.data[i].show.id,
    //       name:showInfo.data[i].show.name,
    //       summary:showInfo.data[i].show.summary,
    //       image:showInfo.data[i].show.image.original
    //     });
    //   } catch(err){
    //     allShows.push({
    //       id:showInfo.data[i].show.id,
    //       name:showInfo.data[i].show.name,
    //       summary:showInfo.data[i].show.summary,
    //       image: "https://tinyurl.com/tv-missing"
    //     });
    //   }
    // }

  // console.log('allShows = ',allShows);
  return idNameSumImg;

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

    $showsList.append($show);  }
}



/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
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

async function getEpisodesOfShow(id='1') {
  const episodesAPI = TVMAZE+`/shows/${id}/episodes`;
  const listOfEpisodes = await axios.get(episodesAPI);

  const episodesOfShow = listOfEpisodes.data.map(episode =>{
    return {
      id:episode.id,
      name:episode.name,
      season:episode.season,
      number:episode.number
    }});

    return episodesOfShow;
}

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }


  //Attempt to resolve invaluid search.
  // const firstShow = {
  //   id:showInfo.data[0].show.id,
  //   name:showInfo.data[0].show.name,
  //   summary:showInfo.data[0].show.summary,
  //   image:showInfo.data[0].show.image.original
  // }
  // for(let i=0;i<10;i++){
  //   allShows.push({
  //     id:showInfo.data[i].show.id,
  //     name:showInfo.data[i].show.name,
  //     summary:showInfo.data[i].show.summary,
  //     image:showInfo.data[i].show.image.original
  //   });
  // }

  // if(allShows.length === 0){
  //   alert('No Matches Found!');

    // const $show = $(
    //   // `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
    //    `<div class="media">
    //      <img
    //         src="https://tinyurl.com/tv-missing"
    //         alt="Bletchly Circle San Francisco"
    //         class="w-25 me-3">
    //      <div class="media-body">
    //        <h5 class="text-primary">Show not found</h5>
    //        <div><small>''</small></div>
    //        <button class="btn btn-outline-light btn-sm Show-getEpisodes">
    //          Episodes
    //        </button>
    //      </div>
    //    </div>
    //  </div>
    // `);



  //   allShows.push({
  //     id:'None found',
  //     name:'None Found',
  //     summary:"None Found",
  //     image: "https://tinyurl.com/tv-missing"
  //   });

  //   return;
  // } else {


  //PLACHOLDER
  // return [
  //   {
  //     id: 1767,
  //     name: "The Bletchley Circle",
  //     summary:
  //       `<p><b>The Bletchley Circle</b> follows the journey of four ordinary
  //          women with extraordinary skills that helped to end World War II.</p>
  //        <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their
  //          normal lives, modestly setting aside the part they played in
  //          producing crucial intelligence, which helped the Allies to victory
  //          and shortened the war. When Susan discovers a hidden code behind an
  //          unsolved murder she is met by skepticism from the police. She
  //          quickly realises she can only begin to crack the murders and bring
  //          the culprit to justice with her former friends.</p>`,
  //     image:
  //         "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
  //   }
  // ]
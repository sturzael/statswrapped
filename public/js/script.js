(function() {

  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  // const userProfileSource = document.getElementById('user-profile-template').innerHTML,
  //     userProfileTemplate = Handlebars.compile(userProfileSource);

  var params = getHashParams();

  let access_token = params.access_token,
    refresh_token = params.refresh_token,
    error = params.error;

  if (error) {
    alert('There was an error during the authentication');
  } else {
    if (access_token) {
      $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          $('#login').hide();
          $('.container').load('loggedin.html',function(){
            new Vue({
              el: '#loggedin',
              data: {
                display_name: response.display_name,
                id: response.id,
                profile_picture: response.images[0].url,
              }
            })
            getUserTop();
          });
        }
      });
    } else {
      // render initial screen
      $('.container').load('login.html');
      $('#loggedin').hide();
    }
  }

function getUserTop(){
  $.ajax({
    url: 'https://api.spotify.com/v1/me/top/tracks',
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    data:{"time_range":"short_term", "limit":"50"},
    success: function(response) {
      songs = response.items;
      for (var i = 0; i < songs.length; i++) {
        let name = songs[i].name;
        let artist = songs[i].album.artists[0].name;
        $('.listofsongs').append(`<li>${name} - ${artist}</li>`)
      }
      console.log(songs);
    }
  });
}


})();

// Requires
const fs = require('fs');
const ytdl = require('youtube-dl');

// Variables
var inputField = document.getElementById('url-input');
var temp = document.getElementById('temp');
var thumbnail = document.getElementById('thumbnail');

inputField.addEventListener('input', (e) => {
    var url = e.target.value;

    // Get info
    if (url.length > 5) {
        temp.innerText = "Getting video info...";
        ytdl.getInfo(url, (err, info) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(info);
                temp.innerText = info.title;
                thumbnail.src = info.thumbnail;
                thumbnail.style.display = "block";
            }
        });
    }

});

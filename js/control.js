// Requires
const {remote} = require('electron');
const fs = require('fs');
const ytdl = require('youtube-dl');
const app = remote.app;
const dialog = remote.dialog;

// Variables
var inputField = document.getElementById('url-input');
var vinfo = document.getElementById('video-info');
var thumbnail = document.getElementById('thumbnail');
var videoButton = document.getElementById('download-video');
var audioButton = document.getElementById('download-audio');

var url;
var valid = false;

// Preview on input
inputField.addEventListener('input', (e) => {
    url = e.target.value;

    // Get info
    if (url.length > 5) {
        vinfo.innerHTML = "Getting video info...";
        ytdl.getInfo(url, (err, info) => {
            if (err) {
                console.log(err);
                vinfo.innerHTML = "Something went wrong! :(";
                valid = false;
            }
            else {
                console.log(info);
                vinfo.innerHTML = `<strong>${info.title}</strong>`
                thumbnail.src = info.thumbnail;
                thumbnail.style.display = "block";
                valid = true;
            }
        });
    }
});

videoButton.addEventListener('click', save);
audioButton.addEventListener('click', save);

// Save
function save() {
    var options = {
        filters: [
            {name: "mp4", extensions: ["mp4"]}
        ]
    };
    if (valid) {
        dialog.showSaveDialog(options, (fname) => {
            if (fname != undefined) {
                downloadVideo(fname);
            }
        });
    }
}

// Download video
function downloadVideo(file) {
    console.log(url, file);
    var video = ytdl(
        url
    );

    video.pipe(fs.createWriteStream(file, { flags: 'a' }));

    video.on('error', (e) => {
        console.log(e);
    });

    video.on('end', () => {
        console.log(`Video downloaded at ${file}`);
    });
}

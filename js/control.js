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
var buttons = document.getElementById('buttons');
var downloading = document.getElementById('downloading');
var downloadingText = downloading.childNodes[1];

var url;
var valid = false;
var videoInfo;

// Preview on input
inputField.addEventListener('input', (e) => {
    url = e.target.value;

    // Get info
    if (url.length > 5) {
        thumbnail.style.display = 'none';
        vinfo.innerHTML = "Getting video info...";
        buttons.style.display = 'none';
        ytdl.getInfo(url, (err, info) => {
            if (err) {
                console.log(err);
                vinfo.innerHTML = "Something went wrong! :(";
                valid = false;
                buttons.style.display = 'none';
            }
            else {
                videoInfo = info;
                vinfo.innerHTML = `<strong>${info.title}</strong>`
                thumbnail.src = info.thumbnail;
                thumbnail.style.display = "block";
                valid = true;
                buttons.style.display = 'block';
            }
        });
    }
});

videoButton.addEventListener('click', () => {
    save(false);
});
audioButton.addEventListener('click', ()=> {
    save(true);
});

// Save
function save(audio=false) {
    var options = {
        defaultPath: videoInfo.title
    };
    if (audio) {
        options.filters = [
            {name: "mp3", extensions: ["mp3"]}
        ];
    }
    else {
        options.filters = [
            {name: "mp4", extensions: ["mp4"]}
        ];
    }
    if (valid) {
        dialog.showSaveDialog(options, (fname) => {
            if (fname != undefined) {
                buttons.style.display = 'none';
                if (audio) downloadAudio(fname);
                else downloadVideo(fname);
            }
        });
    }
}

// Download video
function downloadVideo(file) {
    console.log(url, file);
    var video = ytdl(url);
    var totalSize = 100;
    var currentSize = 0;
    var mb;

    downloadingText.innerText = 'Downloading video file...';
    loadingBar(0);
    downloading.style.display = 'block';

    video.pipe(fs.createWriteStream(file, { flags: 'a' }));

    video.on('info', (info) => {
        totalSize = info.size;
        //console.log(info.size);
        mb = info.size / Math.pow(2, 20);
        mb = round(mb, 2);
        //console.log(mb + " mb");
        console.log(info);
    });

    video.on('data', (chunk) => {
        currentSize += chunk.length;
        loadingBar((currentSize / totalSize) * 100);
        var currentMb = round(currentSize / Math.pow(2, 20), 2);
        downloadingText.innerText = "Downloading video file (" + currentMb + "/" + mb + " MB)";
    });

    video.on('error', (e) => {
        console.log(e);
    });

    video.on('end', () => {
        console.log(`Video downloaded at ${file}`);
        downloadingText.innerText = 'Download complete';
        buttons.style.display = 'block';
    });
}

// Download audio
function downloadAudio(file) {
    downloadingText.innerText = 'Downloading audio file...';
    downloading.style.display = 'block';
    loadingBar(0, 'none');

    ytdl.exec(url, ['-x', '--audio-format', 'mp3', '-o', file], {}, function(err, output) {
      if (err) throw err;
      console.log(output.join('\n'));
        downloadingText.innerText = 'Download complete';
        buttons.style.display = 'block';
    });
}

function loadingBar(percent, display='block') {
    var lb = document.getElementById('loading-bar');
    var bar = document.getElementById('bar');
    lb.style.display = display;
    bar.style.width = percent + '%';
}


function round(x, dec) {
    x *= Math.pow(10, dec);
    x = Math.round(x);
    x /= Math.pow(10, dec);
    return x;
}

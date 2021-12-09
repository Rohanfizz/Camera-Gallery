// let constraints = { video: true , audio: false};
let modes = document.querySelectorAll(".mode");
let filters = document.querySelector(".filters-container");
let videoRecordBtn = document.querySelector(".record-btn");
let captureBtn = document.querySelector(".capture-btn-outline");
let audioBtn = document.querySelector(".audio-btn-outline");
let timerEle = document.querySelector('.timer');
let stream;
let cTime = 0;
let recording = false;
let isVideo = true;
let timer;
let recorder;
let chunks = []; // media data in chunks
let currentFilterColor = 'transparent';

async function startStream(constraints){
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    const videoEle = document.querySelector('video');
    recording = false;
    videoEle.srcObject = stream;
    recorder = new MediaRecorder(stream);
    
    recorder.addEventListener('start',function(e){
        chunks = [];
        timer = setInterval(printTime,1000);
    })
    recorder.addEventListener('dataavailable',function (e){
        chunks.push(e.data);
    })
    recorder.addEventListener('stop',function(e){
        // conversion

        
    
        // let a = document.createElement('a');
        // a.href = url;
        // a.download = "stream.avi";
        // a.click();

        // adding to db
        if(db && isVideo){
            const blob = new Blob(chunks,{type:'video/avi'});
            let videoURL = URL.createObjectURL(blob);

            let videoId = `vid-${shortid()}`;
            let dbTransaction = db.transaction('video','readwrite');
            let videoStore = dbTransaction.objectStore('video');
            let videoEntry = {
                id: videoId,
                url: videoURL
            }
            videoStore.add(videoEntry);
        }else if(db && !isVideo){
            const blob = new Blob(chunks,{type:'audio/mp3'});
            let audioURL = URL.createObjectURL(blob);

            // let a = document.createElement('a');
            // a.href = url;
            // a.download = "recording.mp3";
            // a.click();
            let audioId = `aud-${shortid()}`;
            let dbTransaction = db.transaction('audio','readwrite');
            let audioStore = dbTransaction.objectStore('audio');
            let audioEntry = {
                id: audioId,
                url: audioURL
            }
            audioStore.add(audioEntry);
        }
    })
}
captureBtn.addEventListener('click', function (e){
    let video = document.querySelector('video');
    let canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let ctx = canvas.getContext('2d');
    // order is important here
    ctx.drawImage(video,0,0,video.videoWidth,video.videoHeight);
    ctx.fillStyle = currentFilterColor;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    console.log(currentFilterColor);

    let imageURL = canvas.toDataURL();
    // let a = document.createElement('a');
    // a.href = imageURL;
    // a.download = "image.jpg";
    // a.click();
    if(db){
        let imageId = `img-${shortid()}`;
        let dbTransaction = db.transaction('image','readwrite');
        let imageStore = dbTransaction.objectStore('image');
        let imageEntry = {
            id: imageId,
            url: imageURL
        }
        imageStore.add(imageEntry);
    }
})

audioBtn.addEventListener('click',function(e){
        recording = !recording;
        if(recording){
            recorder.start();
            isVideo = false;
        }else{
            recorder.stop();
        }
    }
)

async function stopStream(){
    stream.getTracks().forEach((track) =>{
        track.stop();
    })
}

modes.forEach(function (mode){
    mode.addEventListener('click', function(e){
        let myClass = e.target.classList[0];
        let audioModeContainer = document.querySelector('.audio-mode-container');
        let videoModeContainer = document.querySelector('.video-mode-container');
        let filtersContainer = document.querySelector('.filters-container');
        if(myClass == 'video-mode'){
            audioModeContainer.style.display = 'none';
            videoModeContainer.style.display = 'flex';
            filtersContainer.style.display = 'flex';

            if(stream) stopStream();
            startStream({video: true,audio: false});
            
        }else if(myClass == 'audio-mode'){
            audioModeContainer.style.display = 'flex';
            videoModeContainer.style.display = 'none';
            filtersContainer.style.display = 'none';

            if(stream)stopStream();
            startStream({video: false,audio: true});

        }else{
            audioModeContainer.style.display = 'none';
            videoModeContainer.style.display = 'none';
            filtersContainer.style.display = 'none';
            if(stream)stopStream();
        }
    })
})

filters.addEventListener('click',function(e){
    let filterColor = e.target.classList[1];
    let filterObj = document.querySelector(`.${filterColor}`);
    currentFilterColor = getComputedStyle(filterObj).getPropertyValue('background-color');
    // currentFilterColor = style.backgroundColor;
    // console.log(currentFilterColor);
    let videoContainer = document.querySelector('.filter-layer');
    videoContainer.classList.remove('red');
    videoContainer.classList.remove('blue');
    videoContainer.classList.remove('orange');
    videoContainer.classList.remove('transparent');
    videoContainer.classList.add(filterColor);
})


videoRecordBtn.addEventListener('click', function(){
    if(!recorder){
        console.log('asdasdasd');
        return;
    }
    recording = !recording;
    if(recording){   
        isVideo = true;
        videoRecordBtn.classList.add('record-animation');
        recorder.start();
    }else{
        clearInterval(timer);
        timerEle.innerText = '00:00:00';
        cTime = 0;
        videoRecordBtn.classList.remove('record-animation');
        recorder.stop();
    }
})



function timeGetter(myTime){
    let hours = Number.parseInt(myTime/3600);
    myTime = Number.parseInt(myTime%3600);
    let mins = Number.parseInt(myTime/60);
    myTime = Number.parseInt(myTime%60);
    hours = hours < 10? "0" + (hours) : (hours);
    mins = mins < 10? "0" + (mins) : (mins);
    myTime = myTime < 10? "0" + (myTime) : (myTime);

    return `${hours}:${mins}:${myTime}`;
}

function printTime(){
    timerEle.innerText = timeGetter(cTime);
    cTime++;
}




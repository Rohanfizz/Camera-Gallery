setTimeout(()=>{
    if(db){
        //video retieval

        let videoDbTransaction = db.transaction('video','readwrite');
        let videoStore = videoDbTransaction.objectStore('video');
        let videoRequest = videoStore.getAll();
        videoRequest.onsuccess = (e) =>{
            let videoResult = videoRequest.result;
            videoResult.forEach((videoObj) => {
                let mediaElem = document.createElement('div');
                mediaElem.className = 'item-box';
                mediaElem.setAttribute('id',videoObj.id);

                let url = videoObj.url;

                mediaElem.innerHTML = `
                <div class="thumbnail"><video playsinline autoplay muted loop src='${url}'></video></div>
                <div class="download-btn material-icons">file_download</div>
                <div class="delete-btn material-icons">delete</div>
                `;
                let videoModeContainer = document.querySelector('.video-mode-container');
                videoModeContainer.appendChild(mediaElem);
            })
        }

        // image retrieval
        let imageDbTransaction = db.transaction('image','readwrite');
        let imageStore = imageDbTransaction.objectStore('image');
        let imageRequest = imageStore.getAll();
        imageRequest.onsuccess = (e) =>{
            let imageResult = imageRequest.result;
            imageResult.forEach((imageObj) => {
                let mediaElem = document.createElement('div');
                mediaElem.className = 'item-box';
                mediaElem.setAttribute('id',imageObj.id);

                let url = imageObj.url;
                mediaElem.innerHTML = `
                <div class="thumbnail"><img src='${url}'/></div>
                <div class="download-btn material-icons">file_download</div>
                <div class="delete-btn material-icons">delete</div>
                `;
                let imageModeContainer = document.querySelector('.image-mode-container');
                imageModeContainer.appendChild(mediaElem);
            })
        }
    }
},100)
let videoSelector = document.querySelector('.video-mode-selector');
let imageSelector = document.querySelector('.image-mode-selector');
let audioSelector = document.querySelector('.audio-mode-selector');
let videoContainer = document.querySelector('.video-mode-container');
let audioContainer = document.querySelector('.audio-mode-container');
let imageContainer = document.querySelector('.image-mode-container')
let modeContainer = document.querySelector('.mode-container');

modeContainer.addEventListener('click',function(e){
let target = e.target;
// console.log(target.classList);
videoSelector.classList.remove('selected'); videoContainer.style.display = `none`;
imageSelector.classList.remove('selected'); imageContainer.style.display = `none`;
audioSelector.classList.remove('selected'); audioContainer.style.display = `none`;
document.querySelector(`.${target.className}`).classList.add(`selected`);
let whichMode = target.className.split('-')[0];
document.querySelector(`.${whichMode}-mode-container`).style.display = `flex`;
})

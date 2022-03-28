// Play selected audio and make sure all other audio is paused
async function playAudio(audioArray, playIndex) {
    for (let i = 0; i < audioArray.length; i++) {
        if (i === playIndex) {
            audioArray[i].volume = 1;
            await audioArray[i].play();
        } else {
            audioArray[i].volume = 0;
            audioArray[i].pause();
        }
    }
}
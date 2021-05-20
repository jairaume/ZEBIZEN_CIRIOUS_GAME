function startWalkSound(sound){
    sound.play();
}
function stopWalkSound(sound){
    sound.pause();
}
function getVolume(d){
    return d > 600 ? 0 : 1-((d/600))
}


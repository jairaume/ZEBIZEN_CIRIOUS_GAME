export default class CountdownController{	
    constructor(scene,duration,target){
		this.scene=scene
		this.duration=duration
		this.target=target
		this.timerEvent=undefined
	}

	formatTime(seconds)
	{
		// Minutes
		var minutes = Math.floor(seconds/60);
		// Seconds
		var partInSeconds = seconds%60;
		// Adds left zeros to seconds
		partInSeconds = partInSeconds.toString().padStart(2,'0');
		// Returns formated time
		return `${minutes}:${partInSeconds}`;
	}
	
	onEvent()
	{
		this.duration -= 1; // One second
		this.target.setText(this.formatTime(this.duration));
	}

	start()
	{
        this.target.setText(this.formatTime(this.duration))
        this.timerEvent = this.scene.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, repeat:this.duration-1 });
    }

	stop()
	{
		this.target.setText('En pause. '+ this.formatTime(this.duration));
		this.timerEvent.destroy()
		this.timerEvent=undefined
	}

	restart()
	{
		this.target.setText(this.formatTime(this.duration));
		this.timerEvent = this.scene.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, repeat:this.duration-1 });
	}

	isFinish()
	{
		if(this.duration==0) this.target.setText("Le jeu est terminé !")
	}
}
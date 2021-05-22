export default class CountdownController{	
    constructor(scene,duration,target,progressBar){
		this.scene=scene
		this.duration=duration
		this.max=duration
		this.target=target
		this.timerEvent=undefined
		this.progressBar = progressBar
		
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
		let pourcentage = (this.max-this.duration)/this.max;
		let newWidth = pourcentage*680;
		this.target.setText(this.formatTime(this.duration));
		if(newWidth>40) this.progressBar.fillRoundedRect(window.innerWidth - 710,window.innerHeight - 110,newWidth,30,15);
	}

	start()
	{
        this.target.setText(this.formatTime(this.duration))
		this.progressBar.fillStyle(0xFF0000,1)
		this.progressBar.fillRoundedRect(window.innerWidth - 710,window.innerHeight - 110,50,30,15);
		this.progressBar.setDepth(11);
		this.timerEvent = this.scene.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, repeat:this.duration-1 });
    }

	stop()
	{
		this.target.setText('En pause : '+ this.formatTime(this.duration));
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
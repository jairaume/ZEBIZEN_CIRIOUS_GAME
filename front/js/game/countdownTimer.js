export default class CountdownController{	
    constructor(scene,target,duration){
		this.scene=scene
		this.duration=duration
		this.max=duration
		this.target=target
		this.timerEvent=undefined
	}

	setDuration(duration){
		this.duration = duration;
	}

	formatTime(seconds)
	{
		var minutes = Math.floor(seconds/60);
		var partInSeconds = seconds%60;
		partInSeconds = partInSeconds.toString().padStart(2,'0');
		return `${minutes}:${partInSeconds}`;
	}
	
	onEvent()
	{
		this.duration -= 1; // One second
		this.target.setText(this.formatTime(this.duration));
	}


	start()
	{
		this.target = this.scene.add.text(window.innerWidth/2, 20, this.formatTime(this.duration), { 
			fontSize: 50,
		 })
		.setDepth(10)
		.setOrigin(0.5, 0)
		.setStroke("#383838",8)

		this.timerEvent = this.scene.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, repeat:this.duration-1});
    }

	stop()
	{
		this.target.setText(this.formatTime(this.duration));
		this.timerEvent.destroy()
		this.timerEvent=undefined
	}

	restart()
	{
		this.target.setText(this.formatTime(this.duration));
		this.timerEvent = this.scene.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, repeat:this.duration-1});
	}

	isFinish()
	{
		if(this.duration==0){
			this.target.setText("Le jeu est terminé !")
			return true;
		}
	}
}
            
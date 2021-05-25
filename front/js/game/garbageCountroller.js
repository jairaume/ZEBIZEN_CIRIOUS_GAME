export default class GarbageCountroller{	
	constructor(){
		this.scene = undefined
		this.garbageLabel=undefined
		this.garbageProgressBar = undefined
		this.garbageObjectif = undefined
		this.garbage = 0;
		this.autorization = false;
	}

	setAttribute(scene,garbageLabel,garbageProgressBar,garbageObjectif){
		this.scene = scene
		this.garbageLabel=garbageLabel
		this.garbageProgressBar = garbageProgressBar
		this.garbageObjectif = garbageObjectif
	}

	autorizationOnTrue(){
		console.log("Vous avez l'autorisation.")
		this.autorization = true;
	}

	autorizationOnFalse(){
		console.log("Vous n'avez plus l'autorisation.");
		this.autorization = false;
	}

	getAutorization(){
		return this.autorization
	}

	setGarbageNumber(garbageNumber)
	{
		let pourcentage = garbageNumber / this.garbageObjectif;
		let newWidth = pourcentage*680;
		this.garbageLabel.setText("Objectif Déchets : "+garbageNumber+"/"+this.garbageObjectif);
		this.garbageProgressBar.fillRoundedRect(window.innerWidth - 710,window.innerHeight - 70,newWidth,30,15);
	}

	start()
	{
        this.garbageLabel = this.scene.add.text(window.innerWidth-20, window.innerHeight - 80, "Objectif Déchets : 0/"+this.garbageObjectif, { fontSize: 50 })
        .setDepth(10)
        .setOrigin(1, 1);  
		this.garbageProgressBar.fillStyle(0x008000,1)
		this.garbageProgressBar.fillRoundedRect(window.innerWidth - 710,window.innerHeight - 60,200,30,15);
		this.garbageProgressBar.setDepth(11);
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
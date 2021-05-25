export default class GarbageCountroller{	
	constructor(){
		this.scene = undefined
		this.garbageLabel=undefined
		this.garbageObjectif = undefined
		this.garbage = 0;
		this.autorization = false;
	}

	setAttribute(scene,garbageLabel,garbageObjectif){
		this.scene = scene
		this.garbageLabel=garbageLabel
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
		this.garbageLabel.setText("Déchets jetés : "+garbageNumber+"/"+this.garbageObjectif);
	}

	start()
	{
        this.garbageLabel = this.scene.add.text(window.innerWidth-50, 10, "Dechets jetés : 0/"+this.garbageObjectif, { 
			fontSize: 30,
			align:'right',
			wordWrap: { width: window.innerWidth/4, useAdvancedWrap: true }
		 })
        .setDepth(10)
        .setOrigin(1,0);  
    }

}
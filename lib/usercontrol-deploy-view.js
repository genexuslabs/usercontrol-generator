'use babel';

import Usercontrol from './usercontrol'
import BaseForm from './base-form';

export default class UsercontrolDeployView extends BaseForm{
	GXUC = null;
	baseVer = "";
	constructor() {
		super();
		this.addControl("label", "label-version", {value: "Version", class: "setting-title"});
		this.addControl("input-text", "version");
	}

	attach(){
		let _path = Usercontrol.getPath();
		if (_path!=""){

			this.GXUC = new Usercontrol(Usercontrol.getPath(), (function(){

				let v = this.GXUC.getAttribute("Version");
				this.baseVer = v;

				this.setValue( "version", v);

				this.toggle();

			}).bind(this));

		}else{
			return alert("The project is not a Genexus Usercontrol");
		}
	}

	confirm(){
		let msg = "Please, confirm deploy the UC";
		let v = this.getValue("version");
		console.log("version: " + v);
		if (this.baseVer==v)
			msg = `Are you sure to keep usercontrol version ${v}?`;

		atom.confirm({message: msg, buttons: {
					Confirm: ()=>{alert("Confirmed..");},
					Cancel: null
		} })
	}
}

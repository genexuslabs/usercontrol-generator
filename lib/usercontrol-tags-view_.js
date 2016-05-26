'use babel';

import Usercontrol from './usercontrol'
import BaseForm from './base-form';

import path from 'path';
import fs from 'fs-plus';

export default class UsercontrolTagsView extends BaseForm{
	tags = null;

	constructor() {
		super("right");
		let tagfile = path.join( Usercontrol.getPackageBasePath(), "lib", "gxtags.json");
		fs.readFile( tagfile, (function(err, data){
			this.tags = JSON.parse(data);
			for(let i=0;i<this.tags.length;i++){
				let tag = this.tags[i];
				this.addControl("label", "", {value: tag.name, class: "setting-title"});
				this.addControl("text", "",{value: tag.description, class: "setting-description"});
			}

		}).bind(this));
	}

	attach(){
		this.toggle();
	}
}

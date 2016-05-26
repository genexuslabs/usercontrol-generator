'use babel';

import {SelectListView} from 'atom-space-pen-views';
import Usercontrol from './usercontrol'

import path from 'path';
import fs from 'fs-plus';

export default class UsercontrolTagsView extends SelectListView {
	tags = null;

  initialize() {
    super.initialize();
    this.addClass('usercontrol-generator');
  }

  getFilterKey() {
    return "name";
  }

  toggle() {
    if (this.panel && this.panel.isVisible()) {
      this.close();
    } else {
      this.show();
    }
  }

	show() {
	   if (this.panel == null) {
	      this.panel = atom.workspace.addModalPanel({item: this});
	   }

		let _show = (function(){
			 this.panel.show();
			 this.setItems(this.tags);
			 this.focusFilterEditor();
		}).bind(this);

		if (!this.tags){
			 let tagfile = path.join( Usercontrol.getPackageBasePath(), "lib", "gxtags.json");
			 fs.readFile( tagfile, (function(err, data){
			 	this.tags = JSON.parse(data);
				_show();
			}).bind(this));
		}else {
			_show();
		}
  }

  confirmed(item) {
  }

  close() {
    if (this.panel) {
      this.panel.destroy();
      this.panel = null;
    }

    atom.workspace.getActivePane().activate();
  }

  cancelled() {
    this.close();
  }

  viewForItem( item ) {
	  //{_id, title, group, icon, devMode, paths, project}
    return `<li class="two-lines">
	 				<div class="primary-line">${item.name} (${item.type})</div>
					<div class="secondary-line">${item.description}<br/>
														Interfaces: ${item.interfaces}<br/>
														Compatibility: ${item.version}
					</div>
				</li>`;
  }
}

'use babel';

import provider from './autocomplete/provider';
import UsercontrolCreateView from './usercontrol-create-view';
import Usercontrol from './usercontrol';
// import gulp = allowUnsafeNewFunction -> require 'gulp';

import UsercontrolBuildView from './usercontrol-build-view';
// import UsercontrolTagsView from './usercontrol-tags-view';


import { CompositeDisposable } from 'atom';

export default {
	subscriptions: null,
	
   getProvider(){
		return provider;
	},

	activate(state) {
		// Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
		this.subscriptions = new CompositeDisposable();

		// Register command that toggles this view
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'usercontrol-generator:create': this.usercontrolCreate,
			'usercontrol-generator:build-debug': () => this.build("debug"),
			'usercontrol-generator:build-release': () => this.build("release")
		}));

		// Se asocia la extensión control a xml
		this.subscriptions.add(
			atom.grammars.onDidAddGrammar( function(g){
				if (g.scopeName === "text.xml")
					g.fileTypes.push("control");
			})
		);
	},
	deactivate() {
		this.subscriptions.dispose();
		// this.usercontrolCreate.destroy();
	},
	usercontrolCreate() {
		if (!this.usercontrolCreate)
			this.usercontrolCreate = new UsercontrolCreateView();
		this.usercontrolCreate.attach();
	},
	build(env) {
		if (!this.usercontrolBuild)
			this.usercontrolBuild = new UsercontrolBuildView();
		this.usercontrolBuild.attach(env);
	}
};

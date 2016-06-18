'use babel';

/*
	Description: Atom team is choosing a new View framework and this is a wrap for the final decision.
	https://github.com/atom/atom/issues/5756
*/




export default class BaseForm {
	panel =  null;
	element= null;
	elements = {items: 0};
	firstel = null;

	constructor(position) {
		this.element = document.createElement('div');
		this.element.classList.add("settings-view");
		this.element.classList.add("usercontrol-generator");

		//this.elements = {};

		let _me = this;

		if (!this.panel){

			if(position=="right")
				this.panel = atom.workspace.addRightPanel( {item: this.element, visible: false} );
			else{
				this.panel = atom.workspace.addModalPanel( {item: this.element, visible: false} );
				atom.commands.add( this.element, 'core:cancel', () => this.hide());

				document.addEventListener("mousedown", function(e){
					 if (_me.element !== e.target  && !_me.element.contains(e.target))
					 {
						  _me.hide();
					 }
				} );
			}

			atom.commands.add( this.element, 'core:confirm', () => this.confirm());
		}
	}

	confirm(){}

	show(){
		if (!this.panel.isVisible()){
			this.panel.show();
			if (this.firstel)
				this.firstel.focus();
		}
	}

	hide(){
		if (this.panel.isVisible())
			this.panel.hide();
	}

	toggle(){
		this.panel.isVisible() ? this.hide() : this.show();
	}
	// Returns an object that can be retrieved when package is activated
   serialize() {}

   // Tear down any state and detach
   destroy() {
 	  this.panel.destroy();
 	  this.commandSubscription.dispose();
   }

   getElement() {
     return this.element;
   }

	clear(){
		this.elements = {items: 0};
		this.element.innerHTML = "";
	}
	// Add control to form
	/*
	type = "text", "check", block, label
	*/
	addControl(type, name, opts = {}){
		let el = null;

		switch (type) {
			case "input-text":
				el = document.createElement( "input");
				el.type = "text";
				break;

			case "input-check":
				el = document.createElement( "input");
				el.type = "checkbox";
				break;

			case "block":
				el = document.createElement( "div");
				break;

			case "label":
				el = document.createElement( "label");
				break;

			case "text":
				el = document.createElement( "p");
				break;

			default:
				return null;
		}

		this.elements[name] = el;

		if (el.tagName=="INPUT"){
			el.tabIndex = this.elements.items++;

			if (!this.firstel) // default focus
				this.firstel = el;

			el.classList.add("native-key-bindings");
			el.classList.add("form-control");
			el.onkeypress = (function(evt){
				if (evt.keyCode == 13) {
			        this.confirm();
			    }
			}).bind(this);
		}

		if (opts.class)
			el.classList.add(opts.class);

		if (opts.value)
			this.setValue( name, opts.value);

		if (opts.container)
			this.elements[opts.container].appendChild(el);
		else
			this.element.appendChild(el);
	}

	appendValue( name,  value){
		let el = this.elements[name];
		if (el.tagName=="P") {
			el.innerHTML += value;
			el.scrollTop = el.scrollHeight;
		}
	}

	setValue( name, value){
		let el = this.elements[name];

		if (el.tagName=="INPUT") {
			switch (el.type) {
				case "text":
					el.value = value;
					break;

				case "checkbox":
					el.checked = value;
					break;
			}
		}
		else
			el.textContent = value;

	 }

	getValue(name){
		let el = this.elements[name];

		if (el.tagName=="INPUT") {
			switch (el.type) {
				case "text":
					value = el.value;
					break;

				case "checkbox":
					value = el.checked;
					break;
			}
		}
		else
			value = el.textContent;

		return value;
	}
}

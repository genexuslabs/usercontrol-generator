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
	loading = null;
	constructor(position) {
		this.element = document.createElement('div');
		this.element.classList.add("settings-view");
		this.element.classList.add("usercontrol-generator");

		// Loading
		this.loading = document.createElement('div');
		this.loading.classList.add("waitform");
		this.loading.textContent = "Please wait...";
		this.element.appendChild(this.loading);

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
			this.block(false);
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
		this.element.appendChild(this.loading);
		this.block(false);
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

			case "input-select":
				el = document.createElement( "select");
				if (opts.list){
					for(let i=0; i<opts.list.length; i++){
						let opt = document.createElement( "option");
						opt.label = opts.list[i].label;
						opt.value = opts.list[i].value;
						el.appendChild( opt );
					}

				}
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

		// control classes
		if (el.tagName=="INPUT" || el.tagName=="SELECT"){
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

		// Parent
		let parent = this.element;
		if (opts.container)
			parent = this.elements[opts.container];

		// label
		let wrap = el;
		if (opts.label){
			let label = document.createElement( "label");

			if (type == "input-check"){
				wrap = document.createElement( "div");
				wrap.classList.add("checkbox");
				label.appendChild(el);
				label.appendChild(document.createElement( "div"));
				label.children[1].classList.add("setting-title");
				label.children[1].textContent = opts.label;

				wrap.appendChild(label);
			}else{
				label.classList.add("setting-title");
				label.textContent = opts.label;
				parent.appendChild(label);
			}
		}

		parent.appendChild(wrap);
		/*
		if (opts.container)
			this.elements[opts.container].appendChild(wrap);
		else
			this.element.appendChild(wrap);
		*/
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
		}else if (el.tagName=="SELECT")
			el.value = value;
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
		else if (el.tagName=="SELECT"){
			value = el.options[ el.selectedIndex ].value;
		}else
			value = el.textContent;

		return value;
	}
	block(isBlocking){
		if (isBlocking){
			this.loading.style.display = "block";
		}
		else
			this.loading.style.display = "none";
	}
}

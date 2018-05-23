(function() {
	
	function RightClick() {
		this._storedText = '';
		this._DOMElements = {};
		this.initializeDOMElements();
		this.makeContextMenu();
	}
	
	RightClick.prototype.initializeDOMElements = function() {
		this._DOMElements = {
			someText : document.getElementById("someText")
		};
		document.addEventListener("click",this.clickHandler.bind(this));
		document.addEventListener("keydown",this.escKeyHandler.bind(this));
		someText.addEventListener("contextmenu",this.rightClickHandler.bind(this));
	}
	
	RightClick.prototype.makeContextMenu = function() {
		let contextMenu = document.createElement('div');
		contextMenu.id = "contextMenu";
		contextMenu.className = "contextMenu";
		document.body.append(contextMenu);
		this._DOMElements.contextMenu = contextMenu;
		let menuFunctions = ["Cut" , "Copy" , "Paste" , "Select All"];
		this._DOMElements.menuItems = [];
		for(let i = 0; i < 4; i++) {
			let menuItem = document.createElement('div');
			menuItem.id = `${menuFunctions[i]}`
			menuItem.className = "menuItem";
			menuItem.innerHTML = menuFunctions[i];
			contextMenu.append(menuItem);
			this._DOMElements.menuItems.push({func: menuFunctions[i], item: menuItem});
		}
		this._DOMElements.contextMenu.addEventListener('click',this.executeOperation.bind(this)); 
	}
	
	RightClick.prototype.clickHandler = function() {
		this.hideContextMenu();
	}
	
	RightClick.prototype.escKeyHandler = function(event) {
		if(event.keyCode === 27) {
			this.hideContextMenu();
		}
	}
	
	RightClick.prototype.rightClickHandler = function(event) {
		event.preventDefault();
		this.showContextMenu(event.clientX,event.clientY);
		this.disableInactiveItems();
	}
	
	RightClick.prototype.disableInactiveItems = function() {
		let activeItems = [];
		let inactiveItems = [];
		let selectStart = this._DOMElements.someText.selectionStart;
		let selectEnd = this._DOMElements.someText.selectionEnd;
		//console.log([selectStart,selectEnd]);
		let selectAll = this._DOMElements.menuItems.filter(menuItem => menuItem.func === "Select All");
		if(this._DOMElements.someText.value.length < 1 || (selectStart === 0 && selectEnd === this._DOMElements.someText.value.length)) {
			inactiveItems = selectAll;
		}
		else {
			activeItems = selectAll;
		}
		//console.log(inactiveItems);
		let cutCopy = this._DOMElements.menuItems.filter(menuItem => menuItem.func === "Cut" || menuItem.func === "Copy");
		if(selectStart === selectEnd) {
			inactiveItems = [...inactiveItems, ...cutCopy];
		}
		else {
			activeItems = [...activeItems, ...cutCopy];
		}
		//if() handle if paste is disabled
		for(let inactiveItem of inactiveItems) {
			inactiveItem.item.classList.add("inactive");
		}
		for(let activeItem of activeItems) {
			activeItem.item.classList.remove("inactive");
		}
	}
	
	RightClick.prototype.showContextMenu = function(left,top) {
		this._DOMElements.contextMenu.style.display = "block";
		this._DOMElements.contextMenu.style.left = left;
		this._DOMElements.contextMenu.style.top = top;
	}
	
	RightClick.prototype.hideContextMenu = function() {
		this._DOMElements.contextMenu.style.display = "none";
	}
	
	RightClick.prototype.executeOperation = function(event) {
        let selectStart = this._DOMElements.someText.selectionStart;
        let selectEnd = this._DOMElements.someText.selectionEnd;
        alert(this._storedText);
		if(!event.target.classList.contains("inactive")) {
			switch(event.target.id) {
				case "Cut" : this.cut(selectStart,selectEnd);
							break;
				case "Copy" : this.copy(selectStart,selectEnd);
							break;
				case "Paste" : this.paste(selectStart,selectEnd);
							break;
				case "Select All" : this.selectAll(selectStart,selectEnd);
							break;
			}
		}
	}
	
	RightClick.prototype.cut = function(selectStart,selectEnd) {
        this._storedText = this._DOMElements.someText.value.substring(selectStart,selectEnd);
		//this._DOMElements.someText.value.splice(selectStart,this._selText.length);
	}
	
	RightClick.prototype.copy = function(selectStart,selectEnd) {
		this._storedText = this._DOMElements.someText.value.substring(selectStart,selectEnd);
	}
	
	RightClick.prototype.paste = function() {
		alert(this._storedText);
	}
	
	RightClick.prototype.selectAll = function() {
		this._DOMElements.someText.select();
	}
	
	let newClick = new RightClick();
	
})();
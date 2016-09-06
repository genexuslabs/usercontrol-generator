function {UC.Name}($)
{
	this._id;
	this._data;

	// Databinding for property Attribute
	this.SetAttribute = function(data) {
		this._data = data;
	}

	// Databinding for property Attribute
	this.GetAttribute = function() {
		return $("#"+this._id).val();
	}

	this.show = function()
	{
		this._id = this.ContainerName + '-inner';
		this.setHtml( '<input type="text" class="form-control" id="' + this._id + '" value="'+this._data+'">' );
	}

	this.destroy = function()
	{
    	// Add your cleanup code here. This method will be called when the control is destroyed.
	}
}

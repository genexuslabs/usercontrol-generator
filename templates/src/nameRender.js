function {UC.Name}($)
{
	this.show = function()
	{
		$(this.getContainerControl()).html('<h1>Hello world!</h1>');
	}

	this.destroy = function() 
	{
    	// Add your cleanup code here. This method will be called when the control is destroyed.
	}
}

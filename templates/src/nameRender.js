function {UC.Name}($)
{
	this.Width;
	this.Height;

	this.show = function()
	{
		$(this.getContainerControl()).html('<h1>Hello world!</h1>');
	}
}

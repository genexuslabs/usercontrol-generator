function {UC.Name}($)
{
	this.show = function()
	{
		var buffer = new gx.text.stringBuffer();
		buffer.clear();
		buffer.append('<table cellspacing="0" cellpadding="0" border="0" class="table table-bordered table-striped table-hover">');

		buffer.append("<thead>");
		buffer.append("<tr>");

		for (var i = 0; i < this.columns.length; i++) {
			if (this.columns[i].visible) {
				buffer.append('<th align="' + this.columns[i].align + '" >');
				buffer.append(this.columns[i].title + "&nbsp") ;
				buffer.append("</th>");
			}else
				buffer.append("<th style=\"display: none;\"></th>");
		}

		buffer.append("</tr>");
		buffer.append("</thead>");

		buffer.append("<tbody>");

		// Append grid rows
		for (var i = 0; i < this.properties.length; i++) {
			buffer.append("<tr>");
			var row = this.properties[i];

			// Append row cells
			for (var j = 0; j < row.length; j++) {
				var cell = row[j];

				// Tener en cuenta que las columnas no visibles igual deben ser cargadas.
				if (this.columns[j].visible) {
					buffer.append('<td align="' + this.columns[j].align +'">');

					if (cell.visible) // La columna es visible, pero esta celda en particular no, por lo que no se agrega contenido.
					{
						buffer.append( cell.getHtml() );
					}
					buffer.append("</td>");
				}else // no es visible la columna
					buffer.append("<td style=\"display: none;\">" + cell.getHtml() + "</td>");
			}
			buffer.append("</tr>");
		}
		buffer.append("</tbody>");

		// Append Pager
		var paging = false;

		if (this.getRowCount() > 0 ) {
			if (this.usePaging){
				buffer.append('<tfoot><tr><td colspan="' + this.columns.length + '" style="text-align: center;" >');
				
				buffer.append('<div class="btn-group" role="group">');

				if (!(this.isFirstPage() && this.isLastPage())){
					if (this.currentPage <= 0)
						this.currentPage = 1;

					   if (!this.isFirstPage()) {
						  paging=true;
							buffer.append('<button type="button" class="btn btn-default btn-first">&lt;&lt;</button>');
							buffer.append('<button id="ucGridPrev" type="button" class="btn btn-default btn-prev">&lt;</button>');
					   }
					   if (!this.isLastPage()) {
							paging=true;
							buffer.append('<button id="ucGridNext" type="button" class="btn btn-default btn-next">&gt;</button>');
							buffer.append('<button id="ucGridLast" type="button" class="btn btn-default btn-last">&gt;&gt;</button>');
					   }
				}
				if (!paging)
				   buffer.append('&nbsp');

				buffer.append("</div></td></tr></tfoot>");
			}

		}

		buffer.append("</table>");

		this.setHtml(buffer.toString());

		this.bindButton(".btn-first", 'FIRST');
		this.bindButton(".btn-prev", 'PREV');
		this.bindButton(".btn-next", 'NEXT');
		this.bindButton(".btn-last", 'LAST');
	}

	this.bindButton = function( btn, opc){
		var btnSel =  this.getContainerControl().querySelector(btn);
		if (btnSel)
			btnSel.onclick = (function(){ this.changeGridPage(opc)}).bind(this);
	}

	this.destroy = function()
	{
    	// Add your cleanup code here. This method will be called when the control is destroyed.
	}
}

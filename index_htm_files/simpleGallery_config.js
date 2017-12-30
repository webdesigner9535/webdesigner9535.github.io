var xaraSwidgets_simpleGalleryTemplates = {


	entry:		'<a href="{image}" classname="highslide" onmouseover="hs2.headingText=\'\'" onclick="return hs2.expand(this, { slideshowGroup:\'{component_id}\' } )">'
			+	'<span class="{component_id}imageBorder imageBorder">'
			+	'<img src="{thumbnail}" border="0" />'
			+	'</span>'
			+	'</a>',
			
	main:		'<div id="{component_id}OuterDiv" class="">'
			+ 	'<div id ="{component_id}InnerDiv" class="portfolio">'
			+ 	'{entryhtml}'
            + 	'</div>'
            + 	'</div>'          
            
};

var xaraSwidgets_simpleGalleryImagesDownloaded = {};
var xaraSwidgets_simpleGalleryThumbnailsDownloaded = {};
var xaraSwidgets_simpleGalleryThumbnailSize = 100;
var xaraSwidgets_simpleGalleryOriginalWidth = 500;


//var xaraSwidgets_simpleGalleryRows = 3;
//var xaraSwidgets_simpleGalleryCols = 2;

function xaraSwidgets_simpleGalleryOverallConstructor(divID, data, config)
{
	var useCols = config.cols ? config.cols : 3;
	var padding = config.padding ? config.padding : 5;
	var margin = config.margin ? config.margin : 3;
	panelTrans = (data[0].trans);

	xaraSwidgets_simpleGalleryCols = useCols;
	xaraSwidgets_simpleGalleryOriginalPadding = padding;
	xaraSwidgets_simpleGalleryOriginalMargin = margin;
	
	/*
	if(xaraSwidgets_simpleGalleryCols==null)
	{
		xaraSwidgets_simpleGalleryCols = 2;
	}
	
	if(xaraSwidgets_simpleGalleryOriginalPadding==null)
	{
		xaraSwidgets_simpleGalleryOriginalPadding = 5;
	}
	
	if(xaraSwidgets_simpleGalleryOriginalMargin==null)
	{
		xaraSwidgets_simpleGalleryOriginalMargin = 3;
	}
	*/
	
	if ($.browser.msie)// && $.browser.version.substr(0,1)<7) {
	{
		var version = parseFloat($.browser.version);
		
		if(version<7)
		{
			$('#' + divID).html('you require Internet explorer 7 or greater to view this widget...');
			return;
		}
		
	}
	
	var fileFolder = 'index_htm_files';
	
	$('script').each(function() {
		
		var src = $(this).attr('src');
		
		if(src)
		{
			var parts = src.split('/');
		
			if(parts[1]=='simpleGallery_config.js')
			{
				fileFolder = parts[0];
			}
		}
		
	});
	
	//window.hs = window.simpleGalleryHighslide;
	
	window.hs2.outlineType=fileFolder + "/sgcustoms";
	window.hs2.addSlideshow({slideshowGroup: divID, interval: 5000,repeat: true,useControls: true,fixedControls: 'fit',overlayOptions: {className: 'controls-in-heading',opacity: '0.75',position: 'bottom center',offsetX: '0',offsetY: '-10',hideOnMouseOut: true}});
	
	xaraSwidgets_simpleGalleryInit(divID, data);
	
}

function xaraSwidgets_simpleGalleryGetScaledNumber(container, num, min)
{
	var widthRatio = container.width() / xaraSwidgets_simpleGalleryOriginalWidth;
	
	var newNum = Math.round(widthRatio * num);
	
	if(min==null) { min = 1; }
	
	if(newNum<=min) { newNum = min; }
	
	return newNum;
}

// this is the constructor for a component
// it loops through each 'entry' in the array of data and compiles the entry template for it
// it then applies the resulting HTML to the main template before writing the whole lot to the div on the page
// it then initialises the actual jquery plugin for the div (that now contains the required HTML as a result of writing the template to it)
function xaraSwidgets_simpleGalleryInit(divID, data)
{
	var imageSize = xaraSwidgets_simpleGalleryThumbnailSize;
	
	var container = $('#' + divID).parent();
	
	$('#' + divID).width(container.width()).height(container.height())
	.css({
		'overflow-y':'hidden',
		'overflow-x':'hidden'
	});
	
	var widthRatio = container.width() / xaraSwidgets_simpleGalleryOriginalWidth;
	
	var newPadding = xaraSwidgets_simpleGalleryGetScaledNumber(container, xaraSwidgets_simpleGalleryOriginalPadding);
	var newMargin =  xaraSwidgets_simpleGalleryGetScaledNumber(container, xaraSwidgets_simpleGalleryOriginalMargin);
	var newMarginBottom =  xaraSwidgets_simpleGalleryGetScaledNumber(container, 10);
	var scrollbarWidth =  xaraSwidgets_simpleGalleryGetScaledNumber(container, 10, 4);
	var shadow1 = xaraSwidgets_simpleGalleryGetScaledNumber(container, 4);
	var shadow2 = xaraSwidgets_simpleGalleryGetScaledNumber(container, 9);
	var shadow3 = xaraSwidgets_simpleGalleryGetScaledNumber(container, 4);
	
	if(scrollbarWidth>16)
	{
		scrollbarWidth = 16;	
	}
	
	// get the opacity value for the panel
		var enteredTrans = parseFloat(panelTrans);
		var defaultTrans = '0.3';
		var panelTrans = isNaN(enteredTrans) ? defaultTrans : enteredTrans
		var iePanelTrans = panelTrans*100;

	var shadowCSS = shadow1 + 'px ' + shadow1 + 'px ' + shadow2 + 'px 0px rgba(0,0,0,'+panelTrans+')';
	
	$('#' + divID).data('scrollbarWidth', scrollbarWidth);
	
	var tableWidth = container.width()-scrollbarWidth-2;
	
	$('#' + divID).data('tableWidth', tableWidth);
	
	var showShadows = true;
	var dimPage = true;
	
	var currentCol = 0;
	//width=' + tableWidth + '
	var entryHTML = '<table class="imageTable" border=0 cellpadding=0 cellspacing=0><tr>';
	// loop through each entry in the array and compile the entry template for it
	for(var i=0; i<data.length; i++)
	{
		var entryData = data[i];
		entryData.component_id = divID;
		if(i==0)
		{
			if(!entryData.showshadow.match(/y/i))
			{
				showShadows = false;
			}
			
			if(!entryData.dimpage.match(/y/i))
			{
				dimPage = false;
			}
		}
		else
		{
			entryData.thumbnail = entryData.thumbnail;
			
			var cellHTML = xaraSwidgets_compileTemplate(xaraSwidgets_simpleGalleryTemplates.entry, entryData);
			
			entryHTML += '<td align=center valign=middle>' + cellHTML + '</td>';
			
			currentCol++;
			
			if(currentCol>=xaraSwidgets_simpleGalleryCols)
			{
				entryHTML += '</tr><tr>';
				
				currentCol = 0;
			}
		}
	}
	
	if(!showShadows)
	{
		window.hs2.outlineType = null;
	}
	
	if(!dimPage)
	{
		window.hs2.dimmingOpacity = 0;
	}
	
	entryHTML += '</tr></table>';

	

	// now lets compile the 'main' template which acts as a wrapper for each entry
	
	var mainData = {
		component_id:divID,
		entryhtml:entryHTML
	};
	
	var mainTemplate = xaraSwidgets_compileTemplate(xaraSwidgets_simpleGalleryTemplates.main, mainData);
	
	// now lets apply the resulting HTML for the whole component to the main DIV that was exported by XARA
	
	$('#' + divID).html(mainTemplate);
	
	/*
	// now we have the components DOM on the page - we can use the 'OuterDiv' as the jquery initiation point
	$('#' + divID + 'OuterDiv').find('#fancy').fancybox({
		'transitionIn'	:	'elastic',
		'transitionOut'	:	'elastic',
		'easingIn'		:	'easeOutBack',
		'easingOut'		:	'easeOutBack',
		'speedIn'		:	400, 
		'speedOut'		:	200,
		'padding'		:	10,
		'overlayOpacity'	: 	dimPage ? 0.3 : 0,
		onStart: function()
		{
			if(!showShadows)
			{
				$('.fancybox-bg').hide();
			}
		}

	});
	*/
	
	newPadding -= 1;
	
	if($.browser.msie && document.documentMode && document.documentMode <= 7)
	{
		newMargin = 0;
		newMarginBottom -= 2;
	}
	
	$('#' + divID).find('.imageBorder').css({
		'padding':newPadding + 'px',
		'margin-bottom':newMarginBottom + 'px',
		'margin-left':newMargin + 'px',
		'margin-right':newMargin + 'px',
		'-webkit-box-shadow': shadowCSS,
		'-moz-box-shadow': shadowCSS,
		'box-shadow': shadowCSS
		/* For IE 8 */
		//'-ms-filter': "progid:DXImageTransform.Microsoft.Shadow(Strength=" + shadow3 + ", Direction=135, Color='#cccccc')"

		/* For IE 5.5 - 7 */
//		'filter': "progid:DXImageTransform.Microsoft.Shadow(Strength=" + shadow3 + ", Direction=135, Color='#000000')"
//		'filter': "progid:DXImageTransform.Microsoft.dropshadow(OffX=2, OffY=2, Color='#80000000') "

	}).resize(function() {
	
		checkScrollbars(divID);
		
	});

	$('head').append("<style> body:last-child ."+divID+"imageBorder {filter: none;}" 
	+ "."+divID+"imageBorder {filter: progid:DXImageTransform.Microsoft.dropshadow(OffX=4, OffY=4, Color='#"+iePanelTrans+"000000') }"
	+"</style>" );
	
	checkScrollbars(divID);
	
	//xaraSwidgets_simpleGalleryCheckScrolling(divID);
}

function checkScrollbars(divID)
{
	if($('#' + divID).data('doneScrolling')) { return; }
		
	if($('#' + divID).find('.portfolio').height()>$('#' + divID).height())
	{
		$('#' + divID).jScrollPane({showArrows: false});
		$('#' + divID).data('foundScrolling', true);
		
		$('#' + divID).find('.jspVerticalBar').css({
			'width':$('#' + divID).data('scrollbarWidth') + 'px'
		});
	}
	
	
	 

	//console.log($('#' + divID).data('tableWidth'));
	
	$('#' + divID).find('.imageTable').width($('#' + divID).data('tableWidth')-2);

	
}

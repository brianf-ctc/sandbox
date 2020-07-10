function displayPortlet(portlet, column)
{
    portlet.setTitle('Catalyst Login Status Portlet');
    var context = nlapiGetContext();
    var emailaddress = context.getEmail();
    var content = "<iframe frameborder=0 marginwidth=0 marginheight=0 border=0 "+
        "style=\"border:0;margin:0;width:400px;height:90px;\" "+
        "src=\"https://tstdrv1716422.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=712&deploy=1&compid=TSTDRV1716422&h=5ffa4e0d8256bd08c51d&custparam_emailaddress="+emailaddress+"&custparam_pagetype=login\" "+
        "scrolling=\"no\" allowtransparency=\"true\"></iframe>";
    portlet.setHtml( content );
}

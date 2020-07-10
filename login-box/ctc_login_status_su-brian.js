//This suitelet goes to the main server where the login status for all accounts are displayed.

function mainPage(request, response) {

    var searchID = 'customsearch_ctc_loginstatusview';

    var form = nlapiCreateForm("", true);
    var logmessage = form.addField('custpage_log', 'inlinehtml', 'Text');

    // var params = request.getAllHeaders();
    //
    // for (var param in params){
    //     nlapiLogExecution('DEBUG', param, params[param]);
    // }

    if (request.method === "GET") {


        var arrHeaders = ['User-Agent','Host','From'];
        for (var ii=0,jj=arrHeaders.length; ii<jj; ii++) {
            var headerName = arrHeaders[ii];
             nlapiLogExecution('DEBUG',headerName, JSON.stringify(request.getHeader(headerName) ) );
        }

        // nlapiLogExecution('DEBUG','User-Agent', JSON.stringify(request.getHeader('User-Agent')) );


        if (request.getParameter('custparam_pagetype') == 'checkstatus') {
            form.setTitle('Catalyst Login Status Checker');
            var timeSublist = form.addSubList('custpage_timesublist', 'list', 'Login Status List');

            var labelField = form.addField('custpage_label1', 'inlinehtml', 'Label');


            var loadSearch = nlapiLoadSearch(null, searchID);
            var allColumns = loadSearch.getColumns();

            //build the sublist, by adding all of its columns first
            for (var i = 0; i < allColumns.length; i++) {
                var sublist_type = 'text';
                var column_name = allColumns[i].getName();
                if (column_name != 'custrecord_ctc_scriptdeployed')
                    timeSublist.addField('custpage_' + allColumns[i].getName(), sublist_type, allColumns[i].getLabel());
            }
            timeSublist.addField('custpage_location', 'textarea', 'Location');
            timeSublist.addField('custpage_person', 'textarea', 'Possible Person Logged In (?)');

            var searchResults = nlapiSearchRecord(null, searchID, null, null);

            if (searchResults) {
                var loggedInCount = 0;
                //build sublist data
                for (var i = 0; i < searchResults.length; i++) {

                    var searchResult = searchResults[i];
                    var rowColumn = searchResult.getAllColumns();

                    for (var j = 0; j < rowColumn.length; j++) {
                        var columnData;
                        var columnName = rowColumn[j].getName();

                        //make sure columns get a value, the text value or internal value
                        if (searchResult.getText(rowColumn[j]) != null) {
                            columnData = searchResult.getText(rowColumn[j]);
                        } else {
                            columnData = searchResult.getValue(rowColumn[j]);
                        }

                        if (columnData == 'T' && columnName == 'custrecord_ctc_login_status_loggedin') {
                            loggedInCount++;
                            columnData = "<span style='background-color:red'>LOGGED IN</span>";
                        }
                        if (columnData == 'F' && columnName == 'custrecord_ctc_login_status_loggedin') {
                            columnData = "<span style='background-color:lightgreen'>AVAILABLE</span>";
                        }

                        if (columnName != 'custrecord_ctc_scriptdeployed')
                            timeSublist.setLineItemValue('custpage_' + columnName, i + 1, columnData);
                        //nlapiLogExecution('DEBUG', 'Column Name: ' + columnName);
                        if (columnName == 'custrecord_ctc_login_status_ipaddress' && columnData.length > 0) {
                            var JSONPayload = nlapiRequestURL('https://api.ipdata.co/' + columnData + '?api-key=1922c80a8c87c909cff1d9fce7d7d1506842892f2026ab473d6bc87b');
                            //nlapiLogExecution('DEBUG', 'IP Address: ' + columnData);
                            var JSONData = JSON.parse(JSONPayload.getBody());
                            //nlapiLogExecution('DEBUG', 'JSON Data: ' + JSONData);
                            timeSublist.setLineItemValue('custpage_location', i + 1, '<img src=' + JSONData.flag + ' width=20 height=12 /> ' + JSONData.country_code + ': ' + JSONData.country_name + ', ' + JSONData.region + ', ' + JSONData.city + '\n &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ISP: ' + JSONData.asn.name + '\n &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Domain: ' + JSONData.asn.domain);
                            var personLoggedIn = '';
                            var city = 'X';
                            var region = 'X';
                            var organisation = 'X';
                            var country = 'X';

                            if (JSONData.region)
                                region = JSONData.region;

                            if (JSONData.city)
                                city = JSONData.city;

                            if (JSONData.asn.name)
                                organisation = JSONData.asn.name;

                            if (JSONData.country_name)
                                country = JSONData.country_name;

                            //Peter
                            if (organisation.indexOf('Converge') != -1) {
                                timeSublist.setLineItemValue('custpage_person', i + 1, 'Peter/Paolo/Brian/Sherwan are awesome!');
                            }
                            //Fritz
                            if (organisation.indexOf('SKYBroadband') != -1) {
                                timeSublist.setLineItemValue('custpage_person', i + 1, 'Fritz Lazo is awesome!');
                            }
                            //Johan
                            if (region.indexOf('Visayas') != -1 || city.indexOf('Talisay') != -1 || city.indexOf('Cebu') != -1) {
                                timeSublist.setLineItemValue('custpage_person', i + 1, 'Johan Quino is awesome!');
                            }
                            //Derick
                            if (country.indexOf('Philippines') != -1 && (city.indexOf('Talisay') == -1 && city.indexOf('Cebu') == -1) && organisation.indexOf('Globe') != -1) {
                                timeSublist.setLineItemValue('custpage_person', i + 1, 'Derick Ramos is awesome!');
                            }
                            //Derick 2
                            if (region.indexOf('Manila') != -1 && city.indexOf('Caloocan') != -1 && organisation.indexOf('Globe') != -1) {
                                timeSublist.setLineItemValue('custpage_person', i + 1, 'Derick Ramos is awesome!');
                            }
                            //Orion Correa
                            if (region.indexOf('Massachusetts') != -1 && organisation.indexOf('MCI') != -1) {
                                timeSublist.setLineItemValue('custpage_person', i + 1, 'Orion Correa (?)');
                            }
                            //TODO: Paolo De Leon
                            //
                            //
                            //Jon Correa
                            if (region.indexOf('Washington') != -1 && organisation.indexOf('Comcast') != -1) {
                                timeSublist.setLineItemValue('custpage_person', i + 1, 'Jon Correa (?)');
                            }
                            //Josh Green
                            if (region.indexOf('Oklahoma') != -1 && organisation.indexOf('AT&T') != -1) {
                                timeSublist.setLineItemValue('custpage_person', i + 1, 'Josh Green');
                            }
                            //Damon Brown
                            if (country == 'United States' && organisation.indexOf('Cox') != -1) {
                                timeSublist.setLineItemValue('custpage_person', i + 1, 'Damon Brown is ok too');
                            }
                            //Jeff Smith
                            if (country == 'United States' && region.indexOf('California') != -1 && city.indexOf('San Clemente') != -1 && organisation.indexOf('AT&T') != -1) {
                                timeSublist.setLineItemValue('custpage_person', i + 1, 'Jeff Smith is just ok');
                            }

                            //Sherwan
                            if (country == 'Vietnam') {
                                timeSublist.setLineItemValue('custpage_person', i + 1, "Master Cheng <img src='https://tstdrv1716438.app.netsuite.com/core/media/media.nl?id=80&c=TSTDRV1716438&h=65b1b1e2c72391cce255' width='20%' />");
                            }

                        }

                        if (columnName == 'custrecord_ctc_scriptdeployed' && columnData == 'F') {
                            nlapiLogExecution('DEBUG', 'Script not yet deployed: ' + columnName + columnData);
                            timeSublist.setLineItemValue('custpage_custrecord_ctc_login_status_loggedin', i + 1, "<span style='background-color:lightgray'>N/A</span>");
                        }

                    }
                }
                var dateToday = nlapiDateToString(new Date(), 'datetimetz');
                labelField.setDefaultValue('<b>There are a total of ' + loggedInCount + ' persons logged in as of ' + dateToday + '</b>');
            }
        }
        if (request.getParameter('custparam_pagetype') == 'login') {
            var emailAddress = request.getParameter('custparam_emailaddress');
            var emailAddressFinal = emailAddress.toLowerCase();

            var ipAddress = request.getHeader('ns-client-ip');


            var loginDate = nlapiDateToString(new Date(), 'datetimetz');
            nlapiLogExecution('DEBUG', 'Java Date: ' + new Date());
            nlapiLogExecution('DEBUG', 'NS Date: ' + loginDate);
            var recordId = 0;

            //get the recordId based on the email address
            recordId = getLoginRecordId(emailAddressFinal);

            if (recordId != 0) {
                //force logout any other records that have same ip address first
                try {
                    var col = [];
                    col[0] = new nlobjSearchColumn('internalid');

                    var filterArr = [];
                    filterArr.push(new nlobjSearchFilter('custrecord_ctc_login_status_ipaddress', null, 'is', ipAddress));

                    var searchresults = nlapiSearchRecord('customrecord_ctc_login_status_record', null, filterArr, col);

                    if (searchresults) {
                        for (var i = 0; i < searchresults.length; i++) {
                            var logRecordId = (searchresults[i].getValue('internalid'));
                            try {
                                var loginRecord3 = nlapiLoadRecord('customrecord_ctc_login_status_record', logRecordId);
                                loginRecord3.setFieldValue('custrecord_ctc_login_status_loggedin', 'F');
                                loginRecord3.setFieldValue('custrecord_ctc_login_status_ipaddress', '');
                                loginRecord3.setFieldValue('custrecord_ctc_login_status_logindate', '');
                                nlapiSubmitRecord(loginRecord3);
                            } catch (err) {
                                nlapiLogExecution('ERROR', 'Could not load the login record id: ' + logRecordId, err);
                            }
                        }
                    }
                } catch (err) {
                    nlapiLogExecution('ERROR', 'Couldnt set other records to logout', err);
                }

                try {
                    var loginRecord = nlapiLoadRecord('customrecord_ctc_login_status_record', recordId);
                    var loggedInState = loginRecord.getFieldValue('custrecord_ctc_login_status_loggedin');
                    var lastlogin = loginRecord.getFieldValue('custrecord_ctc_login_status_logindate');

                    if (loggedInState == 'F') {
                        lastlogin = loginDate;
                        loginRecord.setFieldValue('custrecord_ctc_login_status_loggedin', 'T');
                        loginRecord.setFieldValue('custrecord_ctc_login_status_ipaddress', ipAddress);
                        loginRecord.setFieldValue('custrecord_ctc_login_status_logindate', loginDate);
                        nlapiSubmitRecord(loginRecord);
                    }

                } catch (err) {
                    nlapiLogExecution('ERROR', 'Could not load the login record id: ' + recordId, err);
                }

                logmessage.setDefaultValue('Currently logged in with IP Address: ' + ipAddress + '<br />Last Logged in Date: ' + lastlogin);
                var usernamefield = form.addField('custpage_username', 'text', 'Username');
                usernamefield.setDefaultValue(emailAddressFinal);
                usernamefield.setDisplayType('hidden');
                form.addSubmitButton('Logout');
            }
        }
    }
    if (request.method === "POST") {
        var emailAddress2 = request.getParameter('custpage_username');
        var emailAddressFinal2 = emailAddress2.toLowerCase();

        var recordId2 = 0;

        //get the recordId based on the email address
        recordId2 = getLoginRecordId(emailAddressFinal2);

        if (recordId2 != 0) {
            try {
                var loginRecord2 = nlapiLoadRecord('customrecord_ctc_login_status_record', recordId2);
                loginRecord2.setFieldValue('custrecord_ctc_login_status_loggedin', 'F');
                loginRecord2.setFieldValue('custrecord_ctc_login_status_ipaddress', '');
                loginRecord2.setFieldValue('custrecord_ctc_login_status_logindate', '');
                nlapiSubmitRecord(loginRecord2);
                logmessage.setDefaultValue('Successfully logged out. Please logout of the NS account.');
            } catch (err) {
                nlapiLogExecution('ERROR', 'Could not load the login record id: ' + recordId2, err);
            }
        }
    }
    response.writePage(form);
}

function getLoginRecordId(username) {
    var returnSOId = 0;

    var colArr = [];
    colArr.push(new nlobjSearchColumn('internalid'));

    var filterArr = [];
    filterArr.push(new nlobjSearchFilter('name', null, 'is', username));

    var searchResultsSO = nlapiSearchRecord('customrecord_ctc_login_status_record', null, filterArr, colArr);

    if (searchResultsSO) {
        for (var i = 0; i < searchResultsSO.length; i++) {
            returnSOId = (searchResultsSO[i].getValue('internalid'));
        }
    }

    return returnSOId;
}

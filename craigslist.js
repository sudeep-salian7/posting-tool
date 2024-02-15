var photoUploadMessage = "Rental info filled. Upload photos manually is needed.";
const closeLink = '<div style="font-family:arial; font-size:14px; margin-top:20px;"><button id="pp_close_message" \
   >Close</button></div>';
chrome.storage.local.get(['record'], function(result) {
    // result.record = 'efd7dea9-375b-91b6-6e37-6136101c0808';
    if(result.record !== null){
        chrome.storage.local.set({reloadcount: 0}, function() {
            console.log('relaod is set to 0');
        });
        fetch(`https://crm.apartmentsource.com/custom/service/v4_1_custom/ListingRecord.php?listID=${result.record}`).then(r => r.text()).then(result => {
            console.log(JSON.parse(result));
            let data = JSON.parse(result);
            if(window.location.host == 'chicago.craigslist.org'){
                document.getElementById('post').click();
            }            
            if(window.location.host == 'post.craigslist.org'){
                
                const urlParams = new URLSearchParams(window.location.search);
                const page = urlParams.get('s');
                console.log(page);
                if(page == 'area'){
                    document.querySelector("select[value='11']").click();
                    document.querySelector("button[value='Continue']").click();
                }
                if(page == 'subarea'){
                    switch(data.listDetails.craigslistarea_c){
                        case  'cityofchicago':
                            document.querySelector("input[value='1']").click();
                            break;
                        case 'northchicagoland' :
                            document.querySelector("input[value='2']").click();
                            break;
                        case  'westchicagoland':
                            document.querySelector("input[value='3']").click();
                            break;
                        case 'southchicagoland' :
                            document.querySelector("input[value='4']").click();
                            break;
                        case  'northwestindiana':
                            document.querySelector("input[value='5']").click();
                            break;
                        case 'northwestsuburbs' :
                            document.querySelector("input[value='6']").click();
                            break;

                    }
                    document.querySelector("button[value='Continue']").click();
                }
        
                if(page == 'type'){
                    console.log('page is type')
                    document.querySelector("input[value='ho']").click();
                    document.querySelector("button[value='Continue']").click();
                }
        
                if(page == 'hcat'){
                    document.querySelector("input[value='1']").click();
                    document.querySelector("button[value='Continue']").click();
                }
        
                if(page == 'edit'){
                    document.querySelector("input[name='PostingTitle']").value = data.listDetails.name;
                    document.querySelector("input[name='geographic_area']").value = data.listDetails.city_c;
                    document.querySelector("input[name='postal']").value = data.listDetails.zip_c;
                    document.querySelector("textarea[name='PostingBody']").value = data.listDetails.propertyinfo_c;
                    document.querySelector("input[name='price']").value = data.listDetails.rent_c;
                    document.querySelector("input[name='surface_area']").value = data.listDetails.sqft_c;

                    // laundry 
                    let laundry = parseData(data.listDetails.laundry_c, 'laundry');                    
                    if (laundry) {
                        document.querySelector(".laundry .ui-selectmenu-button").click();                    
                        let laundryElement = document.querySelector(laundry);
                        laundryElement.addEventListener('mouseover', function() {
                            console.log('Laundry Event triggered');
                        });

                        let laundryEvent = new MouseEvent('mouseover', {
                            'view': window,
                            'bubbles': true,
                            'cancelable': true
                        });
                        laundryElement.dispatchEvent(laundryEvent);                    
                        document.querySelector(laundry).click();
                    }                    

                    // parking
                    let parking = parseData(data.listDetails.parking_c, 'parking');
                    if (parking) {
                        document.querySelector(".parking .ui-selectmenu-button").click();                    
                        let parkingElement = document.querySelector(parking);
                        parkingElement.addEventListener('mouseover', function() {
                            console.log('Parking Event triggered');
                        });

                        let parkingEvent = new MouseEvent('mouseover', {
                            'view': window,
                            'bubbles': true,
                            'cancelable': true
                        });
                        parkingElement.dispatchEvent(parkingEvent);                    
                        document.querySelector(parking).click();
                    }                    

                    // beds 
                    let beds = parseData(data.listDetails.beds_c, 'beds_c');
                    // console.log(beds,'line 55');
                    if (beds) {
                        document.querySelector(".bedrooms .ui-selectmenu-button").click();
                        let element = document.querySelector(beds);
                        element.addEventListener('mouseover', function() {
                            console.log('Bedroom Event triggered');
                        });

                        let event = new MouseEvent('mouseover', {
                            'view': window,
                            'bubbles': true,
                            'cancelable': true
                        });

                        element.dispatchEvent(event);
                        document.querySelector(beds).click();
                    }
                    // bathrooms
                    let bathrooms = parseData(data.listDetails.baths_c, 'baths_c');
                    if (bathrooms) {
                        document.querySelector(".bathrooms .ui-selectmenu-button").click();                    
                        let bathroomElement = document.querySelector(bathrooms);
                        bathroomElement.addEventListener('mouseover', function() {
                            console.log('Parking Event triggered');
                        });

                        let bathroomEvent = new MouseEvent('mouseover', {
                            'view': window,
                            'bubbles': true,
                            'cancelable': true
                        });
                        bathroomElement.dispatchEvent(bathroomEvent);                    
                        document.querySelector(bathrooms).click();
                    }       
                    
                    // rent period
                    let rent_period = parseData(data.listDetails.rent_period_c, 'rent_period_c');
                    if(rent_period){
                        document.querySelector(".rent_period .ui-selectmenu-button").click();
                        console.log("rent_period_c");

                        let rent_period_Element = document.querySelector(rent_period);
                        rent_period_Element.addEventListener('mouseover', function() {
                            console.log('rent_period Event triggered');
                        });

                        let rent_period_Event = new MouseEvent('mouseover', {
                            'view': window,
                            'bubbles': true,
                            'cancelable': true
                        });
                        rent_period_Element.dispatchEvent(rent_period_Event);                    
                        document.querySelector(rent_period).click();
                    }

                    // Cats
                    if (
                        data.listDetails.catpolicy_c.toLowerCase() == "catsallowed" || 
                        data.listDetails.catpolicy_c.toLowerCase() == 'negotiable'
                        ) 
                    {
                        $("input[name='pets_cat']").click();   
                    } 
                    // Dogs
                    if (
                        data.listDetails.dogpolicy_c.toLowerCase() == 'dogsallowed' || 
                        data.listDetails.dogpolicy_c.toLowerCase() == 'smalldogsonly' ||
                        data.listDetails.dogpolicy_c.toLowerCase() == 'negotiable'
                        ) 
                    {
                        $("input[name='pets_dog']").click();   
                    }


                    // Available On
                    if (data.listDetails.availdate_c) {
                        formattedDate = formatDate(data.listDetails.availdate_c);
                        console.log("line 139",formattedDate);
                        $("input[data-date-input-name='movein_date']").val(formattedDate);
                    }                    
                    if (data.listDetails.application_fee_c && data.listDetails.application_fee_c != '') {
                        $("input[name='application_fee']").click();   
                        $("input[name='application_fee_explained']").val(data.listDetails.application_fee_c);
                    }       

                    // Email
                    $("input[name='FromEMail']").val(data.listDetails.useremail_c);
                    

                    // Phone Number
                    // $("input[name='show_phone_ok']").click();   
                    // $("input[name='contact_phone']").val('4703105856');

                            
                    $("button[value='continue']").click();                       

                    /*chrome.storage.local.set({record: null}, function() {
                        console.log('Value is set to empty');
                    });*/
                }

                if (page == 'geoverify') {
                    document.querySelector("input[name='xstreet0']").value = data.listDetails.street_c+' '+data.listDetails.streetname_c + ' ' + data.listDetails.unit_c;
                    document.querySelector("input[name='xstreet1']").value = '';
                    document.querySelector("input[name='city']").value = data.listDetails.city_c;
                    document.querySelector('#leafletForm > button.continue').click();
                }

                if (page == 'editimage') {
                    // Image upload 
                    // chrome.storage.local.set({record: null}, function() {
                    //     console.log('Value is set to empty');
                    // });
                    // Auto Image upload
                    var photos = data.images;
                    var postPhotoCount = photos.length > 24 ? 24 : photos.length;
                    console.log(postPhotoCount);

                    var currentCount = 0;
                    $("img").each(function() {
                        console.log($(this).attr("src"));
                        if ($(this).attr("src").indexOf("post.craigslist.org/imagepreview") != -1) 
                            currentCount++;	    		
                    });
                                    
                    if (postPhotoCount == 0 || currentCount >= postPhotoCount) {
                        $("[value='Done with Images']").click();
                    }
                    else {
                        show2("Uploading pictures, please wait...");

                        var xhr = new XMLHttpRequest();
                        console.log('photos[currentCount]')
                        console.log(photos[currentCount]);
                        xhr.open('GET', photos[currentCount], true);
                        xhr.responseType = 'arraybuffer';

                        xhr.onload = function(e) {
                            var dataView = new DataView(this.response);
                            var bb = new Blob([dataView], { type: 'image/jpeg' });

                            var formData = new FormData();
                            formData.append("name", Math.floor((Math.random() * 100) + 1) + ".jpg");
                            formData.append("ajax", 1);
                            formData.append('file', bb);
                            formData.append('cryptedStepCheck', $("[name='cryptedStepCheck']").val())
                            formData.append("a","add");

                            var xhr = new XMLHttpRequest();
                            xhr.open('POST', $("form").eq(0).attr("action"), true);
                            xhr.onload = function(e) { 
                                var count = 0;
                                if (this.responseText != null) {
                                var imagePreviewItems = this.responseText.match(/imagepreview/g);
                                if (imagePreviewItems != null)
                                    count = imagePreviewItems.length;
                                }

                                if (count > 0)
                                location.reload(); 
                                else {
                                showError("Uploading photo failed!");
                                setTimeout("location.reload()", 20 * 1000);
                                }
                            };

                            xhr.send(formData);  // multipart/form-data
                        };

                        xhr.send();
                    }

                }
                if (page == 'preview') {
                    chrome.storage.local.set({record: null}, function() {
                        console.log('Value is set to empty');
                    });
                    let submit = document.getElementsByName("go")[0];
                    submit.onclick = function(){
                        console.log('api called 286');
                        fetch(`https://crm.apartmentsource.com/custom/service/v4_1_custom/postingPosted.php?postingId=${data.listDetails.id}`)
                        .then(response => {
                            if (!response.ok) {                            
                                throw new Error('API request failed');
                            }
                        });
                                               
                    };
            
                    // $("form#publish_bottom > button").click();
                }
            }

        });
        
    }else if(window.location.host == 'post.craigslist.org'){
        let urlParamst = new URLSearchParams(window.location.search);
        let paget = urlParamst.get('s');
        if(paget == 'subarea'){
            chrome.storage.local.get(['reloadcount'], function(results) {
                console.log('Value relaod count currently is ' + results.reloadcount);
                // alert("reload count::"+results.reloadcount);
                if(results.reloadcount == undefined || results.reloadcount == 0){
                    chrome.storage.local.set({reloadcount: 1}, function() {
                        console.log('relaod is set to 1');
                    });
                    show2("Posting, please wait...");
                    setTimeout(() => { location.reload(); }, 4000);
                    
                }
            });
        }        
    }
    
});

function parseData(data, field) {
    let result;
    if (field == 'beds_c') {
        switch (data) {
            case '0':
                result = '#ui-id-25';
                break;
            case 'Convertible':
            case '1':
                result = '#ui-id-26';
                break;
            case '1.5':
            case '2':
                result = '#ui-id-27';
                break;
            case '2.5':
            case '3':
                result = '#ui-id-28';
                break;
            case '3.5':
            case '4':
                result = '#ui-id-29';
                break;
            case '4.5':
            case '5':
                result = '#ui-id-30';
                break;
            case '6':
                result = '#ui-id-31';
                break;
            case '7':
                result = '#ui-id-32';
                break;
            case '8':
                result = '#ui-id-33';
                break;
            default:
                result = '#ui-id-24';
                break;
        }
    }else if (field == 'laundry') {
        switch (data) {
            case 'w/d in unit':
            case 'Washer_Dryer_in_Unit':
                result = '#ui-id-11';
                break;
            case "Laundry_in_Building":
                result = '#ui-id-13';
                break;
            case 'Laundry_on_Site':
            case 'Laundry_Services':
                result = '#ui-id-14';
                break;
            case 'Washer_Dryer_Hookups':
                result = '#ui-id-12';
                break;
            case 'None':
                result = '#ui-id-15';
                break;
            default:
                result = '#ui-id-10';
                break;
        }
    }else if (field == 'parking') {
        switch (data) {
            case 'available':
                result = '#ui-id-22';
                break;
            case 'included':
                result = '#ui-id-18';
                break;
            case 'garage':
                result = '#ui-id-19';
                break;
            case 'street':
                result = '#ui-id-21';
                break;
            default:
                result = '#ui-id-18';
                break;
        }
    }else if (field == 'baths_c') {
        if (parseInt(data) > 9) {
            data = 10;
        }
        switch (data) {
            case '1':
                result = '#ui-id-37';
                break;
            case 'shared':
                result = '#ui-id-35';
                break;
            case 'split':
                result = '#ui-id-36';
                break;
            case '1.5':
                result = '#ui-id-38';
                break;
            case '2':
                result = '#ui-id-39';
                break;
            case '2.5':
                result = '#ui-id-40';
                break;
            case '3':
                result = '#ui-id-41';
                break;
            case '3.5':
                result = '#ui-id-42';
                break;
            case '4':
                result = '#ui-id-43';
                break;
            case '4.5':
                result = '#ui-id-44';
                break;
            case '5':
                result = '#ui-id-45';
                break;
            case '5.5':
                result = '#ui-id-46';
                break;
            case '6':
                result = '#ui-id-47';
                break;
            case '7':
                result = '#ui-id-49';
                break;
            case '8':
                result = '#ui-id-51';
                break;
            case '9':
            case '10':
            case '11':
            case '12':
            case '13':
            case '14':
            case '15':
            case '16':
                result = '#ui-id-53';
                break;
            // case '10':
            //     result = '#ui-id-54';
            //     break;
            default:
                result = '#ui-id-34';
                break;
        }
    }

    else if(field == 'rent_period_c'){
        switch (data) {
            case 'daily':
                result = '#ui-id-55';
                break;
            case 'weekly':
                result = '#ui-id-56';
                break;
            case 'monthly':
                result = '#ui-id-57';
                break;
            default:
                result = '#ui-id-54';
                break;
        }
    }
    return result;
}
function formatDate(date){
    let formattedDate = '';
    let day = '';
    if (date) {
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

        let dt = new Date(date);
        let Year = dt.getFullYear();
        let mMonth = dt.getMonth();
        let nDate = dt.getDate();
        let nDay = dt.getDay();

        formattedDate = days[nDay]+', '+nDate+' '+months[mMonth]+' '+Year;
        // console.log('FormattedDate:',formattedDate);
        return formattedDate;

    }
}

$("body").append('<div id="tasDialogContainer" style="display:none;position: fixed;top: 0;left: 0;z-index:999;filter:alpha(opacity=70); opacity:0.7;background-color:#333333; color:white;"><div id ="tasDialogContent" style="background-color:black;position: fixed;top: 250px; width:600px;padding:20px;text-align:center;"></div></div>');

function show2(msg,callback=null){
    console.log('show2')
    showMessage('<div id ="close"><h2 style="color:white;">'+msg+'</h2> \
       <h5>' + closeLink + '</h5></div>');
    
    var close = () => {
       hideCloseMessage();
 
       if (callback)
          callback();
    };   
 
    $("#close").click(close);
    $("#pp_close_link").click(close);
 }

 function showMessage(msg)
{
   $( "#tasDialogContainer").css("display", "block");
   $( "#tasDialogContainer").width($(window).width());
   $( "#tasDialogContainer").height($(document).height());
   $("#tasDialogContent").css({left: String(Math.ceil(($(window).width() - 600) / 2)) + "px"});
   $( "#tasDialogContent").html(msg);
}

function hideCloseMessage()
{
   $("#tasDialogContainer").css("display", "none");
}

function showError(l1){
    showMessage('<div id ="close"><h3> Sorry, an error has occurred. Please report the following error message to support@pennyposting.ch:</h3> \
       <div style="background-color:white; padding:10px; font-size:12px; color:black; text-align:left; max-height:100px; overflow:auto;">' + l1 + '</div>\
             <h3><a id="pp_hideError_link" style="color:#99DDFF;" href="javascript:void(0);">Hide this message</a></h3></div>');
 
 $("#pp_hideError_link").click(hideMessage);
}

function hideMessage()
{
	$( "#tasDialogContainer").css("display", "none");
}


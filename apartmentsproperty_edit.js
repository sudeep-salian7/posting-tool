var photoUploadMessage = "Rental info filled. Upload photos manually is needed.";
var apt_step = null;
var uploadedPhotos = [];
var isPhotoUploadComplete = false;
var adids = [];
var isComplete = false;

function apt_fillForm() {

   show3("Posting, please don't interrupt or navigate away...");

	console.log("line 8",allData);
	let rent = allData.rent_c.replace(".00", "")
	let sqft = allData.sqft_c;
	let is_broker = true;
	let deposit = 0;
   if (allData.firstmonth_c == 'yes') {
      deposit = allData.security_deposit_c;
   }else if (allData.lastmonth_c == 'yes') {
      deposit = parseInt(allData.security_deposit_c) * 2;
   }
   let description = allData.unitdescription_c;
	setTimeout(() => {
	   enterReactField($('#cpid2-rent0')[0], rent);
	   // $('#cpid2-rent0').focus();
	}, 1000);


	setTimeout(() => {
	   enterReactField($('#cpid2-sqft0')[0], sqft);
	   // $('#cpid2-sqft0').focus();
	}, 1000);		

   if (is_broker)
      $("#radioAgentBroker").click();
   else
      $("#radioPropertyManager").click();

	setTimeout(() => {
	   enterAptField($('#cpid2-deposit0')[0], deposit);
	   // $('#cpid2-deposit0').focus();
	}, 1000);	

   if (allData.userfirstname_c) {
      enterAptField($('#cpid1-firstName')[0], allData.userfirstname_c);
   }
   
   if (allData.userlastname_c) {
      enterAptField($('#cpid1-lastName')[0], allData.userlastname_c);
   }
   if (allData.useremail_c) {
      enterAptField($('#cpid1-email')[0], allData.useremail_c);
   }

   if (allData.usercontact_c) {
      enterAptField($('#cpid1-phone')[0], allData.usercontact_c);
   }   
   setTimeout(() => {
      enterAptField($('textarea')[0], description);
   }, 1000);
/*
   console.log("Utilities", arge.edit.rent_includes);
   if (arge.edit.rent_includes && arge.edit.rent_includes.length) {
      var rentIncludes = arge.edit.rent_includes.map(r => {
         return r.toUpperCase();
      })
      $("label").each((idx, lb) => {
         if ($(lb).attr("for") && $(lb).attr("for").indexOf("utility") > -1) {
            var utility = $(lb).html().trim().toUpperCase();
            apt_toggleCheckbox($(lb).attr("for"), rentIncludes.indexOf(utility) > -1);
         }
      });
   }

   console.log("Features", arge.edit.features);
   if (arge.edit.features && arge.edit.features.length) {
      var features = arge.edit.features.map(f => {
         if (f == "A/C")
            f = "AC";
         return f.toUpperCase();
      });
      $("label").each((idx, lb) => {
         if ($(lb).attr("for") && $(lb).attr("for").indexOf("amenity") > -1) {
            var amenity = $(lb).html().trim().toUpperCase();
            apt_toggleCheckbox($(lb).attr("for"), features.indexOf(amenity) > -1);
         }
      });
   }
	*/
   $("mat-datepicker-toggle").find("button").click();
   setTimeout(() => {
      apt_loadCalendar();    
   }, 1000);   
}

function apt_fill_laundry() {
   let laundry = allData.laundry_c;
   if (allData) {
      if (laundry.length > 0) {
         $("mat-select#laundryType").click();
         setTimeout(() => {
            switch(laundry) {
               case "Washer_Dryer_in_Unit":
                  $("mat-pseudo-checkbox")[0].parentNode.click();
                  break;
               case "Laundry_on_Site":
               case "Laundry_in_Building":
                  $("mat-pseudo-checkbox")[2].parentNode.click();
                  break;
               case "Washer_Dryer_Hookups":
                  $("mat-pseudo-checkbox")[1].parentNode.click();
                  break;
               default:
                  break;
            }
                     
            setTimeout(() => {
               $(".cdk-overlay-backdrop").click()
               apt_fill_parking();
            }, 1000);
         }, 1000);
      } else {
         apt_fill_parking();
      }
   }   
}

function apt_loadCalendar() {
   var date = null;
   var availDate = formatDate(allData.availdate_c);
   console.log("line 126",availDate);
   // var availDate = '10/20/2021';
   if (availDate.length > 0) {
      date = availDate;
   } else {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      date = mm + '/' + dd + '/' + yyyy;
   }
      
   var isFound = false;
   $(".mat-calendar-body-cell").each((idx, cell) => {
      var cellDate = new Date($(cell).attr("aria-label"));
      var dd = String(cellDate.getDate()).padStart(2, '0');
      var mm = String(cellDate.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = cellDate.getFullYear();
      cellDate = mm + '/' + dd + '/' + yyyy;
      if (date == cellDate) {
         isFound = true;
         $(cell).click();
      }
   });

   if (!isFound && $(".mat-calendar-next-button").length) {
      $(".mat-calendar-next-button").click();
      setTimeout(() => {
         apt_loadCalendar();
      }, 500);
   } else {
      setTimeout(apt_fill_contactPreference, 1000);
   }
}

function apt_fill_contactPreference() {
   $("mat-select#cpid1-contactPreference").click();
   /*chrome.storage.local.set({record: null}, function() {
       console.log('Value is set to empty');
   });*/
   setTimeout(() => {
      $("mat-option")[0].click();
      setTimeout(apt_fill_pet, 1000);
   }, 500);
}

function apt_fill_pet() {
	console.log("line 174 apt_fill_pet",allData);
   var cats = false;
   var dogs = false;
   if (allData) {

   }
   if (allData) {
         if (allData.catpolicy_c.toLowerCase() == "catsallowed" || allData.catpolicy_c.toLowerCase() == "negotiable" ) {
            console.log('line 178 cat allowed');
            cats = true;      
         }
         if (allData.dogpolicy_c.toLowerCase() == "dogsallowed" || allData.dogpolicy_c.toLowerCase() == "smalldogsonly" ) {
            console.log('line 182 dogs allowed');
            dogs = true;      
         }
   }   
   $("mat-select#petsAllowed").click();
   setTimeout(() => {
      if (!cats && !dogs)
         $("mat-option")[3].click();
      else if (cats && dogs)
         $("mat-option")[2].click();
      else if (dogs)
         $("mat-option")[1].click();
      else if (cats)
         $("mat-option")[0].click();
      
      setTimeout(() => {
         apt_fill_laundry();
      }, 1000);
   }, 500);
   apt_fill_laundry();
}

function apt_fill_parking() {
   let parking = allData.parking_c;
   if (parking) {
      $("mat-select#cpid3-parkingType").click();
      setTimeout(() => {
         switch(parking) {
            /*case "4":
               $("mat-option")[0].click();
               break;
            case "3":
               $("mat-option")[1].click();*/
            case "street":
               $("mat-option")[2].click();
               break;
            case "garage":
               $("mat-option")[3].click();
               break;
            default:
               if (parking && parking.length > 0)
                  $("mat-option")[4].click();
               break;
         }

         setTimeout(() => {
            if (allData.parking_rent && allData.parking_rent.length) {
               enterAptField($('#parkingFee')[0], allData.parking_rent);
            } else {
               enterAptField($('#parkingFee')[0], "");
            }

            success3(photoUploadMessage);
            $("app-media-gallery")[0].scrollIntoView();
         }, 1000);
      }, 500);
   } else {
      success3(photoUploadMessage);
      $("app-media-gallery")[0].scrollIntoView();
   }
}

function apt_showPhotos() {
   if ($("#pp_photos").length === 0 && arge.edit.photos && arge.edit.photos.length && $('app-media-gallery').length) {
      var zipUrl = yglDomain() + "/photos/zip/" + arge.encryptid + "/";
      var photoIds = [];
      var photos = arge.edit.photos;
      var postPhotoCount = photos.length > 50 ? 50 : photos.length;
      for(var i = 0; i < postPhotoCount; i++) {
         photoIds.push(photos[i]["id"]);
      }
      zipUrl += photoIds.join(",");

      var photoParts = "";
      for(var i = 0; i < postPhotoCount; i++) {
         var photo = photos[i];
         photoParts += "<div style='padding-bottom:20px; width:200px; float:left;'><img src='" + photo["url"] + "' title='' style='max-width:80%;' /><br/><a href='" + photo["download_url"] + "' target='_blank'>Download</a></div>";
      }

      $("<div id='pp_photos' style='position:relative; width:100%; \
         border:solid 1px #BCE8F1; text-shadow:0 1px 0 rgba(255, 255, 255, 0.5); \
         background-color:#D9EDF7; padding:10px; -webkit-border-radius:4px; \
         border-radius:4px; opacity:0.95; z-index: 500;'><div style='font-weight:bold; \
         padding-bottom:10px; text-align:center;'>Upload Photos Manually</div>\
         <div style='font-style:italic; margin-bottom:10px;'><b>Tip:</b> Downloaded photos can be dragged directly into the photo upload box.</div>\
         <div><a href='" + zipUrl + "' target='_blank'>Download All Photos as Zip</a></div>\
         <div id='pp_adqueue' style='font-size:12px; margin-top:20px;'>" + photoParts + "</div><div style='clear: both;'></div></div>").insertAfter('app-media-gallery');  
   }
}

function skipApartmentsAd()
{
   console.log("Skipping ad", arge.trace.id);

   adids = adids.filter(adid => {
      return parseInt(adid) !== parseInt(arge.trace.id);
   });

   write_option({adids}, () => {
      $("button.primary").each((idx, btn) => {
            if ($(btn).html().indexOf("Okay") !== -1)
               $(btn).click();
      })

      if (adids.length > 0) {
            var adUrl = "https://manage.yougotlistings.com/ads/template/" + adids[0] + "?apartmentspost=Y";
            console.log("Redirecting to " + adUrl);
            window.location.href = adUrl;
      } else {
            finishBulkPosting();
      }
   }); 
}

function showApartmentsCompleteMessage() {
   if (isComplete)
      return;

   console.log('showApartmentsCompleteMessage');
   hideMessage();
   isComplete = true;
   var msg = "";
   if ($(".termsWrapper").length) {
      msg = "Listing info entered! Please check off the Terms and publish.";
      $(".termsWrapper")[0].scrollIntoView();
   } else {
      msg = "Listing info entered! Ad ready to save or publish.";
   }
   console.log("PP", msg);
   flickertitle("PP: Posting Ready");

   $("#headerSave").click(() => {
      write_option_tab({apt_rencent_id: aptId});
   });
   $("#headerSubmit").click(() => {
      write_option_tab({apt_rencent_id: aptId});
   });
}

/*function initApartmentsPropertyEdit() {   	
	recordZillowListingTimer = setInterval(() => {
	   setTimeout(apt_fillForm, 1000);
	}, 1000); 
}*/
function initApartmentsPropertyEdit() {
   apt_step = "PageLoad";
   console.log("PP Loaded: initApartmentsPropertyEdit");
   aptId = parseApartmentsIdFromUrl(window.location.href);

   /*if (aptId && aptId.length > 0) {
      console.log('recordApartmentsAd', aptId);
      recordApartmentsAd(arge.trace.user, arge.trace.id, aptId, 0);
   }*/

   // if (postingtype == "P") {
      recordZillowListingTimer = setInterval(() => {
         if (apt_step)
            console.log("apt_step", apt_step);

         if (apt_step == "PageLoad") {
            console.log("PP awaiting page load");
            if ($("mat-select#cpid2-beds0").length) {
               apt_step = "FillForm";
            }
         }
         else if (apt_step == "FillForm") {
            apt_step = null;
            // show2("Please note that photos need to be uploaded manually.");
            // setTimeout(apt_fillForm, 1000);
            show2("Please note that photos need to be uploaded manually.", apt_fillForm);
         }
      }, 1000);
   // }
}
function parseApartmentsIdFromUrl(url) {
    // https://www.apartments.com/add-edit-listing/?ListingKey=7WxaOIF%2BQ6r37D5jSn7%2FGw%3D%3D&o=props&returnUrl=%2Fcustomers%2Fmy-properties%2Ffind%3Fpage%3D2%26items%3D12
    var id = null;
    var str = "ListingKey=";
    var idx = url.indexOf(str);
    if (idx !== -1) {
        var urlParts = url.split(str);
        urlParts = urlParts[1].split("&");
        id = urlParts[0];
        id = decodeURIComponent(id.replace(/\+/g, ' '));
    }
    console.log("parseApartmentsIdFromUrl", id);
    return id;
}
function enterReactField(input, value) {
    // console.log('enterReactField', typeof input, value);
    if (typeof input !== 'undefined' ) {
    	var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    	nativeInputValueSetter.call(input, value);

    	var ev2 = new Event('input', { bubbles: true});
    	input.dispatchEvent(ev2);
    	ev2 = new Event('blur', { bubbles: true});
    	input.dispatchEvent(ev2);
    }    
}
function enterAptField(input, value) {
   // console.log("enterAptField", input, value);
   if (typeof input !== 'undefined' ) {
   		if (!value)
   		   return;

   		value = String(value);
   		$(input).val(value);
   		var code = String(value)[value.length-1].charCodeAt(0);
   		input.dispatchEvent(new KeyboardEvent('keyup',{altKey: false,
   		   bubbles: true,
   		   cancelBubble: false,
   		   cancelable: true,
   		   charCode: code,
   		   composed: true,
   		   ctrlKey: false,
   		   defaultPrevented: false,
   		   detail: 0,
   		   eventPhase: 2,
   		   isComposing: false,
   		   isTrusted: true,
   		   keyCode: code,
   		   location: 0,
   		   metaKey: false,
   		   repeat: false,
   		   returnValue: true,
   		   shiftKey: false,
   		   type: "keyup",
   		   which: code}));
   }   
}
initApartmentsPropertyEdit();
function  recordApartmentsAd(a,b,c,d){
   var trail = "recordApartmentsAd a: " + a + " b: " + b + " c: " + c + " d: " + d;
   console.log(trail);

   makeRequest(URL + "action2/", xmlrpc.writeCall("recordApartmentsAd", [a,b,c,d]));
}
function makeRequest(server, body, callback) {
    chrome.runtime.sendMessage({server, body},
        ret => {
            if (callback) {
                callback(ret);
            } else {
                if (typeof ret === "string") {
                    console.log("ret: " + ret);
                    
                    try {
                        eval(jQuery.parseJSON(ret).action);
                    }
                    catch(err) {
                        showError("Error name: " + err.name + ". <br/>Error message: " + err.message
                            + "<br/>call: " + server + ", " + body
                            + "<br/>ret: " + ret);
                    }
                }
                else {
                    Object.keys(ret).forEach(k => {
                        console.log(k + ': ' + ret[k]);
                    })
                    return;
                }                              
            }
        }
    );
}
function formatDate(dt){
   var today = new Date(dt);
   var dd = String(today.getDate()).padStart(2, '0');
   var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
   var yyyy = today.getFullYear();

   formattedDt = mm + '/' + dd + '/' + yyyy;
   return formattedDt;
}
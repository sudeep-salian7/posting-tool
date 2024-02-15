var photoUploadMessage = "Rental info filled. Upload photos manually is needed.";
// var fb_formFilledMessage = "Rental info filled. Ready to publish!";
var arge = null;
var formTimer = null;
var addressTimer = null;
var existingFacebookIds = null;
var isNew = true;
var awaitType = null;
var allData=null;

chrome.storage.local.get(['record'], function(result) {
    // result.record = 'efd7dea9-375b-91b6-6e37-6136101c0808';
    console.log('Value currently is ' + result.record);
    if(result.record !== null){
        fetch(`https://crm.apartmentsource.com/custom/service/v4_1_custom/ListingRecord.php?listID=${result.record}`).then(r => r.text()).then(result => {
            console.log(JSON.parse(result));
            let data = JSON.parse(result);
            allData=data.listDetails;
            console.log('allData ' ,allData);

            if (isInitFacebook()) {
                initFacebook();
             }
             
             function isInitFacebook() {
                const url = document.location.href;
                return url.indexOf("https://www.facebook.com/marketplace/") > -1;
             }

             function fillFacebookForm() {
                console.log('fillFacebookForm 1')
                show1("Posting, please wait...");
                let heat_source = "Electricity";
                var t = 2000;
                setTimeout(fillFacebookFormRentalType, t);
                t += 2000;
                setTimeout(fillFacebookFormBedBathPrice, t);
                t += 1000;
                setTimeout(fillFacebookFormDescription, t);
                t += 1000;
                setTimeout(fillFacebookSqft, t);
                t += 1000;
                setTimeout(fillFacebookPet, t);
                t += 1000;
                setTimeout(fillFacebookFormAvailableDate, t);
                console.log('allData ' , allData);
                if (allData.laundry_c && allData.laundry_c.length > 0) {
                   t += 1000;
                   setTimeout(fillFacebookFormLaundry, t);
                   t += 1000;
                }
                if (allData.parking_c && allData.parking_c.length > 0) {
                   t += 1000;
                   setTimeout(fillFacebookFormParking, t);
                   t += 1000;
                }
                if (heat_source && heat_source.length > 0) {
                   t += 1000;
                   setTimeout(fillFacebookFormHeatSource, t);
                   t += 1000;
                }
                if (isNew) {
                   t += 1000;
                   setTimeout(fillFacebookFormAddress, t);
                } else {
                   /*t += 1000;
                   setTimeout(() => {
                      show2(photoUploadMessage, "", () => {
                         showFacebookPhotos();
                      });
                   }, t);*/
                }
             
                awaitType = "wireButton";
             }

             function fb_await() {
                if (awaitType == "recordAd") {
                   console.log("Await recording ad...");
                   if (!fb_isRentalForm()) {
                      completeFacebookAd();
                      awaitType = null;
                   }
                } else if (awaitType == "wireButton") {
                   var publishBtn = null;
                   if ($('[aria-label="Publish"]').length) {
                      publishBtn = $('[aria-label="Publish"]')[0];
                   } else if ($('[aria-label="Update"]').length) {
                      publishBtn = $('[aria-label="Update"]')[0];
                   }
             
                   if (publishBtn) {
                      var pp = $(publishBtn).attr("pennyposting");
                      if (!pp || pp !== "Y") {
                         console.log("wire publish button", publishBtn);
                         $(publishBtn).attr("pennyposting", "Y");
                         $(publishBtn).click(() => {
                            if (isNew)
                               awaitType = "recordAd";
                            else
                               awaitType = null;
                         });
                      } else {
                         console.log("Await clicking publish button...", pp);
                      }
                   }
                }
               //  else if (awaitType == "openPostingForm") {
               //     console.log("Await posting form opening...");
               //     openFacebookPostingForm();
               //  } 
                else if (awaitType == "awaitingFormOpen") {
                   console.log("Await form opening...");
                   awaitingFormOpen();
                } else if (awaitType == "awaitingRentalType") {
                   console.log("Await rental type...");
                   awaitingRentalType();
                } 
               //  else if (awaitType = "awaitingForRentalSelections") {
               //     console.log("line 103",awaitType)
               //     console.log($('[role="menuitemradio"]'));
               //     $('[role="menuitemradio"]').each((idx, role) => {
               //        console.log('entered')
               //        console.log($(role).html().indexOf("Rent") > -1);
               //        if ($(role).html().indexOf("Rent") > -1) {
               //           console.log("clicking for rent", role);
               //           awaitType = "awaitingRentalType";
               //           $(role).click();
               //        }
               //     });  
               //  }

               else if (awaitType == "awaitingForRentalSelections") {
                  console.log("line 134",awaitType)
                  console.log($('[role="option"]'));
                  $('[role="option"]').each((idx, role) => {
                     console.log('entered')
                     console.log("role", role);
                     if ($(role).html().indexOf("Rent") > -1) {
                        console.log("clicking for rent", role);
                        awaitType = "awaitingRentalType";
                        $(role).click();
                     }
                  });  
               }
             }

             function removeFacebookPhotosSection() {
                console.log("photos sections", $("#pp_photos").length);
                if ($("#pp_photos").length) {
                   $("#pp_photos").each((idx, p) => {
                      p.remove();
                   });
                }
             }

             function completeFacebookAd(rentalId) {
                console.log("posting completed", rentalId);
                write_option({postingtype: ""}, () => {
                   write_option_tab({postingtype: "", adinfo: null}, () => {
                      flickertitle("PP: Posting finished.");
                      show2("<span style='font-size:28px; color:green;'>Posting complete.</span>");
                      removeFacebookPhotosSection();
                   });
                });
             }

             function fillFacebookFormAvailableDate() {   
                $("span").each((idx, ele) => {
                   if ($(ele).html().indexOf("Date available") > -1) {
                     // let availOnDisplay = "Oct 19, 2021";
                     let availOnDisplay = allData.availdate_c;
                      console.log('Date available', $(ele).next().find("input"));
                      if ($(ele).next().find("input").length && availOnDisplay && String(availOnDisplay).length > 0) {
                         enterReactField($(ele).next().find("input")[0], availOnDisplay);
                      }
                   } 
                });
             }
             
             function fillFacebookFormForRent() {
                console.log("fillFacebookFormForRent");
                console.log($('[aria-label="Home for Sale or Rent"]').length)
                console.log($('[aria-label="Home for Sale or Rent"]'));
                if ($('[aria-label="Home for Sale or Rent"]').length) {
                   const ele = $('[aria-label="Home for Sale or Rent"]')[0];
                   console.log('rental sale or rent', ele);
                   $(ele).click();
                   awaitType = "awaitingForRentalSelections";
                   return awaitType;
                } 
             }
             
             function fillFacebookFormRentalType() {
                if ($('[aria-label="Rental type"]').length) {
                   const ele = $('[aria-label="Rental type"]')[0];
                   console.log('rental type', ele);
                   $(ele).click();
                   
                   setTimeout(() => {
                      $('[role="option"]').each((idx, role) => {
                         console.log("role", role);
                         console.log("line 174",allData);
                         let building_type = allData.propertytype_c;
                         console.log(building_type);
                         if (building_type) {
                            console.log("Bulding Type", building_type);
                            switch (building_type) {
                               case "Apartment":
                                  if ($(role).html().indexOf("Apartment") > -1) {
                                     console.log("clicking room type", role);
                                     $(role).click();
                                  }
                                  break;
                               case "SingleFamilyHouse":
                                  if ($(role).html().indexOf("House") > -1) {
                                     console.log("clicking room type", role);
                                     $(role).click();
                                  }
                                  break;
                               case "Townhouse":
                                  if ($(role).html().indexOf("Townhouse") > -1) {
                                     console.log("clicking room type", role);
                                     $(role).click();
                                  }
                                  break;
                            }
                         }
                      });  
                   }, 1000);
                } 
             }
             
             function fillFacebookFormHeatSource() {
                if ($('[aria-label="Heating type"]').length) {
                   const ele = $('[aria-label="Heating type"]')[0];
                   console.log('Heating type', ele);
                   let heat_source = 'Electricity';
                   $(ele).click();
                   setTimeout(() => {
                      var isFound = false;
                      $("[role=option]").each((idx, role) => {
                         if ( !isFound && 
                            (($(role).html().indexOf("Electric heating") > -1 && heat_source === "Electricity")
                            || ($(role).html().indexOf("Gas heating") > -1 && heat_source === "Gas")
                            || ($(role).html().indexOf("Heating available") > -1))
                         ) {
                            isFound = true;
                            $(role).click();
                         } 
                      });  
                   }, 1000);
                } 
             }
             
             function fillFacebookFormParking() {
                if ($('[aria-label="Parking type"]').length) {
                   const ele = $('[aria-label="Parking type"]')[0];
                   console.log('Parking type', ele);
                   let parking = 2;
                   $(ele).click();
                   setTimeout(() => {
                      $('[role="option"]').each((idx, role) => {
                         console.log("role", role);
                         if (
                            ($(role).html().indexOf("Garage parking") > -1 && parseInt(parking) === 2)
                            || ($(role).html().indexOf("Street parking") > -1 && parseInt(parking) === 5)
                            || ($(role).html().indexOf("Off-street parking") > -1 && (parseInt(parking) === 3 || parseInt(parking) === 4))
                            || ($(role).html().indexOf("None") > -1 && parseInt(parking) === 7)
                         ) {
                            $(role).click();
                         } 
                      });  
                   }, 1000);
                } 
             }
             
             function fillFacebookFormLaundry() {
                if ($('[aria-label="Laundry type"]').length) {
                   const ele = $('[aria-label="Laundry type"]')[0];
                   console.log('Laundry type', ele);
                   $(ele).click();      
                   setTimeout(() => {
                      $('[role="option"]').each((idx, role) => {
                         console.log("role", role);
                         let laundry = "";
                         if (allData.laundry_c == "Laundry_in_Building") {
                            laundry = 2;
                         }else if (allData.laundry_c == "Washer_Dryer_in_Unit") {
                            laundry = 1;
                         }else if (allData.laundry_c == "Laundry_on_Site") {
                            laundry = 3;
                         }else if (allData.laundry_c == "None" || allData.laundry_c == "Unknown") {
                            laundry = 5;
                         }
                         if (
                            ($(role).html().indexOf("In-unit laundry") > -1 && parseInt(laundry) === 1)
                            || ($(role).html().indexOf("Laundry in building") > -1 && parseInt(laundry) === 2)
                            || ($(role).html().indexOf("Laundry available") > -1 && parseInt(laundry) === 3)
                            || ($(role).html().indexOf("None") > -1 && parseInt(laundry) === 5)
                         ) {
                            $(role).click();
                         } 
                      });  
                   }, 1000);
                } 
             }
             
             function fillFacebookSqft() {
                let sqft = allData.sqft_c;
                $("span").each((idx, ele) => {
                   if ($(ele).html().indexOf("Square feet") > -1 || $(ele).html().indexOf("Property square feet") > -1) {
                      console.log('sqft', $(ele).next());
                      if (sqft && String(sqft).length > 0) {
                         enterReactField($(ele).next()[0], sqft);
                      }
                   } 
                });
             }
             
             function fillFacebookFormDescription() {
                $("span").each((idx, ele) => {
                   if ($(ele).html().indexOf("Rental description") > -1) {
                      console.log('description', $(ele).next());
                      enterReactTextArea($(ele).next()[0], formatFacebookDescription());
                   } 
                });
             }
             
             function fillFacebookPet() {
                var cats = 0;
                var dogs = 0;
                if (allData) {
                      if (allData.catpolicy_c.toLowerCase() == "catsallowed" || allData.catpolicy_c.toLowerCase() == "negotiable" ) {
                         console.log('line 178 cat allowed');
                         cats = 1;      
                      }
                      if (allData.dogpolicy_c.toLowerCase() == "dogsallowed" || allData.dogpolicy_c.toLowerCase() == "smalldogsonly" ) {
                         console.log('line 182 dogs allowed');
                         dogs = 1;      
                      }
                } 
                $("span").each((idx, ele) => {
                   if ($(ele).html().indexOf("Cat friendly") > -1) {
                      console.log('Cat friendly', $(ele).parent().find("input"));
                      toggleFacebookSwitch($(ele).parent().find("input")[0], cats);
                   } else if ($(ele).html().indexOf("Dog friendly") > -1) {
                      console.log('Dog friendly', $(ele).parent().find("input"));
                      toggleFacebookSwitch($(ele).parent().find("input")[0], dogs);
                   } 
                });
                // hideCloseMessage();
                // show2(photoUploadMessage);
             }
             
             function fillFacebookFormBedBathPrice() {
                
                $("span").each((idx, ele) => {
                   if ($(ele).html().indexOf("Number of bedrooms") > -1) {
                      let bedroom = allData.beds_c;
                      console.log('bedrooms', $(ele).next());
                      enterReactField($(ele).next()[0], parseInt(bedroom));
                   } 
                   else if ($(ele).html().indexOf("Number of bathrooms") > -1) {
                      console.log('bathrooms', $(ele).next());
                      enterReactField($(ele).next()[0], allData.baths_c);
                   } 
                   else if ($(ele).html().indexOf("Price per month") > -1) {
                      console.log('price', $(ele).next());
                      enterReactField($(ele).next()[0], allData.rent_c);
                   } 
                });
             }
             
             function toggleFacebookSwitch(input, isOn) {
                var v = $(input).attr("aria-checked") === "true";
                console.log("toggle", input, isOn, v);
                if ((isOn && !v) || (!isOn && v)) {
                   $(input).click();
                }
             }
             
             function formatFacebookDescription() {
                var desc = [];
               //  let description = allData.description;
                let building_description = allData.builddesc_c;
                let unit_description = allData.unitdescription_c;
                let features = ["Test Building features","Test Features"];
             
               //  if (description && description.length > 0)
               //     desc.push(description);
             
                if (building_description && building_description.length > 0)
                   desc.push(building_description);
             
                if (unit_description && unit_description.length > 0)
                   desc.push(unit_description);
             
                if (features && features.length > 0)
                   desc.push("Features: " + features.join(", "));
             
                if (desc.length > 0) {
                   desc = desc.join("\n\n");
                   console.log("formatFacebookDescription", desc);
                   return desc;
                }
                else
                   return "";
             }
             
             function fillFacebookFormAddress() {
                $("span").each((idx, ele) => {
                   if ($(ele).html().indexOf("Rental address") > -1) {
                      // var adr = formatAddress(arge, false);
                     //  var adr = allData.streetname_c;
                     var adr = allData.street_c + " " + allData.streetname_c 
                     + ", " + allData.city_c + " " + allData.state_c;
                      var adrInput = $(ele).next()[0];
                      console.log('address', adrInput, adr);
                      
                      $(adrInput).focus();
                      setTimeout(() => {
                         enterReactField(adrInput, adr);
             
                         setTimeout(() => {
                            var isAdrFound = false;
                            $("li").each((idx, adrDiv) => {
                               if ($(adrDiv).html().indexOf("United States") > -1) {
                                  if (!isAdrFound) {
                                     console.log("adr found", adrDiv);
                                     isAdrFound = true;
                                     $($(adrDiv).children()[0]).children()[0].click();
                                     hideCloseMessage();
                                     show2(photoUploadMessage);
                                  }
                               }
                            });
                            
                            /*if (arge.edit.photos && arge.edit.photos.length) {
                               show2(photoUploadMessage, "", () => {
                                  showFacebookPhotos();
                               });
                            } else {
                               show2(fb_formFilledMessage);
                            }*/
                         }, 2000);
                      }, 1000);
                   }
                });
             }

             function awaitingRentalType() {
                if ($('[aria-label="Rental type"]').length) {
                   awaitType = null;
                   console.log('fillFacebookForm 2')
                   fillFacebookForm();
                }
             }
             
             function awaitingFormOpen() {
                if (fb_isRentalForm()) {
                   if (fb_isEditPage())
                      recordFacebookAd();
                   awaitType = "awaitingRentalType";
                   fillFacebookFormForRent();
                } else if ($('a:contains("Home for ")').length) {
                   console.log("Clicking home for rent", $('a:contains("Home for ")')[0]);
                   $('a:contains("Home for ")')[0].click();
                }
             }

             function checkExistingFacebookAds(ret) {
                console.log("line 449 checkExistingFacebookAds method");
                try {	
                   existingFacebookIds = jQuery.parseJSON(ret);
                }
                catch(err) {
                   showError("Error name: " + err.name + ". <br/>Error message: " + err.message
                      + "<br/>ret: " + ret);
                   return;
                }
             
                if (existingFacebookIds && existingFacebookIds.length) {
                   var isRedirectToEditPage = false;
                   if (fb_isEditPage()) {
                      const currentFacebookId = parseFacebookId();
                      if (existingFacebookIds.indexOf(currentFacebookId) === -1) {
                         isRedirectToEditPage = true;
                      }
                   } 
                   else 
                      isRedirectToEditPage = true;
             
                   if (isRedirectToEditPage) {
                      isNew = false;
                      document.location.href = "https://www.facebook.com/marketplace/edit/?listing_id=" + existingFacebookIds[0];
                      return;
                   }
                }
             
                awaitType = "openPostingForm";
             }
             
             function openFacebookPostingForm() {
                console.log('openFacebookPostingForm');
                console.log(fb_isRentalForm())
                console.log($('[aria-label="Home for Sale or Rent"]').length)
                console.log($('[aria-label="Home for Sale or Rent"]'));
                if (fb_isRentalForm()) {
                   console.log("Filling rental form");
                   isNew = !fb_isEditPage();
                   
                   fillFacebookFormForRent();
                }
                else if ($('div:contains("Create New Listing")').length) {
                   awaitType = "awaitingFormOpen";
                   if (!fb_isEditPage())
                      show2("Penny Posting: Create a new listing or edit the matching listing to continue posting.");
                   else {
                      console.log("Listing not found, remove");
                      removeFacebookAd(parseFacebookId());
                   }
                }
                else {
                  console.error("PP Error, form not detected.");
               }
             }
             
             function fb_isRentalForm() {
                return $('[aria-label="Home for Sale or Rent"]').length > 0;
                // return $('[aria-label="Property for Sale or Rent"]').length > 0;
             }
             
             function fb_isEditPage() {
                 console.log(document.location.href.indexOf("https://www.facebook.com/marketplace/edit/?listing_id=") > -1);
                return document.location.href.indexOf("https://www.facebook.com/marketplace/edit/?listing_id=") > -1;
             }
             
             function parseFacebookId(url) {
                if (!url || url.length === 0) {
                   if (!fb_isEditPage())
                      return null;
             
                   url = document.location.href;
                }
             
                return url.replace("https://www.facebook.com/marketplace/edit/?listing_id=", "");
             }
             
             function initFacebook() {
                const url = document.location.href;
                console.log("PP Loaded.",url);
                /*let postingtype = "B";
                if (postingtype == "B") {
                   action('103369', '103369 ', "checkFacebookAd", '');
                }*/
             
               //  awaitType = "openPostingForm";
               setTimeout(openFacebookPostingForm, 2000);
               // openFacebookPostingForm();
                formTimer = setInterval(fb_await, 1000);
             }
             
        })
    }
})

function show1(l1){
   showMessage('<div id ="postingClose"><h2 style="color:white;">'+l1+'</h2></div>');
}

$("body").append('<div id="tasDialogContainer" style="display:none;position: fixed;top: 0;left: 0;z-index:999;filter:alpha(opacity=70); opacity:0.7;background-color:#333333; color:white;"><div id ="tasDialogContent" style="background-color:black;position: fixed;top: 250px; width:600px;padding:20px;text-align:center;"></div></div>');

const closeLink = '<div style="font-family:arial; font-size:14px; margin-top:20px;"><button id="pp_close_message" \
   >Close</button></div>';

function showMessage(msg)
{
   $( "#tasDialogContainer").css("display", "block");
   $( "#tasDialogContainer").width($(window).width());
   $( "#tasDialogContainer").height($(document).height());
   $("#tasDialogContent").css({left: String(Math.ceil(($(window).width() - 600) / 2)) + "px"});
   $( "#tasDialogContent").html(msg);
}

function enterReactTextArea(input, value) {
   console.log('enterReactTextArea ', input, value);
   if (typeof input !== 'undefined') {
     var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
     nativeInputValueSetter.call(input, value);

     var ev2 = new Event('input', { bubbles: true});
     input.dispatchEvent(ev2);
     ev2 = new Event('blur', { bubbles: true});
     input.dispatchEvent(ev2);
   }    
}

function enterReactField(input, value) {
   console.log('enterReactField ', input, value);
   if (typeof input !== 'undefined' ) {
     var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
     nativeInputValueSetter.call(input, value);

     var ev2 = new Event('input', { bubbles: true});
     input.dispatchEvent(ev2);
     ev2 = new Event('blur', { bubbles: true});
     input.dispatchEvent(ev2);
   }    
}

function hideCloseMessage()
{
   $("#tasDialogContainer").css("display", "none");
}

function show2(msg,callback=null){
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

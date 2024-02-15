var recordZillowListingTimer = null;
var apt_step = null;
var wait = 0;
var allData = '';

chrome.storage.local.get(['record'], function(result) {    
    console.log('Value currently is ' + result.record);    
    if(result.record !== null){

        const dataFromAptSrc = async () => {
            let data = '';
            await fetch(`https://crm-dev.apartmentsource.com/custom/service/v4_1_custom/ListingRecord.php?listID=${result.record}`)
            .then(r => r.json())
            .then(result => {
                // console.log("line 12",JSON.parse(result));                
                // data = JSON.parse(result);                
                data = result;                
            })                          
            return data;   
        }

        function enterAptField(input, value) {
            // console.log("enterAptField", input, value);
            if (!value)
               return;
         
            value = String(value);
            $(input).val(value);
            var code = String(value)[value.length-1].charCodeAt(0);
            // console.log(code);
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
               which: code
            }));
        }

        function enterReactField(input, value) {
            // console.log('enterReactField', input, value);
            var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(input, value);
        
            var ev2 = new Event('input', { bubbles: true});
            input.dispatchEvent(ev2);
            ev2 = new Event('blur', { bubbles: true});
            input.dispatchEvent(ev2);
        }

        function apt_fillNew() {
            $('[for="unitQuantityTypeSingle"]').click();
            wait += 1000;         
            setTimeout(apt_fillPropertyType, wait);
            wait += 2000;         
            /**
             * This step must be the last thing to execute, otherwise the address autocompletion is not triggered.
             */
            setTimeout(apt_fillAddress, wait);
         }


        function apt_fillTotalUnits() {
            let totalUnits = allData.totalunitbuilding_c;
            if ($('#cpid1-unitQuantity').length > 0 && $('#cpid1-unitQuantity').attr("disabled") != "disabled") {
                enterReactField($('#cpid1-unitQuantity')[0], totalUnits);
                $("#cpid1-unitQuantity")[0].focus();
                setTimeout(() => {
                    apt_fillUnit();
                }, 1000);
            } else {
                // console.log("PP, no total units field.");
                apt_fillUnit();
            }
        }
 
        function apt_fillUnit() {
            let unit = allData.unit_c;
            if ($('#cpid2-0unitNumber').length) {
                enterReactField($('#cpid2-0unitNumber')[0], unit);
                $("#cpid2-0unitNumber")[0].focus();
                setTimeout(() => {
                    apt_fillBeds();
                }, 1000);
            } else {
                apt_fillBeds(); 
            }
        }
 
        function apt_fillBeds() {
            beds = allData.beds_c;
            // console.log("line 108 apt_fillBeds", allData);
            $("mat-select#cpid2-0beds").click();
            setTimeout(() => {
            if ($("mat-option").length) {
                if (beds < 1)
                    $("mat-option")[0].click();
                else if (beds < 2)
                    $("mat-option")[1].click();
                else if (beds < 3)
                    $("mat-option")[2].click();
                else if (beds < 4)
                    $("mat-option")[3].click();
                else if (beds < 5)
                    $("mat-option")[4].click();
                else if (beds < 6)
                    $("mat-option")[5].click();
                else if (beds == 'studio')
                    $("mat-option")[0].click();
                else
                    $("mat-option")[6].click();
        
                setTimeout(apt_fillBaths, 1000);
            }
            }, 1000);
        }
 
        function apt_fillBaths() {
            baths = allData.baths_c;;
            // console.log("apt_fillBaths", baths);
            $("mat-select#cpid2-0baths").click();
            setTimeout(() => {
            if ($("mat-option").length) {
                if (baths < 1)
                    $("mat-option")[0].click();
                else if (baths < 1.5)
                    $("mat-option")[1].click();
                else if (baths < 2)
                    $("mat-option")[2].click();
                else if (baths < 2.5)
                    $("mat-option")[3].click();
                else if (baths < 3)
                    $("mat-option")[4].click();
                else if (baths < 3.5)
                    $("mat-option")[5].click();
                else if (baths < 4)
                    $("mat-option")[6].click();
                else if (baths < 4.5)
                    $("mat-option")[7].click();
                else if (baths < 5)
                    $("mat-option")[8].click();
                else if (baths < 5.5)
                    $("mat-option")[9].click();
                else if (baths < 6)
                    $("mat-option")[10].click();
                else if (baths < 6.5)
                    $("mat-option")[11].click();
                else if (baths < 7)
                    $("mat-option")[12].click();
                else
                    $("mat-option")[13].click();
        
                setTimeout(() => {
                    apt_step = "AwaitAddListingDetails";
                    /**
                     * Display message to ask the user to check off the Capcha to continue.
                     */
                    // hideMessage();
                    // success3("Address info filled. Complete reCAPTCHA and continue.");
                    // flickertitle("PP: Next Step Ready");
                }, 1000);
            }
            }, 1000);
        }

         function apt_fillPropertyType() {
            $("mat-select#cpid1-propertyType").click();
            let propertyType = allData.propertytype_c;
            setTimeout(() => {
               switch(propertyType) {
                  case "Townhouse": 
                     if ($('.mat-option-text:contains("Townhouse")').length)
                        $('.mat-option-text:contains("Townhouse")')[0].click();
                     else
                        $('.mat-option-text:contains("Apartment")')[0].click();
                     break;
                  case "Condominium": 
                  case "Co-operative": 
                  case "Condop": 
                     if ($('.mat-option-text:contains("Condominium")').length)
                        $('.mat-option-text:contains("Condominium")')[0].click();
                     else
                        $('.mat-option-text:contains("Apartment")')[0].click();
                     break;
                  case "SingleFamilyHouse":
                     if ($('.mat-option-text:contains("Single Family")').length)
                        $('.mat-option-text:contains("Single Family")')[0].click();
                     else
                        $('.mat-option-text:contains("Apartment")')[0].click();
                     break;
                  case "MobileHome":                        
                        $('.mat-option-text:contains("Mobile Home/Manufactured Home")')[0].click();
                     break;
                  default:
                     $('.mat-option-text:contains("Apartment")')[0].click();
                     break;
               }
            }, 1000);
         }

         function apt_fillAddress() {
            $("#cpid1-address").focus();
            // var adr = '1654 Melrose St. 1, Chicago, IL 60657';
            var adr = allData.streetname_c;
            enterAptField($("#cpid1-address")[0], adr);
            $("#cpid1-address").focus();            
            /**
             * Always select the first choice that pops up.
             */
            setTimeout(() => {
               if ($("mat-option").length) {
                  $("mat-option")[0].click();
                  setTimeout(() => {
                     apt_step = "AwaitValidateAddress";
                  }, 1000);
               }
            }, 3000);
         }
        
        function initApartmentsProperty() {
            console.log("PP Loaded!");
            apt_step = "AwaitAddAddress";               
            setTimeout(() => {
                recordZillowListingTimer = setInterval(() => {
                console.log("PP checking", apt_step);

                 if (apt_step === "AwaitAddAddress" && $("#cpid1-address").length) {
                    apt_step = null;
                    // show3("Posting, please don't interrupt or navigate away...");                        
                    // setTimeout(apt_fillNew, 1000);
                    apt_fillNew();
                 } 
                 else if (apt_step === "AwaitValidateAddress") {
                    if ($("#cpid1-address").val().length > 0 && $("div.loading").length === 0) {
                       apt_step = null;
                       setTimeout(apt_fillTotalUnits, 1000);
                    }
                 } 
                 else if (apt_step === "AwaitAddListingDetails") {
                    $("button").each((idx, ele) => {
                        if ($(ele).html().indexOf("Add My Property") > -1 && $(ele).attr("disabled") != "disabled") {
                          // console.log('Adding listing detials');
                          // show3("Posting, please wait...");
                          apt_step = "ListYourProperty";
                          $(ele).click();
                        } 
                    });
                }
                 else if (apt_step === "ListYourProperty") {
                    $(".action-card").find("button").each((idx, button) => {
                        if ($(button).html().indexOf("Add Listing Details") > -1) {
                          apt_step = null;
                          // console.log("Cliking Add Listing Details", button);
                          $(button).click();
                        }
                    });
                    /*chrome.storage.local.set({record: null}, function() {
                        console.log('Value is set to empty');
                    });*/
                    }
                }, 1000);
            }, 1000);
         }

         let allDt = dataFromAptSrc().then(res => {
            allData = res.listDetails;
            console.log("line 251 All Data: ",allData);
            setTimeout(initApartmentsProperty(), 3000);
         });
            // initApartmentsProperty();
    }
});




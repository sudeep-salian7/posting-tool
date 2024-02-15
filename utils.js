const closeLink = '<div style="font-family:arial; font-size:14px; margin-top:20px;"><button id="pp_close_message" \
   >Close</button></div>';
var allData = '';
var rec='';
let allDt='';

// function read_option_tab(){
   // if (typeof key === "record")
      key = ['record'];
   chrome.storage.local.get(key, function(result) {   
      rec= result.record;
      console.log('Value currently is ' + result.record);    
      if(result.record !== null){
         const dataFromAptSrc = async () => {
            let data = '';
            //https://https://tas-clone.dotgital.com/custom/service/v4_1_custom/ListingRecordcrm.apartmentsource.com/custom/service/v4_1_custom/ListingRecord.php?listID=${result.record}
            await fetch(`https://crm.apartmentsource.com/custom/service/v4_1_custom/ListingRecord.php?listID=${result.record}`)
            .then(r => r.json())
            .then(result => {
                  // console.log("line 12",JSON.parse(result));                
                  // data = JSON.parse(result);                
                  data = result;               
            })                          
            return data;
         }
         let allDt = dataFromAptSrc().then(res => {
            allData = res.listDetails;
            console.log("line 251 All Data: ",allData);
            
            // setTimeout(initApartmentsProperty(), 3000);
            return allData;
         });
         console.log('allDt ' ,allDt)
         // console.log('allDt ', allData)       
      }
   
      // if(result.record !== null){
      //    $.ajax({
      //       url:`https://crm.apartmentsource.com/custom/service/v4_1_custom/ListingRecord.php?listID=${result.record}`,
      //       processData: false,
      //       contentType: false,
      //       cache: false,
      //       async:false,
      //       dataType: "json",
      //       success: function (res) {
      //          console.log('res ' , res);
      //          allData = res.listDetails;
      //          console.log("line 251 All Data: ",allData); 
      //       }
      //    })
      // }
   });
// }

console.log('allDt 52 ' ,allDt)


// console.log('Value currently is ' + rec);
// console.log('allData 45 ' , allData)
function show1(l1){
   showMessage('<div id ="postingClose"><h2 style="color:white;">'+l1+'</h2></div>');
}
function show3(msg) {
   if ($("#pp_status_message").length) {
      $("#pp_status_message").html(msg);
      $("#pp_status_message").css("color", "white");
   } else {
      $("body").prepend("<div id='pp_status_message' style='width:100%; position: absolute; top 0; left: 0; z-index: 99999; background-color:black; font-size: 24px; text-align:center; padding: 5px; color: white; font-weight: bold;'>" + msg + "</div>")
   }
}
function hideMessage()
{
   $("#pp_status_message").css("display", "none");
}
function hideCloseMessage()
{
   $("#tasDialogContainer").css("display", "none");
}
function success3(msg) {
   if ($("#pp_status_message").length) {
      $("#pp_status_message").html(msg);
      $("#pp_status_message").css({"color":"#74b71b","display":"block"});
   } else {
      $("body").prepend("<div id='pp_status_message' style='width:100%; position: absolute; top 0; left: 0; z-index: 99999; background-color:#74b71b; font-size: 24px; text-align:center; padding: 5px; color: red; font-weight: bold;'>" + msg + "</div>")
   }
}
function flickertitle(msg){
    titleTimer = setInterval(function(){
        document.title= document.title==msg?'Attention!!!':msg;
     }, 650);
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
$("body").append('<div id="tasDialogContainer" style="display:none;position: fixed;top: 0;left: 0;z-index:999;filter:alpha(opacity=70); opacity:0.7;background-color:#333333; color:white;"><div id ="tasDialogContent" style="background-color:black;position: fixed;top: 250px; width:600px;padding:20px;text-align:center;"></div></div>');
function showMessage(msg)
{
   $( "#tasDialogContainer").css("display", "block");
   $( "#tasDialogContainer").width($(window).width());
   $( "#tasDialogContainer").height($(document).height());
   $("#tasDialogContent").css({left: String(Math.ceil(($(window).width() - 600) / 2)) + "px"});
   $( "#tasDialogContent").html(msg);
}
function showError(l1){
      showMessage('<div id ="close"><h3>Sorry, an error has occurred. Please report the following error message to support@pennyposting.ch:</h3> \
         <div style="background-color:white; padding:10px; font-size:12px; color:black; text-align:left; max-height:100px; overflow:auto;">' + l1 + '</div>\
               <h3><a id="pp_hideError_link" style="color:#99DDFF;" href="javascript:void(0);">Hide this message</a></h3></div>');
   
   $("#pp_hideError_link").click(hideMessage);
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
function enterReactTextArea(input, value) {
    console.log('enterReactTextArea', input, value);
    if (typeof input !== 'undefined') {
      var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
      nativeInputValueSetter.call(input, value);

      var ev2 = new Event('input', { bubbles: true});
      input.dispatchEvent(ev2);
      ev2 = new Event('blur', { bubbles: true});
      input.dispatchEvent(ev2);
    }    
}
function formatAddress(arge, isIncludeUnit = true) {
   var adr = arge.trace.street_number + " " + arge.trace.street_name + ", ";
   if (isIncludeUnit && arge.trace.unit && arge.trace.unit.length > 0)
      adr += "#" + arge.trace.unit + ", ";
   adr += arge.edit.city + ", " + arge.trace.state + (arge.trace.zip && arge.trace.zip.length > 0 ? " " + arge.trace.zip : "");

   return adr;
}





function action(a,b,c,d){
    var trail = "action call. a: " + a + " b: " + b + " c: " + c + " d: " + d;
    console.log(trail);

    var a = makeRequest(URL + "action2/", xmlrpc.writeCall("action2", [a,b,c,d]));
}
function makeRequest(server, body, callback) {
    chrome.runtime.sendMessage({server, body},
        ret => {
            if (callback) {
               console.log("line 66");
                callback(ret);
            } else {
               console.log("line 69",typeof ret);
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
                     console.log("line 85");
                        console.log(k + ': ' + ret[k]);
                    })
                    return;
                }                              
            }
        }
    );
}
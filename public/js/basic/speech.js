var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "hi-IN";

import axios from "axios";

var listening = false;

recognition.onresult = function(event) {
    var interim_transcript = '';
    var final_transcript = '';

    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
        //  document.getElementById('transcript').value = final_transcript;
        trans(final_transcript)
        
        toggle();
      } else {
        interim_transcript += event.results[i][0].transcript;
        document.querySelector(".inputTxtHolder").value = interim_transcript;
      }
    }

  };
  export const addMicListner =()=>{
document.querySelector(".mic").addEventListener("click",toggle)}
function toggle() {
  if(listening) {
    recognition.stop();  
    listening = false;
     document.querySelector(".micSearch").classList.remove("search")
    document.querySelector(".mic").addEventListener("click",toggle)
  }
  else {
    recognition.start();
    listening = true;
    document.querySelector(".mic").addEventListener("click",toggle)
    document.querySelector(".micSearch").classList.remove("search")
      document.getElementById('transcript').value = "Listening...";
  }
}
const trans = async(data1)=>{
let apiUrl = `https://api.mymemory.translated.net/get?q=${data1}&langpair=hi|en`;
    fetch(apiUrl).then(res => res.json()).then(async (data) => {const transTxt= data.responseData.translatedText.toLowerCase();
        document.querySelector(".inputTxtHolder").value = transTxt;
        document.querySelector(".inputTxtHolder").value = "Processing...   "+transTxt;
          
        const res = await axios({
          method: "GET",
          url:  `/api/v1/${window.location.pathname.includes("farm")?"farmProduct":"product"}`,
        });
        let searchData =[]
        
        res.data.data.data.forEach((el)=>{searchData.push(el.name.toLowerCase())})

        console.log(searchData,transTxt);
        if(transTxt.includes("order")) window.location.href="/myOrders"
        else if(transTxt.includes("product")) window.location.href="/seller_products"
        else if(transTxt.includes("demand")) window.location.href="/demand"
        else if(transTxt.includes("weather")) window.location.href="/weather"
        else if(transTxt.includes("detail") ||transTxt.includes("description")) window.location.href="/editAccount"
        else if(data1 == "टमाटर") window.location.href="/search/tomato"
        else{
            const available = searchData.map((el)=>{console.log(el,transTxt);
              if(transTxt.includes(el))
                return transTxt.includes(el);
            else
              return el.includes(transTxt);
          })
            if(available.includes(true)){
                if(window.location.pathname.includes("farm")) window.location.href=`/farmSearch/${searchData[available.indexOf(true)]}`
                else window.location.href= `/search/${searchData[available.indexOf(true)]}`
            }
            else{location.reload(); 
                document.querySelector(".inputTxtHolder").value = "Could Not Recognize ,Try Again!!"}

        }

    });}
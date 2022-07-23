document.addEventListener('DOMContentLoaded', function() {
var initial;
var Url;





function hash_algo(hash_input){
    var spec_c="%-_@.";
    var spec_c_ascii=[0,0,0,0,0];
    for(let i=0;i<spec_c.length;i++){
        spec_c_ascii[i]=spec_c.charCodeAt(i);  
        
    }
    const allowed=[];
    for(let i=0;i<26;i++){
        allowed[i]=65+i;
    }
    for(let i=26;i<52;i++){
        allowed[i]=97+i-26;
    }
    for(let i=52;i<57;i++){
        allowed[i]=spec_c_ascii[i-52];
    }
    
    
    
    function isEven(a){ 
        return (a & 0x1) == 0 ;
    }
     
     
    function intPow(val, exp){
        if (exp == 0){
            return 1;
        } 
        if (isEven(exp)){
            return intPow(val * val, exp / 2); 
        }
        return val * intPow(val * val, (exp - 1) / 2);
    }
    
    
    function gen_n(s){
        let count=0;
        let res=0;
        for(let i=0;i<s.length;i++){
            
            
            res=res+intPow(s.charCodeAt(i),count);
            count=count+1;
            
            
        }
        return res;
    }
    
    var n=gen_n(hash_input);
    console.log(n);

    var final=[0,0,0,0,0,0,0,0,0,0];
    final[n%10]=spec_c_ascii[n%5];
    final[9-n%10]=65+(n*17)%26;
    length=hash_input.length;
    function rot_inp(hash_inp,n){
        var hash_input=[];
        let length=hash_inp.length;
        for(let i=0;i<length-1;i++){
            hash_input[i]=hash_inp[i];
        }
        length=hash_input.length;
        let cs="";
        for(let i=0;i<n;i++){
            cs=cs.concat(hash_input[length-n+i]);
        }
        for(let i=n;i<length;i++){
            cs=cs.concat(hash_input[i-n]);
        }
        return cs;
        
    }
    
    var cs=rot_inp(hash_input,((n*length)^3)%length);

    console.log(cs.length);
    
    var hash_table=[];
    for(let i=0;i<length;i++){
        hash_table[i]=hash_input.charCodeAt(i)^cs.charCodeAt(i);
    }
    var str_n=n.toString();
    var str_n_len=str_n.length;
    for(let i=0;i<str_n_len;i++){
        let temp_i=str_n.charCodeAt(i)-48;
        let temp=hash_table[temp_i%length];
        hash_table[temp_i%length]=hash_table[(str_n_len-temp_i)%length];
        hash_table[(str_n_len-temp_i)%length]=temp;
    }
    
    var upp_final=10;
    for(let i=0;i<10;i++){
        
        if(final[i]==0 && hash_table[i]!=undefined){
            final[i]=allowed[hash_table[i]%allowed.length];
            
        }
    }
    
    
    
    
    function codesToString(arr){
        return String.fromCharCode(...arr);
    }
    
    final_hash=codesToString(final);
    
    return (final_hash);
}


chrome.tabs.query({'active': true}, function (tabs) {
    Url = tabs[0].url;
    Url=new URL(Url);
    Url=Url.hostname;
});



document.getElementById("copyTextBtn").addEventListener('click',function(){
    
    function copyTextToClipboard(text) {
        //Create a textbox field where we can insert text to. 
        var copyFrom = document.createElement("textarea");
      
        //Set the text content to be the text you wished to copy.
        copyFrom.textContent = text;
      
        //Append the textbox field into the body as a child. 
        //"execCommand()" only works when there exists selected text, and the text is inside 
        //document.body (meaning the text is part of a valid rendered HTML element).
        document.body.appendChild(copyFrom);
      
        //Select all the text!
        copyFrom.select();
      
        //Execute command
        document.execCommand('copy');
      
        //(Optional) De-select the text using blur(). 
        copyFrom.blur();
      
        //Remove the textbox field from the document.body, so no other JavaScript nor 
        //other elements can get access to this.
        document.body.removeChild(copyFrom);
      }
      copyTextToClipboard(hash_algo(initial));
      document.getElementById("copyTextBtn").innerHTML="Copied";
      

})
document.getElementById("Generate Custom").addEventListener('click',function(){
    
    initial=document.getElementById("MasterKey").value;
    if(initial.length<6 || initial.length>16){
        alert("Master Key should be between 6 to 16 character long!")
        return;
    }
    
    
    initial=initial.concat(Url);
    
    
    
    document.getElementById("display_pass").innerHTML=hash_algo(initial);
    
 
    
});
});

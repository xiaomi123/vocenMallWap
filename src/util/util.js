export default {
	
	//校验
	check: {
		/**
     * 判断是否是空
     * @param {字符串} target
     */
    isEmpty (target) {
      if (target == null || target == "null" || target == "" || target =="undefined" || target==undefined) {
        return true
      }
      return false
    },
    /**
     * 判断手机号校验
     */
    checkMobile(mobileNum) {
		  let ReDetection = false;
		  let mobileNumber = this.trim(mobileNum);
		  let regu =/(^[1][3][0-9]{9}$)|(^[1][5][0-9]{9}$)|(^[1][8][0-9]{9}$)|(^[1][9][0-9]{9}$)|(^[1][4][0-9]{9}$)|(^[1][7][0-9]{9}$)/;	
			let reg = new RegExp(regu);
		  ReDetection = reg.test(mobileNumber);  // 手机验证 13x 15x 18x 14x 17x以此类推
		  if(!ReDetection){
		    return false;
		  } 
		    return true;
		},
		/**
     * 判断去空格
     */
		trim(str) {   
			if (str != null) {
				return str.replace(/(^\s*)|(\s*$)/g, "");   
			}
			return str;
		},
		/**
     * 判断密码校验
     */
    pswCheck(passWord){
    	let reg = /^[A-Za-z0-9]+$/;//只能字母数字
    	let reg01 = /^[0-9]{1,20}$/;//全为数字
    	let reg02 = /^[A-Za-z]+$/;//全为字母
    	if(passWord.length<6||passWord.length>20){
				//alert("密码设置6-20位");
				return false;
			}else if(!reg.test(passWord)){
				//alert("只能数字和字母")
				return false;
			}else{
				return true;
			}
		},
		/**
     * 判断校验只能含有数字有字母
     */
		idZs(userName){
			let patrn=/^[A-Za-z0-9]+$/; 
			if (patrn.test(s)){
				 return false; 
			}else{
				return true; 
			}
		},
		//获得输入框中字符长度
    searchLength(val) {  
		  var str = new String(val);  
		  var bytesCount = 0;  
		  for (var i = 0 ,n = str.length; i < n; i++) {  
		    var c = str.charCodeAt(i);  
		    if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {  
		      bytesCount += 1;  
		    } else {  
		      bytesCount += 2;  
		    }  
		  }  
		  return bytesCount;  
		}
		
	},
	
    
}

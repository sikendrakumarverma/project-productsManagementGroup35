var romanToInt = function(s) {
    // let arr = ["I", "V", "X", "L", "C", "D", "M"]
    let obj = {"I" : 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000};
    let count = 0;
    for(let i = 0; i < s.length; i++){
        let str = s[i];
        let data = obj[str]
        count = count + data;
    }
    return count;
    
};

let s = "III"

let r = romanToInt(s)
console.log(r)
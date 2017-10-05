function pyramid(a){
    for(var i = 1; i <= a; i++){
      var count = 1;
      var val = i;
      while(count < i ) {
        val += String(i);
        count++;
      }
      console.log(val);
    }
}

pyramid(4);
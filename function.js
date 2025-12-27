// №1
function factorial(x) {
  let result = 1;
  for (let i = 1; i <= x; i++) {
    result = result * i;
  }
  return result;
}

console.log(factorial(6));

// №2
function longWord(str){
const words = str.split(' ');
  let max = 0;
  
  for (let word of words) {
    if (word.length > max) {
      max = word.length;
    }
  }
  return max;    
}

console.log(longWord("Привет, меня зовут Олеся."));

// №3
function subarray(x) {
  const result = [];
 
  for (let xy of x) {
    let max = xy[0];
    
    
    for (let num of xy) {
      if (num > max) {
        max = num;
      }
    }
    result.push(max);
  }
  return result;
}
console.log(subarray([[1,2,3], [4,5], [6,7,8,9]]));

// №4
function line(str, x) {
 
  if (str.x <= x) {
    return str;
  }
  
  return str.slice(0, x) + '..';
}
console.log(line("Мандарины", 7));

// №5
function capitalLetter(str) {
  const words = str.split(' ');
  const result = [];
  
  for (let word of words) {
    
    const x = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    result.push(x);
  }
  
  return result.join(' ');
}
console.log(capitalLetter("я кушаю МАНДАРИНЫ"));

// №6
function ArrayA(x, y, n) {
  
    const result = [...y];
    
    for (let i = 0; i < x.length; i++) {
        result[n + i] = x[i];
    }
    
    return result;
}

console.log(ArrayA([1, 2, 3], [4, 5], 1)); 

// №7
function falseValues(x){
  const result = [];
  
  for (let num of x) {
  
    if (num) {
      result.push(num)
    }
  }
  
  return result;
}
console.log(falseValues([0,'',1, false, 2, '', 3]));

// №8

function arrayStrings(x){
  const str1 = x[0].toLowerCase();
  const str2 = x[1].toLowerCase();
  
  for (let word of str2) {
    if (!str1.includes(word)){
      return false;
    }
  }
  
  return true;
}
console.log(arrayStrings(["Привет","Прив"]));

// №9
function Arrays(x, size) {
  const result = [];
  let i = 0;
  
  while (i < x.length) {
    const arr = x.slice(i, i + size);

    result.push(arr);

    i = i + size;
  }
  
  return result;
}
console.log(Arrays([1,2,3,4,5], 2)); 

// №10
function filledArray(x, n) {
 
  if (n <= 0) {
    return x;
  }
  
 x.push(n);
 
  return filledArray(x, n - 1);
}
const result = [];
filledArray(result, 15);
console.log(result); 
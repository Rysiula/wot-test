exports.add = function(a, b) {  //#A
  logOp(a, b, '+');
  return a + b;
}

exports.sub = function(a, b) {
  logOp(a, b, '-');
  return a - b;
}

exports.mul = function(a, b) {
  logOp(a, b, '*');
  return a * b;
}

function logOp(a, b, op) {  //#B
  console.log('Obliczam ' + a + op + b);
}

//#A Obiekt export sprawia, że funkcje tego modułu będą dostępne dla jego użytkowników.
//#B logOp jest wewnętrzną funkcją modułu, która nie będzie dostępna poza tym plikiem.

function tableBuilder(data, rowContains, set) {
  var html = '';
  var transflip = false;

  var negativeCounter = 0
  var mixedCounter = 0
  var positiveCounter = 0

  var tvCounter = 0;

  html += '<table>';

  for (var i = 1; i < data.length; i++) {
    // data[i];

    if (data[i].join().match(/TV[0-9]{1,9}/)) tvCounter++


    html += '<tr data-row="' + data[i][0] + '" data-line="' + data[i][4] + '">';
    var firstCellOffset = 5;
    var divisionCell = firstCellOffset + 16;

    for (var j = firstCellOffset; j < data[i].length; j++) {
      var cell = data[i][j];

      if (j == divisionCell) {
        var divisionStyle = 'background-color:#ccc; width:1px; height:1px; margin:0 auto;';
        html += '<td data-col="' + j + '"><div style="'+ divisionStyle +'"></div></td>'
      }
      // check if cell contains anything
      else if (cell.length > 0) {
        html += '<td data-col="' + j + '" style="background-color: #' + colmap[j-firstCellOffset] + ';"></td>'

        // victim attitude
        if (j === 35) negativeCounter++
        if (j === 36) mixedCounter++
        if (j === 37) positiveCounter++

      } 
      else {
        html += '<td data-col="' + j + '"></td>'
      }
    };
    html += '</tr>';
  

    
    if (data[i].join().indexOf('TRANSCRIPT') > -1)  {
      transflip = true;
      var divisionStyle = 'background-color:#000; width:1px; height:1px; margin:0 auto;';
      html += '<tr><td colspan="34" style="'+ divisionStyle +'"></td></tr>'
      html += '<tr><td colspan="34" style="font-size: 8px">' + data[i][4] + '</td></tr>'
    }


    if (data[i].join().indexOf('Session Start') > -1)  {
      if (transflip) {
        transflip = false
      } else {
        var divisionStyle = 'background-color:#ccc; width:1px; height:1px; margin:0 auto;';
        html += '<tr><td colspan="34" style="'+ divisionStyle +'"></td></tr>'
      }

      var accountId = false;
      var lookAhead = 1;
      var matcher = /O1\s?\(A[0-9]{1,9}\)/;

      if (!set.account_num) {
        while (!accountId) {

          // We're looking for a match on account i.e. O1(An) within a session. 
          // Let's see what we hit first
          if (data[i + lookAhead].join().indexOf('Session Start') > -1) {
            break;
          }

          accountId = data[i + lookAhead].join().match(matcher);
          

          if (accountId) {
            html += '<tr><td colspan="34" style="font-size: 8px">' + accountId[0].replace(/A/, 'P') + '</td></tr>'

          } else {
            lookAhead++
          }
        }
      }

    }

    
  };

  html += '</table>';

  console.log({
    file: set.file,
    negative: negativeCounter,
    mixed: mixedCounter,
    positive: positiveCounter,
    tv: tvCounter
  })

  return html;
}

function keyBuilder (moves, colmap) {
  var movesUnique = _.uniq(moves);
  var colmapUnique = _.uniq(colmap);

  var html = '';
  for (var i = 0; i < movesUnique.length; i++) {
    html += '<div class="item">';
    html += '<div class="item-color" style="background-color: #' + colmapUnique[i] + ';"></div>'
    html += '<div class="move">' + movesUnique[i] + '</div>';
    html += '</div>';
  };

  return html;
}

function dataNavBuilder (datas) {
  var html = '<ul>';
  for (var i = 0; i < datas.length; i++) {
    html += '<li>';
    html += '<a href="' + i + '">' + datas[i].nomRef + '</a>';
    html += '</li>';
  };
  html += '</ul>';

  return html;
}

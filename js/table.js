
var shiki_power_chart = {
1: {1: ['Runaway', 0, 0, 0, 0, 0, 0],
    2: ['Prolong summoning', 1, 2, 3, 4, 5, 6],
    3: ['Regeneration', 1, 2, 3, 4, 5, 6],
    4: ['Ranged attack', 1, 2, 3, 4, 5, 6],
    5: ['Transmutation', 1, 2, 3, 4, 5, 6],
    6: ['Combat ability', 1, 2, 3, 4, 5, 6]},
2: {1: ['Posession', 1, 2, 3, 4, 5, 6],
    2: ['Roll again, and double the ability and cost rolled', 0, 0, 0, 0, 0],
    3: ['Poison', 1, 2, 3, 4, 5, 6],
    4: ['Flying', 1, 2, 3, 4, 5, 6],
    5: ['Posession', 1, 3, 3, 5, 5, 10],
    6: ['Shapechange', 0, 0, 0, 0, 0, 0]},
3: {1: ['Prolong summoning', 1, 3, 3, 5, 5, 10],
    2: ['Phantasm', 1, 2, 3, 4, 5, 6],
    3: ['Roll once more and stop', 0, 0, 0, 0, 0, 0],
    4: ['Poison', 1, 3, 3, 5, 5, 10],
    5: ['Regeneration', 1, 3, 3, 5, 5, 10],
    6: ['Ranged attack', 1, 3, 5, 5, 10, 15]},
4: {1: ['Shiki destroyer', 1, 2, 3, 4, 5, 6],
    2: ['Additional damage', 1, 2, 3, 4, 5, 6],
    3: ['Soulfind', 1, 3, 5, 5, 10, 15],
    4: ['The shiki becomes chimera', 0, 0, 0, 0, 0, 0],
    5: ['Gaseous form', 0, 0, 0, 0, 0, 0],
    6: ['Phantasm', 1, 1, 3, 3, 10, 10]},
5: {1: ['Explode', 1, 2, 3, 4, 5, 6],
    2: ['Flying', 1, 3, 5, 5, 10, 15],
    3: ['Shapechange', 1, 2, 3, 4, 5, 6],
    4: ['Transmutation', 1, 3, 3, 5, 5, 10],
    5: ['Roll again, and halve the ability and cost rolled', 0, 0, 0, 0, 0, 0],
    6: ['Explode', 1, 1, 3, 3, 10, 15]},
6: {1: ['Combat ability', 1, 1, 3, 3, 10, 10],
    2: ['Shiki destroyer', 1, 3, 3, 5, 5, 10],
    3: ['Gaseous form', 0, 0, 0, 0, 0, 0],
    4: ['Additional damage', 1, 3, 5, 5, 10, 15],
    5: ['Soulfind', 1, 2, 3, 4, 5, 6],
    6: ['Roll three more times and stop', 0, 0, 0, 0, 0, 0]}
};

var table1 = $('<table></table>');
table1.append($("<tr><td></td> <td>1</td> <td>2</td> <td>3</td> <td>4</td> <td>5</td> <td>6</td> </tr>"));
var i, j, sum_widths = 0, sum_heights = 0;
for ( i in shiki_power_chart) {
    var tr = $("<tr></tr>");
    tr.append($("<td>"+i+"0</td>"));
    table1.append(tr);
    for (j in shiki_power_chart[i]) {
        var pow = shiki_power_chart[i][j][0]
        var td = $("<td>"+pow+"</td>");
        tr.append(td);
        sum_widths += td.width();
    }
    sum_heights += tr.height();
}

var table2 = $('<table></table>');
table2.append($("<tr><td>Roll</td> <td>Ability</td> <td>1</td> <td>2</td> <td>3</td> <td>4</td> <td>5</td> <td>6</td> </tr>"));
var i, j;
for (i in shiki_power_chart) {
    for (j in shiki_power_chart[i]) {
        var tr = $("<tr></tr>");
        var td = $("<td>"+shiki_power_chart[i][j][0]+"</td>");
        tr.append($("<td>"+i+""+j+"</td>"));
        tr.append(td);
        if (shiki_power_chart[i][j][1]) {
            tr.append($("<td>"+shiki_power_chart[i][j][1]+"</td>"));
            tr.append($("<td>"+shiki_power_chart[i][j][2]+"</td>"));
            tr.append($("<td>"+shiki_power_chart[i][j][3]+"</td>"));
            tr.append($("<td>"+shiki_power_chart[i][j][4]+"</td>"));
            tr.append($("<td>"+shiki_power_chart[i][j][5]+"</td>"));
            tr.append($("<td>"+shiki_power_chart[i][j][6]+"</td>"));
        } else {
            td.attr('colspan', 7);
        }
        table2.append(tr);
    }
}

table1.find('tr:not(:first):odd td:not(:first-child):even').addClass('cell-group-1');
table1.find('tr:not(:first):even td:not(:first-child):odd').addClass('cell-group-1');
table1.find('tr:not(:first):odd td:not(:first-child):odd').addClass('cell-group-2');
table1.find('tr:not(:first):even td:not(:first-child):even').addClass('cell-group-2');

table1.css('display','inline-block');
table2.css('display','inline-block');
table2.css('margin-right','20px');

$('#main').append(table2);
$('#main').append(table1);





$('.die_1').each(function(index) {
    $(this).click( function() {
        $('.selected-die-1').removeClass('selected-die-1');
        $(this).addClass('selected-die-1');
    });
});
$('.die_2').each(function(index) {
    $(this).click( function() {
        $('.selected-die-2').removeClass('selected-die-2');
        $(this).addClass('selected-die-2');
    });
});
$('.die_3').each(function(index) {
    $(this).click( function() {
        $('.selected-die-3').removeClass('selected-die-3');
        $(this).addClass('selected-die-3');
    });
});
$('.die_accept').click( function() {
    check_if_die_selection_complete();
});
$('.die_roll').click( function() {
    // button.trigger("click")
    var roll = Math.floor(Math.random() * 6);
    $('.die_1').each( function(index) { if (index == roll) {
        $('.selected-die-1').removeClass('selected-die-1');
        $(this).addClass('selected-die-1');
    }});
    var roll = Math.floor(Math.random() * 6);
    $('.die_2').each( function(index) { if (index == roll) {
        $('.selected-die-2').removeClass('selected-die-2');
        $(this).addClass('selected-die-2');
    }});
    var roll = Math.floor(Math.random() * 6);
    $('.die_3').each( function(index) { if (index == roll) {
        $('.selected-die-3').removeClass('selected-die-3');
        $(this).addClass('selected-die-3');
    }});
    shiki_power_from_dice();
    update_shiki_div();
});
function select_die_button( button ) {
    "selected-die-" + $(this).attr("class").charAt($(this).attr("class").length-1);
};

function check_if_die_selection_complete() {
    if (($('.selected-die-1').length == 1) &&
        ($('.selected-die-2').length == 1) &&
        ($('.selected-die-3').length == 1)) {
        console.log( "Time to add an ability" );
        shiki_power_from_dice();
        update_shiki_div();
    }
};

var shiki_power_list = [];
var number_of_shiki_powers = 0;
var shiki_power_dict = {};
$("#wrapper").append("<div id='shiki-power-list'></div>");

function get_shiki_power( die_1, die_2, power_die ) {
    var power = {name: shiki_power_chart[die_1][die_2][0],
            level: shiki_power_chart[die_1][die_2][power_die],
            cost: 0};
    if (shiki_powers_cp_per_level.hasOwnProperty(power.name)) {
        power.cost = shiki_powers_cp_per_level[power.name];
    }
    return power;
}

var next_roll_mod = 0;

function shiki_power_from_dice() {
    number_of_shiki_powers += 1;
    var new_shiki_id = "shiki-"+number_of_shiki_powers+"";
    var die_1 = $('.selected-die-1').val();
    var die_2 = $('.selected-die-2').val();
    var die_3 = $('.selected-die-3').val();
    
    var power = get_shiki_power(die_1, die_2, die_3);
    if (next_roll_mod == 2) {
        power.level = power.level * 2;
    } else if (next_roll_mod == 5) {
        power.level = Math.ceil(power.level / 2);
    } 
    if (power.level > 0) {
        power.cost = power.level * power.cost;
    }
    
    if (die_1 == die_2 && die_2 == 2) {
        next_roll_mod = 2;
    } else if (die_1 == die_2 && die_2 == 5) {
        next_roll_mod = 5;
    } else {
        next_roll_mod = 0;
    }
    shiki_power_list.push(power);
    if (shiki_power_dict.hasOwnProperty(power.name)) {
        shiki_power_dict[power.name] += power.level;
    } else {
        shiki_power_dict[power.name] = power.level;
    }
}

function update_shiki_div() {
    $("#shiki-power-list").empty();
    
    var shiki = Shiki( shiki_power_list );
    $("#shiki-power-list").append("<p>Total shiki cost: "+shiki.getShikiCost()+"</p>");
    console.log(shiki.getShikiPowers());
    for (power in shiki_power_dict) {
        var i = 1;
        var power_div = "<div id='"+i+"'>" + 
            power + ", " + shiki_power_dict[power] + "</div>";
        $("#shiki-power-list").append(power_div);
        console.log(shiki_power_dict);
        i += 1;
    }
    
};

 function Shiki( power_list ) {
    shiki = {};
    shiki.power_list = power_list;
    shiki.getShikiCost = function() {
        var cost = 0;
        var list = this.getShikiPowers();
        for (var i=0; i<list.length; i++) {
            cost += list[i].cost;
        }
        return cost;
    }
    shiki.getShikiPowers = function() {
        var powers = [];
        for (var i=0; i<this.power_list.length; i++) {
            p = this.power_list[i];
            var found = false;
            for (var j=0; j<powers.length; j++) {
                if (powers[j].name == p.name) {
                    powers[j].level += p.level;
                    found = true;
                }
            }
            if (!found) {
                powers.push(p);
            }
        }
        return powers;
    }
    return shiki;
}

// Shiki creation points
// Creation points = Knowledge * Skill modifier
// Skill modifier = Dots - 1, where 0 or 1 dots is impossible

// Shiki ability score table
/* Creation limits: Attributes, Skills, Vitality
1-6: 1-1-2
7-12: 2-1-2
13-18: 3-2-3 
19-24: 4-2-4
25-30: 5-3-5
31-36: 6-3-6
37-42: 7-4-7
for every 6 pts over 42, +1 to Attributes & Vitality

*/

// Order of events
// choose Random creation or (Crafted creation)
// choose maximum creation points
// Roll
// Apply ability, add to current cost
// Check if over max creation points
// if not, choose to reroll
// else determine soul cost

var die_1, die_2, die_3; // die_1 is the "Tens" die, die_2 is the "ones" die, die_3 is the "level" die

/* Abilities */
/* The chart is organized like: die_1: die_2: [title, levels...] */
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
var shiki_powers_cp_per_level = {
    'Additional damage': 2,
    'Combat ability': 3,
    'Explode': 1,
    'Flying': 1,
    'Gaseous form': 3,
    'Phantasm': 3,
    'Poison': 3,
    'Posession': 3,
    'Prolong summoning': 3,
    'Ranged attack': 2,
    'Regeneration': 3,
    'Shapechange': 5,
    'Shiki destroyer': 5,
    'Soulfind': 1,
    'Transmutation': 6
};
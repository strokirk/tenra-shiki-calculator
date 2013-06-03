
$('input[name=D1]').each(function(index) {
    $(this).click( function() {
        $('.selected-die-1').removeClass('selected-die-1');
        $(this).addClass('selected-die-1');
    });
});
$('input[name=D2]').each(function(index) {
    $(this).click( function() {
        $('.selected-die-2').removeClass('selected-die-2');
        $(this).addClass('selected-die-2');
    });
});
$('input[name=D3]').each(function(index) {
    $(this).click( function() {
        $('.selected-die-3').removeClass('selected-die-3');
        $(this).addClass('selected-die-3');
    });
});
$('.die-accept').click( function() {
    check_if_die_selection_complete();
});
$('.die-roll').click( function() {
    // button.trigger("click")
    var roll = Math.floor(Math.random() * 6);
    $('input[name=D1]').each( function(index) { if (index == roll) {
        $('.selected-die-1').removeClass('selected-die-1');
        $(this).addClass('selected-die-1');
    }});
    var roll = Math.floor(Math.random() * 6);
    $('input[name=D2]').each( function(index) { if (index == roll) {
        $('.selected-die-2').removeClass('selected-die-2');
        $(this).addClass('selected-die-2');
    }});
    var roll = Math.floor(Math.random() * 6);
    $('input[name=D3]').each( function(index) { if (index == roll) {
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

var number_of_shiki_powers = 0;
var current_shiki;
$("#wrapper").append("<div id='shiki-power-list'></div>");
update_shiki_div();

function get_shiki_power( die_1, die_2, power_die ) {
    var power = {'name': shiki_power_chart[die_1][die_2][0],
            'level': shiki_power_chart[die_1][die_2][power_die],
            'cost': 0};
    if (shiki_powers_cp_per_level.hasOwnProperty(power.name)) {
        power['cost'] = shiki_powers_cp_per_level[power.name];
    }
    return power;
}

var next_roll_mod = 0;

function shiki_power_from_dice() {
    // see that there is a initialized Shiki object
    if (!current_shiki) current_shiki = new Shiki();
    
    number_of_shiki_powers += 1;
    var new_shiki_id = "shiki-"+number_of_shiki_powers+"";
    // get the die values
    var die_1 = $('.selected-die-1').val();
    var die_2 = $('.selected-die-2').val();
    var die_3 = $('.selected-die-3').val();
    var power = get_shiki_power(die_1, die_2, die_3);
    
    // special cases
    if (next_roll_mod == 2) power.level = power.level * 2; 
    else if (next_roll_mod == 5) power.level = Math.ceil(power.level / 2); 
    
    if (die_1 == die_2 && die_2 == 2) next_roll_mod = 2;
    else if (die_1 == die_2 && die_2 == 5) next_roll_mod = 5;
    else next_roll_mod = 0;
    
    current_shiki.addPower( power );
}

function update_shiki_div() {
    if (!current_shiki) current_shiki = new Shiki();
    
    var powerdiv = $("#shiki-power-list");
    powerdiv.empty();
    var ul = $('<ul>');
    
    var save_btn = $("<input id='#save-shiki' type='button' value='Save shiki'>");
    save_btn.click( save_shiki_div );
    powerdiv.append(save_btn);
    powerdiv.append("<p>Total shiki cost: "+current_shiki.getTotalCost()+"</p>");
    powerdiv.append(ul);
    
    for (var index in current_shiki.powerList) {
        var power = current_shiki.powerList[index];
        var li = $('<li>');
        if (power.cost == 0)
            li.append(power.name).addClass("danger");
        else if (power.level > 0)
            li.append(power.name+" "+power.level).prop("title",power.cost+" creation points per level");
        else
            li.append(power.name).prop("title",power.cost+" creation points");
        ul.append(li);
    }
    
};

function save_shiki_div() {
    $("#shiki-power-list").empty();
    var ul = $('<ul>');
    var list = current_shiki.getShikiPowers();
    for (var index in list) {
        var power = list[index];
        if (power.cost == 0) continue; // remove stuff like "roll again"
        
        var li = $('<li>'), text, title;
        if (power.level > 0) {
            text = power.name+" "+power.level; 
            title = power.cost+" creation points per level";
        } else {
            text = power.name; 
            title = power.cost+" creation points";
        }
        li.append(text).prop("title",title);
        ul.append(li);
    }
    var pinfo = $("<p>Creation points: "+current_shiki.getTotalCost()+"</p>");
    if (current_shiki.getTotalCost() != 0) 
        pinfo.append(", Soul cost: "+Math.ceil(current_shiki.getTotalCost()/2))
    
    var danger = [];
    if ("Runaway" in list) danger[danger.length] = "Runaway";
    if ("The shiki becomes chimera" in list) danger[danger.length] = "Chimera";
    danger = danger.join(" ");
    if (danger)
        pinfo.append(", <span class='danger'>"+danger+"</span>");
    if (current_shiki.getTotalCost() != 0) 
        pinfo.append("<br/>"+"Attributes: "+current_shiki.getAttributes()+", Skills: "+current_shiki.getSkills()+",  Vitality: "+current_shiki.getVitality())
    $("#shiki-power-list").append(pinfo).append(ul);
};

// A class to keep track of the applied shiki powers
// Saves both a list of discrete classes, and the order they were applied.
 function Shiki() {
    this.powerList = [];
    this.uniquePowerList = {};
    // add a new shiki power. Should be a {name:,level:,cost:}-style object.
    this.addPower = function(power) {
        this.powerList.push(power);
    };
    // sum the cost of shiki's powers in creation points
    this.getTotalCost = function() {
        var power, cost = 0, uniqueList = this.getShikiPowers();
        for (var power in uniqueList) {
            var p = uniqueList[power];
            if (p.cost != 0)
                cost += (p.level == 0 ? p.cost : p.level * p.cost);
        }
        return cost;
    }
    // Get a list of unique powers
    this.getShikiPowers = function() {
        var power, i, length = this.powerList.length;
        this.uniquePowerList = {};
        for (i = 0; i < length; i++) {
            power = this.powerList[i];
            if (!(power.name in this.uniquePowerList))
                this.uniquePowerList[power.name] = {name:power.name, level:power.level, 
                    cost:power.cost, totalCost:power.cost};
            else
                this.uniquePowerList[power.name].level += power.level;
            if (this.uniquePowerList[power.name].level != 0)
                this.uniquePowerList[power.name].totalCost += power.level * power.cost;
        }
        return this.uniquePowerList;
    }
    /* Shiki ability score table: 
    CP: Attributes - Skills - Vitality
    1-6:   1-1-2
    7-12:  2-1-2
    13-18: 3-2-3 
    19-24: 4-2-4
    25-30: 5-3-5
    31-36: 6-3-6
    37-42: 7-4-7
    for every 6 pts over 42, +1 to Attributes & Vitality */
    this.getAttributes = function() { 
        return Math.ceil(this.getTotalCost() / 6); 
    }
    this.getSkills = function() {
        var x = Math.ceil(this.getTotalCost() / 12); return (x > 4) ? 4 : x;
    }
    this.getVitality = function() { 
        var x = Math.ceil(this.getTotalCost() / 6); return (x < 2) ? 2 : x; 
    }
    
}

// Shiki creation points
// Creation points = Knowledge * Skill modifier
// Skill modifier = Dots - 1, where 0 or 1 dots is impossible

/* Abilities */
/* The chart is organized like: die_1: die_2: [title, levels...] */
// die_1 is the "Tens" die, die_2 is the "ones" die, die_3 is the "level" die
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
class Player {
    constructor(name, sponsor, country, state, twitter, pronoun, id) {
        this.name = name;
        this.sponsor = sponsor;
        this.country = country;
        this.state = state;
        this.twitter = twitter;
        this.pronoun = pronoun;
        this.id = id;
    }
    fullTag() {
        if (this.sponsor == "") return this.name;
        else return this.sponsor + " | " + this.name;
    }
}
class Set {
    constructor(round, player1, player2) {
        this.round = round;
        this.player1 = player1;
        this.player2 = player2;
    }
}

var fetchfirstComplete = 0;
function startup() {
    fetchFirst();
    checkFlag();

    function checkFlag() {
        if (fetchfirstComplete < 3) {
            setTimeout(checkFlag, 100);
        } else {
            fetchSecond();
            init();
        }
    }
}

var JSONtxt = {
    p1Name: "",
    p2Name: "",
    p1Sponsor: "",
    p2Sponsor: "",
    p1Score: 0,
    p2Score: 0,
    p1LoserMark: false,
    p2LoserMark: false,
    p1Flag: "",
    p2Flag: "",
    p1Twitter: "",
    p2Twitter: "",
    p1Pronoun: "",
    p2Pronoun: "",
    p1ID: "",
    p2ID: "",
    game: "Street Fighter 6",
    round: "",
}

var apiSave = {
    jsonAuto: false,
    jsonURL: "",
    startggID: "",
    startggToken: "",
    startggAuto: false,
    challongeID: "",
    challongeAPI: "",
    challongeAuto: false
}

///////////////////////////
////// Players Array //////
///////////////////////////

/*
{
    value: Player Name
    sponsor: Prefix
    flag: State / Country
}
*/
var players = {};
var sets = {};
var playersArr = [];

var flags = [];
var countries = [];
var states = [];
var countriesWithStates = ['AUS'];
var charList = [];

var rounds = [];

function fetchFirst() {
    $.getJSON('autocomplete/rounds.json', function(result) {
        $.each(result, function(i, field) {
            rounds.push(field);
        });
        fetchfirstComplete++;
    });

    $.getJSON('json/country-flags.json', function(result) {
        fetchfirstComplete++;
        $.each(result, function(k, v) {
            var val = {
                value: v,
                full: k
            }
            flags.push(val);
            countries.push(v);
        });
    });
    
    $.getJSON('json/games.json', function(result) {
        var old = false;
        var optgroup = $("<optgroup label='Old Titles'>");
        $.each(result, function(i, field) {
            if (field.Full == "Old Titles") old = true;
            else {
                if (old) {
                    optgroup.append("<option value=" + field.code + ">" + field.Full + "</option>");
                }
                else {
                    $('#game').append("<option value=" + field.code + ">" + field.Full + "</option>");
                }
            }
        });
        $('#game').append(optgroup);
        onGameChange();
        fetchfirstComplete++;
    });
}

function fetchSecond() {
    load();
    fetch();
}

function init() {

    $(".accordion").accordion({
        active: false,
        collapsible: true,
        heightStyle: "content"
    });

    $(".controlgroup").controlgroup();

    $("#ui-scaling-value").html('1x');
    $("#ui-scaling-slider").slider({
        value: 1,
        min: 0.5,
        max: 1.5,
        step: 0.125,
        slide: function(event, ui) {
            $("#ui-scaling-value").html(ui.value + 'x');
            $('html').css('font-size', ui.value + 'px');
        }
    });

    $("#settings").dialog({
        width: 300,
        show: true,
        autoOpen: false
    });

    $('#round').autocomplete({
        minLength: 0,
        source: rounds,
        select: function(event, ui) {
            $('#round').val(ui.item);
        }
    });

    TFautocomplete("p1");
    TFautocomplete("p2");

    $('.score').spinner().width('20rem');

    $(document).tooltip({
        content: function() {
            return $(this).attr('title');
        },
        position: {
            my: 'top-150%',
            at: 'top left'
        }
    });

    $('.charSelect').selectable({
        selected: function(event, ui) {
            $(ui.selected).addClass('ui-selected').siblings().removeClass('ui-selected');
        }
    });
    
}

///////////////////////////////
// TextField Auto-Completion //
///////////////////////////////

function TFautocomplete(wrap) {
    $('#' + wrap + 'Name').autocomplete({
        minLength: 1,
        source: playersArr,
        select: function(event, ui) {
            $("#" + wrap + "Name").val(ui.item.label);
            $("#" + wrap + "Sponsor").val(ui.item.sponsor);
            $("#" + wrap + "Flag").val(ui.item.flag);
            $("#" + wrap + "Flagimg").css("opacity", 0);

            if (countries.includes(ui.item.flag)) {
                $("#" + wrap + "Flagimg").attr("src", "img/flags/" + ui.item.flag + ".svg");
                $("#" + wrap + "Flagimg").css("opacity", 1);
            }

            $("#" + wrap + "State").val(ui.item.state);
            $("#" + wrap + "Twitter").val(ui.item.twitter);
            $("#" + wrap + "Pronoun").val(ui.item.pronoun);
            $("#" + wrap + "ID").html(ui.item.id);
        }
    }).autocomplete("instance")._renderItem = function(ul, item) {
        if (item.flag) {
            if (item.state && countriesWithStates.includes(item.flag)) {
                return $("<li>")
                    .append("<div><img src='img/flags/" + item.flag + ".svg' style='position: absolute; top: 5rem; width: 15rem; left: 105rem'>" +
                    "<img src='img/flags/" + item.flag + "/" + item.state + ".svg' style='position: absolute; top: 5rem; width: 15rem; left: 120rem'>" 
                    + item.value + "<br><span style='font-size: 8rem'>" + item.sponsor + "</span></div>")
                    .appendTo(ul);
            }
            return $("<li>")
                .append("<div><img src='img/flags/" + item.flag + ".svg' style='position: absolute; top: 5rem; width: 15rem; left: 120rem'>" 
                + item.value + "<br><span style='font-size: 8rem'>" + item.sponsor + "</span></div>")
                .appendTo(ul);
        } else {
            return $("<li>")
            .append("<div>" + item.value + "<br><span style='font-size: 8rem'>" + item.sponsor + "</span></div>")
                .appendTo(ul);
        }
    };

    $('#' + wrap + 'Flag').autocomplete({
        minLength: 1,
        source: flags,
        select: function(event, ui) {
            $("#" + wrap + "Flag").val(ui.item.value);
            $("#" + wrap + "Flagimg").attr("src", "img/flags/" + ui.item.value + ".svg");
            $("#" + wrap + "Flagimg").css("opacity", 1);
        }
    }).autocomplete("instance")._renderItem = function(ul, item) {
        return $("<li>")
            .append("<div><img src='img/flags/" + item.value + ".svg' style='position: absolute; top: 5rem; width: 15rem; left: 120rem'>" + item.value + "<br><span style='font-size: 8rem'>" + item.full + "</span></div>")
            .appendTo(ul);
    };
}

function reset(string) {
    string.split(',').forEach(element => {
        var name = $("#" + element);
        switch(true) {
            case name.hasClass('ui-checkboxradio') == true:
                name.prop("checked", false).checkboxradio('refresh');
                break;
            case name.hasClass('ui-spinner-input') == true:
                $("#" + element).val(0);
                break;
            case name.hasClass('countryFlag') == true:
                $("#" + element).removeAttr("src");
                $("#" + element).css('opacity', 0);
                break;
            case name.is("label") == true:
            case name.is("span") == true:
                $("#" + element).html('');
                if (element == 'p1ID') p1Player = null;
                if (element == 'p2ID') p2Player = null;
            default:
                $("#" + element).val("");
                break;
        }
    });
}

///////////////////////////
/////// SWAP BUTTON ///////
///////////////////////////

function swap(string1, string2) {
    var p1Arr = string1.split(',');
    var p2Arr = string2.split(',');
    for (var i = 0; i < p1Arr.length; i++) {
        switch(true) {
            case $("#" + p1Arr[i]).hasClass('ui-checkboxradio') == true:
                var p1checked = $("#" + p1Arr[i]).prop("checked");
                var p2checked = $("#" + p2Arr[i]).prop("checked");
                $("#" + p1Arr[i]).prop("checked", p2checked).checkboxradio('refresh');
                $("#" + p2Arr[i]).prop("checked", p1checked).checkboxradio('refresh');
                break;
            case $("#" + p1Arr[i]).hasClass('countryFlag') == true:
                var p1src = $("#" + p1Arr[i]).attr('src');
                var p1op = $("#" + p1Arr[i]).css('opacity');
                var p2src = $("#" + p2Arr[i]).attr('src');
                var p2op = $("#" + p2Arr[i]).css('opacity');

                $("#" + p1Arr[i]).attr('src', p2src);
                $("#" + p2Arr[i]).attr('src', p1src);
                $("#" + p1Arr[i]).css('opacity', p2op);
                $("#" + p2Arr[i]).css('opacity', p1op);
                break;
            case $("#" + p1Arr[i]).hasClass("dropbtn") == true:
                var p1img = $("#" + p1Arr[i]).css('background-image');
                var p1txt = $("#" + p1Arr[i]).text();
                var p2img = $("#" + p2Arr[i]).css('background-image');
                var p2txt = $("#" + p2Arr[i]).text();

                $("#" + p1Arr[i]).css('background-image', p2img);
                $("#" + p1Arr[i]).html(p2txt);
                $("#" + p2Arr[i]).css('background-image', p1img);
                $("#" + p2Arr[i]).html(p1txt);
                break;
            case $("#" + p1Arr[i]).is("label") == true:
            case $("#" + p1Arr[i]).is("span") == true:
                var temp = $('#' + p1Arr[i]).text();
                $('#' + p1Arr[i]).html($('#' + p2Arr[i]).text());
                $('#' + p2Arr[i]).html(temp);
                break;
            default:
                var temp = $("#" + p1Arr[i]).val();
                $("#" + p1Arr[i]).val($("#" + p2Arr[i]).val());
                $("#" + p2Arr[i]).val(temp);
                break;
        }
    }
}

////////////////////////////////////
// FLAG TEXTFIELD CHANGE FUNCTION //
////////////////////////////////////

function onFlagChange(wrap) {
    $("#" + wrap + "Flag").val($("#" + wrap + "Flag").val().toUpperCase());
    const val = $('#' + wrap + "Flag").val();
    if (countries.includes(val)) {
        $("#" + wrap + "Flagimg").attr('src', "img/flags/" + val + ".svg");
        $("#" + wrap + "Flagimg").css('opacity', 1);
    } else {
        $("#" + wrap + "Flagimg").css('opacity', 0);
    }
    onNameChange(wrap);
}

function onStateChange(wrap) {
    $("#" + wrap + "State").val($("#" + wrap + "State").val().toUpperCase());
    onNameChange(wrap);
}

function onNameChange(wrap) {
    $("#" + wrap + "ID").html("");
}

///////////////////////////
////// RELOAD BUTTON //////
///////////////////////////

function reload() {
    location.reload();
}

function save() {
    JSONtxt.p1Name = $("#p1Name").val();
    JSONtxt.p2Name = $("#p2Name").val();
    JSONtxt.p1Sponsor = $("#p1Sponsor").val();
    JSONtxt.p2Sponsor = $("#p2Sponsor").val();
    JSONtxt.p1Score = parseInt($("#p1Score").val());
    JSONtxt.p2Score = parseInt($("#p2Score").val());
    JSONtxt.p1LoserMark = $("#p1LoserMark").is(":checked");
    JSONtxt.p2LoserMark = $("#p2LoserMark").is(":checked");
    JSONtxt.p1Flag = $("#p1Flag").val();
    JSONtxt.p2Flag = $("#p2Flag").val();
    JSONtxt.p1Twitter = $("#p1Twitter").val();
    JSONtxt.p2Twitter = $("#p2Twitter").val();
    JSONtxt.p1Pronoun = $("#p1Pronoun").val();
    JSONtxt.p2Pronoun = $("#p2Pronoun").val();
    JSONtxt.p1ID = $('#p1ID').text();
    JSONtxt.p2ID = $('#p2ID').text();
    JSONtxt.game = $("#game option:selected").val();
    JSONtxt.round = $("#round").val();

    localStorage.setItem("JSON", JSON.stringify(JSONtxt));
    console.log(JSONtxt);
}

///////////////////////////
//////// LOAD SAVE ////////
///////////////////////////

function load() {
    $('.checkbox').checkboxradio();
    
    var data = JSON.parse(localStorage.getItem("JSON"));
    var save = JSON.parse(localStorage.getItem("API"));
    if (data !== null) {
        $("#game").val(data.game);
        $("#p1Sponsor").val(data.p1Sponsor);
        $("#p1Name").val(data.p1Name);
        $('#p1LoserMark').prop("checked", data.p1LoserMark);
        $("#p2Sponsor").val(data.p2Sponsor);
        $("#p2Name").val(data.p2Name);
        $('#p2LoserMark').prop("checked", data.p2LoserMark);
        $("#p1Score").val(data.p1Score);
        $("#p2Score").val(data.p2Score);
        $("#p1Flag").val(data.p1Flag);
        $("#p2Flag").val(data.p2Flag);
        onFlagChange('p1');
        onFlagChange('p2');
        $("#p1Twitter").val(data.p1Twitter);
        $("#p2Twitter").val(data.p2Twitter);
        $("#p1Pronoun").val(data.p1Pronoun);
        $("#p2Pronoun").val(data.p2Pronoun);
        $("#p1ID").html(data.p1ID);
        $("#p2ID").html(data.p2ID);
        $("#round").val(data.round);
        onGameChange();
    } else {
        $("#game").val('sf6');
    }

    if (save !== null) {
        $("#jsonURL").val(save.jsonURL);
        $('#startggAuto').prop("checked", save.startggAuto);
        $("#startggID").val(save.startggID);
        $("#startggToken").val(save.startggToken);
        $('#challongeAuto').prop("checked", save.challongeAuto);
        $("#challongeID").val(save.challongeID);
        $("#challongeAPI").val(save.challongeAPI);
    }
}

///////////////////////////
///// SETTING BUTTON //////
///////////////////////////

function openDialog() {
    $('#settings').dialog('open');
}

///////////////////////////
///// SET PAIR BUTTON /////
///////////////////////////

function toggleSetPair() {
    if ($("#bSetPair").is(":checked")) {
        $("#setPairedFieldset").css('opacity', 1);
        if ($("#startggAuto").is(":checked")) fetchStartggBracketList(apiSave.startggID);
        if ($("#challongeAuto").is(":checked")) fetchChallongeBracketList();
    } else {
        $("#setPairedFieldset").css('opacity', 0);
        $("#setBracket").empty();
        $("#setPool").empty();
        $("#setPaired").empty();
    }
}

function applySet() {
    var set = sets[$("#setPaired option:selected").val()];
    var p1 = set.player1;
    var p2 = set.player2;

    $("#p1Sponsor").val(p1.sponsor);
    $("#p1Name").val(p1.name);
    $("#p1Flag").val(p1.country);
    $("#p1State").val(p1.state);
    $("#p1Twitter").val(p1.twitter);
    $("#p1Pronoun").val(p1.pronoun);

    $("#p2Sponsor").val(p2.sponsor);
    $("#p2Name").val(p2.name);
    $("#p2Flag").val(p2.country);
    $("#p2State").val(p2.state);
    $("#p2Twitter").val(p2.twitter);
    $("#p2Pronoun").val(p2.pronoun)

    onFlagChange('p1');
    onFlagChange('p2');
    
    $("#p1ID").html(p1.id);
    $("#p2ID").html(p2.id);
}

///////////////////////////
/////// AUTO TOGGLE ///////
///////////////////////////

function autoToggle(wrap) {
    if (wrap == 'startgg' && $("#startggAuto").is(":checked") == true) {
        $('#challongeAuto').prop("checked", false).checkboxradio('refresh');
    }

    if (wrap == 'challonge' && $("#challongeAuto").is(":checked") == true) {
        $('#startggAuto').prop("checked", false).checkboxradio('refresh');
    }
}

///////////////////////////
// GAME CHANGE FUNCTION ///
///////////////////////////

function onGameChange() {
    $('.charSelect').empty();
    $.getJSON('json/' + $('#game option:selected').val() + '.json', function(result) {
        $.each(result, function(i, field) {
            $('.charSelect').append($('<li class="ui-state-default" value="' + field.Name + '"><img src="'+ field.img + '"></li>'));
        });
    });
}

function flagFullToValue(string) {
    for(var i = 0; i < flags.length; i++) {
        if (string == flags[i].full) {
            return flags[i].value;
        }
    }
}

/////////////////////////////
// BRACKET CHANGE FUNCTION //
/////////////////////////////

function onBracketChange() {
    if (apiSave.startggAuto) fetchStartggBracketPools($("#setBracket option:selected").attr('id'));
}

function onPoolChange() {
    if (apiSave.startggAuto) fetchStartggBracketSets($("#setPool option:selected").attr('id'));
}

///////////////////////////
//// STARTGG FUNCTIONS ////
///////////////////////////

function fetchStartgg() {
    const query = {
        query: `{
            tournament(slug: "` + apiSave.startggID + `") { participants(query: { page: 1 perPage: 200 }) { pageInfo { totalPages } } }
        }`
    }
    $.ajax({
        url: "https://api.start.gg/gql/alpha",
        data: JSON.stringify(query),
        method: "POST",
        headers: {'Authorization': 'Bearer ' + apiSave.startggToken},
        contentType: 'application/json',
        statusCode: {
            400: function() {
                notify('fetchError', "Startgg API cannot be fetched", 'red');
            }
        }
    }).done(function(json) {
        const pages = json['data']['tournament']['participants']['pageInfo']['totalPages'];
        for (var i = 1; i <= pages; i++) {
            fetchStartggPlayers(i);
        }
    })
    
}

function fetchStartggPlayers(i) {
    const parseQuery = {
        query: `{
            tournament(slug: "` + apiSave.startggID + `") { participants(query: { page: ` + i + ` perPage: 200 }) {
                nodes { id prefix gamerTag user { discriminator genderPronoun authorizations( types: TWITTER) 
                    { externalUsername } location { city state country } } } } } }`
    };
    $.ajax({
        url: "https://api.start.gg/gql/alpha",
        data: JSON.stringify(parseQuery),
        method: "POST",
        headers: {'Authorization': 'Bearer ' + apiSave.startggToken},
        contentType: 'application/json',
    }).done(function(json) {
        $.each(json['data']['tournament']['participants']['nodes'], function(i, player) {
            var id = player['id'];
            var name = player['gamerTag'];
            var sponsor = player['prefix'] == null ? "" : player['prefix'];
            var flag = "";
            var twitter = "";
            var pronoun = "";
            if (player['user']) {
                pronoun = player['user']['genderPronoun'];
                var location = player['user']['location'];
                if (location) {
                    flag = flagFullToValue([location["country"]]);
                    state = location["state"];
                }
                var authorizations = player['user']['authorizations'];
                if (authorizations) {
                    twitter = authorizations[0]['externalUsername'];
                }
            }
            var val = {
                id: id,
                value: name,
                sponsor: sponsor,
                flag: flag,
                state: state,
                twitter: twitter,
                pronoun: pronoun
            }
            playersArr.push(val);
            var player = new Player(name, sponsor, flag, state, twitter, pronoun, id);
            players[id] = player;
        });
    });
}

function fetchStartggBracketList(id) {
    const parseQuery = {
        query: `{ tournament(slug: "` + id + `") { events ( filter: { type: 1 } ) { id name videogame { displayName name } } } }`
    }
    $.ajax({
        url: "https://api.start.gg/gql/alpha",
        data: JSON.stringify(parseQuery),
        method: "POST",
        headers: {'Authorization': 'Bearer ' + apiSave.startggToken},
        contentType: 'application/json',
        statusCode: {
            400: function() {
                notify('setFetchError', "Fetch Startgg Bracket Failed", 'red');
            }
        }
    }).done(function(json) {
        $("#setBracket").empty();
        $.each(json['data']['tournament']['events'], function(i, event) {
            $("#setBracket").append($('<option>', {
                id: event['id'],
                value: event['videogame']['name'],
                text: event['name']
            }));
        });
        onBracketChange();
    });
}

function fetchStartggBracketPools(id) {
    const parseQuery = {
        query: `{ event(id: ` + id + `) { phaseGroups { id displayIdentifier phase { name } } } }`
    }
    $.ajax({
        url: "https://api.start.gg/gql/alpha",
        data: JSON.stringify(parseQuery),
        method: "POST",
        headers: {'Authorization': 'Bearer ' + apiSave.startggToken},
        contentType: 'application/json',
        statusCode: {
            400: function() {
                notify('setFetchError', "Fetch Startgg Bracket Failed", 'red');
            }
        }
    }).done(function(json) {
        $("#setPool").empty();
        $.each(json['data']['event']['phaseGroups'], function(i, pools) {
            $("#setPool").append($('<option>', {
                id: pools['id'],
                text: pools['phase']['name'] + ': Pool ' + pools['displayIdentifier']
            }));
        });
        onPoolChange();
    })
}

function fetchStartggBracketSets(id) { 
    const parseQuery = {
        query: `{ phaseGroup(id: ` + id + `) { sets(page: 1, perPage: 150, filters: { state: [1,2] hideEmpty: true }) { nodes { 
            id state fullRoundText slots { entrant { participants { id } } } } } } }`
    }
    $.ajax({
        url: "https://api.start.gg/gql/alpha",
        data: JSON.stringify(parseQuery),
        method: "POST",
        headers: {'Authorization': 'Bearer ' + apiSave.startggToken},
        contentType: 'application/json',
    }).done(function(json) {
        $("#setPaired").empty();
        sets = {};
        $.each(json['data']['phaseGroup']['sets']['nodes'], function(i, set) {
            if (set['slots'][0]['entrant'] != null && set['slots'][1]['entrant'] != null) {
                var player1 = players[set['slots'][0]['entrant']['participants'][0]['id']];
                var player2 = players[set['slots'][1]['entrant']['participants'][0]['id']];
                const p1 = player1.fullTag();
                const p2 = player2.fullTag();
                $("#setPaired").append($('<option>', {
                    value: set['id'],
                    text: set["fullRoundText"] + ": " + p1 + " - " + p2
                }));
                var setClass = new Set(set["fullRoundText"], player1, player2);
                sets[set['id']] = setClass;
            }
        });
    });
}

function fetchChallongePlayers() {
    $.getJSON("https://api.challonge.com/v1/tournaments/" + apiSave.challongeID + "/participants.json?api_key=" 
    + apiSave.challongeAPI, function(result) {
        $.each(result, function(i, player) {
            var id = player['participant']['id'];
            var name = player['participant']['display_name'];
            var sponsor = "";
            var flag = "";
            var state = "";
            var twitter = "";
            var pronoun = "";
            var id = player['participant']['id'];
            var val = {
                id: id,
                value: name,
                sponsor: sponsor,
                flag: flag,
                state: state,
                twitter: twitter,
                pronoun: pronoun
            }
            playersArr.push(val);
            var player = new Player(name, sponsor, flag, state, twitter, pronoun, id);
            players[id] = player;
        });
    });
}

function fetchChallongeBracketSets() {
    $.getJSON("https://api.challonge.com/v1/tournaments/" + apiSave.challongeID + "/matches.json?api_key=" 
    + apiSave.challongeAPI, function(result) {
        $("#setPaired").empty();
        sets = {};
        $.each(result, function(i, set) {
            if (set['match']['state'] == 'open') {
                const player1 = players[set['match']['player1_id']];
                const player2 = players[set['match']['player2_id']];
                $("#setPaired").append($('<option>', {
                    value: set['match']['id'],
                    text: set["match"]['round'] + ": " + player1.fullTag() + " - " + player2.fullTag()
                }));
                sets[set['match']['id']] = new Set(round, player1, player2);
            }
        });
    });
}

function fetchChallongeBracketList() {
    $.getJSON("https://api.challonge.com/v1/tournaments/" + apiSave.challongeID + ".json?api_key=" 
    + apiSave.challongeAPI, function(result) {
        $("#setBracket").empty();
        $("#setBracket").append($('<option>', {
            text: result['tournament']['name']
        }));
        fetchChallongeBracketSets();
    });
}

function fetch() {
    if ($("#startggAuto").is(":checked") && $("#startggID").val() == "") {
        notify('fetchError', 'Missing Startgg bracket ID', 'red');
        return;
    }
    if ($("#startggAuto").is(":checked") && $("#startggToken").val() == "") {
        notify('fetchError', 'Missing Startgg Token', 'red');
        return;
    }
    if ($("#challongeAuto").is(":checked") && $("#challongeID").val() == "") {
        notify('fetchError', 'Missing Challoge bracket ID', 'red');
        return;
    }
    if ($("#challongeAuto").is(":checked") && $("#challongeAPI").val() == "") {
        notify('fetchError', 'Missing Challonge API Token', 'red');
        return;
    }
    apiSave.jsonAuto = $("#urlAuto").is(":checked");
    apiSave.jsonUrl = $("#jsonURL").val()
    apiSave.startggID = $("#startggID").val();
    apiSave.startggToken = $("#startggToken").val();
    apiSave.startggAuto = $("#startggAuto").is(":checked");
    apiSave.challongeID = $("#challongeID").val();
    apiSave.challongeAPI = $("#challongeAPI").val();
    apiSave.challongeAuto = $("#challongeAuto").is(":checked");
    localStorage.setItem("API", JSON.stringify(apiSave));
    $("#fetchDescription").html("");

    if (apiSave.startggAuto) {
        playersArr = [];
        players = {};
        fetchStartgg();
        $("#fetchDescription").html("Start.gg: " + apiSave.startggID);
    } else if (apiSave.challongeAuto) {
        playersArr = [];
        players = {};
        fetchChallongePlayers();
        $("#fetchDescription").html("Challonge: " + apiSave.challongeID);
    } else {
        $("#fetchDescription").html("");
    }
    $("#bSetPair:checkbox").prop("checked", false).checkboxradio('refresh');
    toggleSetPair();
    TFautocomplete("p1");
    TFautocomplete("p2");
}

function notify(wrap, message, color) {
    $("#" + wrap).html(message);
    setTimeout(() => {
        $("#" + wrap).css('color', color);
        $("#" + wrap).html("");
    }, 2500);
}
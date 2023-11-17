var JSONtxt = {
    p1Name: "",
    p2Name: "",
    p1Sponsor: "",
    p2Sponsor: "",
    round: "",
    p1Flag: "",
    p2Flag: "",
    p1LoserMark: false,
    p2LoserMark: false,
    p1Score: 0,
    p2Score: 0,
    p1Twitter: "",
    p2Twitter: "",
    p1Char: "",
    p2Char: "",
    p1ID: "",
    p2ID: "",
    p1Pronoun: "",
    p2Pronoun: "",
    Game: "",
    EvtName: "",
    p1Comm: "",
    p2Comm: "",
    bracketChecked: false,
    startggToken: "",
    startggID: "",
    ChallongeAPI: "",
    ChallongeID: "",
    btmL: "",
    btmR: "",
    scaleVal: 1,
    bScoreAuto: false,
    bSetPair: false
}

var charList;
var playerList = {};
var setsList = {};
var flagJSON;
var p1Player = null;
var p2Player = null;

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
            $('#ui-scaling-value').html(ui.value + 'x');
            $('html').css('font-size', ui.value + 'px');
        }
    });

    $('#settings').dialog({
        width: 300,
        show: true,
        autoOpen: false
    });

    $('#p1Sponsor').autocomplete().width('50rem');
    $('#p1Name').autocomplete().width('110rem');
    $('#p1Flag').autocomplete().width('50rem');
    $('#p2Sponsor').autocomplete().width('50rem');
    $('#p2Name').autocomplete().width('110rem');
    $('#p2Flag').autocomplete().width('50rem');
    $("#startggToken").autocomplete().width('250rem');
    $("#challongeAPI").autocomplete().width('250rem');

    $("#p1Score").spinner().width('20rem');
    $("#p2Score").spinner().width('20rem');

    $(document).tooltip({
        content: function() {
            return $(this).attr('title');
        },
        position: {
            my: 'top-150%',
            at: 'top left'
        }
    });

    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('GET', 'https://api.github.com/repos/jokermain668/ScoreboardController/contents/json/flags.json?ref=main');
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            flagJSON = JSON.parse(atob(JSON.parse(xhr.responseText)['content']));
            storeDataList();
            loadOldStorage();
            setInterval(function() {
                // console.log(p1Player);
                // console.log(p2Player);
                if ( p1Player == undefined || $('#p1ID').html() != p1Player.id) {
                    onIDChange('p1');
                }
                if (p2Player == undefined || $('#p2ID').html() != p2Player.id) {
                    onIDChange('p2');
                }
                if ($('#bScoreAuto').is(':checked')) {
                    if (JSONtxt.p1Score != parseInt($('#p1Score').val())) {
                        JSONtxt.p1Score = parseInt($("#p1Score").val());
                        localStorage.setItem("JSON", JSON.stringify(JSONtxt));
                        console.log(localStorage.getItem("JSON"));
                    }
                    if (JSONtxt.p2Score != parseInt($('#p2Score').val())) {
                        JSONtxt.p2Score = parseInt($("#p2Score").val());
                        localStorage.setItem("JSON", JSON.stringify(JSONtxt));
                        console.log(localStorage.getItem("JSON"));
                    }
                }
            }, 200);
            setInterval(function() {
                if ($('#bSetPair').is(':checked')) {
                    fetchBracket();
                }
            }, 1000);
        }
    }

    function storeDataList() {
        var nameArr = [];
        var subArr = [];
        for (let i = 0; i < flagJSON.length; i++) {
            nameArr.push(flagJSON[i]["Code"]);
            subArr.push(flagJSON[i]["Name"]);
        }
        autocomplete(document.getElementById('p1Flag'), nameArr, subArr, null, null);
        autocomplete(document.getElementById('p2Flag'), nameArr, subArr, null, null);
    }
}

function loadOldStorage() {
    var data = JSON.parse(localStorage.getItem("JSON"));
    console.log(data);
    $("#game").val(data.Game)

    $("#p1Sponsor").val(data.p1Sponsor);
    $("#p1Name").val(data.p1Name);
    $('#p1LoserMark').val(data.p1LoserMark);
    $('#p1ID').html(data.p1ID);
    $("#p2Sponsor").val(data.p2Sponsor);
    $("#p2Name").val(data.p2Name);
    $('#p2LoserMark').val(data.p2LoserMark);
    $('#p2ID').html(data.p2ID);
    $("#p1Score").val(data.p1Score);
    $("#p2Score").val(data.p2Score);
    $("#mText2").val(data.round);
    $("#p1Flag").val(data.p1Flag);
    $("#p2Flag").val(data.p2Flag);
    flagChange("p1Flag");
    flagChange("p2Flag");

    $("#p1Pronoun").val(data.p1Pronoun);
    $("#p2Pronoun").val(data.p2Pronoun);
    $("#p1Twitter").val(data.p1Twitter);
    $("#p2Twitter").val(data.p2Twitter);

    $("#mTxt1").val(data.EvtName);
    $("#c1Name").val(data.p1Comm);
    $("#c2Name").val(data.p2Comm);

    $("#bracketChecked").prop("checked", data.bracketChecked);
    $("#startggToken").val(data.startggToken);
    $("#startggID").val(data.startggID);
    $("#challongeAPI").val(data.ChallongeAPI);
    $("#challongeID").val(data.ChallongeID);
    $("#btmTxt").val(data.btmTxt);

    $("#ui-scaling-slider").slider('value', data.scaleVal);
    $("#ui-scaling-value").html(data.scaleVal + 'x');
    $('html').css('font-size', data.scaleVal + 'px');
    $('#bScoreAuto').prop('checked', data.bScoreAuto);
    $('#bSetPair').prop('checked', data.bSetPair);
    
    gameChange();
    save();
}

function gameChange() {
    var game = $('#game option:selected').text();
    switch(game) {
        case 'Street Fighter 6':
            setCharList('sf6.json');
            break;
        case 'Tekken 7':
            setCharList('tekken.json');
            break;
        case "Guilty Gear Xrd REV 2":
            setCharList('ggxrd.json');
            break;
        case "King of Fighters XV":
            setCharList('kofxv.json');
            break;
        case "Granblue Fantasy: Versus":
            setCharList('gbvs.json');
            break;
        case "BlazBlue: Central Fiction":
            setCharList('bbcf.json');
            break;
        case "Under Night In-Birth Exe:Late[cl-r]":
            setCharList('uniclr.json');
            break;
        default:
            setCharList('ggst.json');
            break;
    }
    allocateBracket();
}

//
// Player Functions and Class
//

class Player {
    constructor(id, name, sponsor, state, twitter, pronoun) {
        this.id = id;
        this.name = name;
        this.sponsor = sponsor;
        this.state = state;
        this.twitter = twitter;
        this.pronoun = pronoun;
    }
    fullname() {
        if (this.sponsor == '') return this.name;
        else return this.sponsor + ' | ' + this.name;
    }

}

function setPlayerList() {
    playerList = {};
    if ($('#bracketChecked').is(':checked')) {
        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType('application/json');
        xhr.open('GET', 'https://api.challonge.com/v1/tournaments/' + $('#challongeID').val() + '/participants.json?api_key=vZkf4w2kmecEnQq4f8f01ZAadsJVihCMlrkuSWtc')
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                var data = JSON.parse(xhr.responseText);
                var nameArr = [];
                var subArr = [];
                var idArr = [];
                for (let i = 0; i < Object.keys(data).length; i++) {
                    var playerData = data[i]['participant'];
                    var player = new Player(playerData['id'], playerData['display_name'], '', '', '', '');
                    playerList[playerData['id']] = player;
                    nameArr.push(playerData['display_name']);
                    subArr.push('');
                    idArr.push(playerData['id']);
                }
                autocomplete(document.getElementById('p1Name'), nameArr, subArr, idArr, document.getElementById('p1ID'));
                autocomplete(document.getElementById('p2Name'), nameArr, subArr, idArr, document.getElementById('p2ID'));

                console.log('playerList');
                console.log(playerList);
                p1Player = playerList[$('#p1ID').html()];
                p2Player = playerList[$('#p2ID').html()];
            }
        }
        
    } else {
        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType('application/json');
        const parseQuery = {
            query: `query {
                event(id: ` + $('#startggID').val() + `) {
                    entrants(query: {
                        page: 1
                        perPage: 500
                    }) {
                        nodes {
                            participants {
                                id
                                gamerTag
                                prefix
                                user {
                                    location {
                                        country
                                        state
                                    }
                                    authorizations(
                                        types: TWITTER
                                    ) {
                                        externalUsername
                                    }
                                    genderPronoun
                                }
                            }
                        }
                    }
                }
            }`
        }
        xhr.open('POST', 'https://api.start.gg/gql/alpha', true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + $('#startggToken').val());
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify(parseQuery));
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                var data = JSON.parse(xhr.responseText)['data']['event']['entrants']['nodes'];
                var nameArr = [];
                var subArr = [];
                var idArr = [];
                for (let i = 0; i < Object.keys(data).length; i++) {
                    var playerData = data[i]['participants'][0];
                    var sponsor = playerData['prefix'] == null ? '' : playerData['prefix'];
                    var state = '';
                    var twitter = '';
                    var pronoun = '';
                    if (playerData['user']['location']['country'] != null) {
                        if (playerData['user']['location']['country'] == "Australia" && playerData['user']['location']['state'] != null) {
                            state = playerData['user']['location']['state'];
                        } else {
                            for (let i = 0; i < flagJSON.length; i++) {
                                if (flagJSON[i]['Name'] == playerData['user']['location']['country']) {
                                    state = flagJSON[i]['Code'];
                                }
                            }
                        }
                    }
                    if (playerData['user']['authorizations'] != null) {
                        twitter = playerData['user']['authorizations'][0]['externalUsername'];
                    }
                    if (playerData['user']['genderPronoun'] != null) {
                        pronoun = playerData['user']['genderPronoun'];
                    }
                    var player = new Player(playerData['id'], playerData['gamerTag'], sponsor, state, twitter, pronoun);
                    playerList[player['id']] = player;
                    nameArr.push(playerData['gamerTag']);
                    subArr.push(sponsor);
                    idArr.push(playerData['id']);
                }
                console.log('playerList');
                console.log(playerList);
                autocomplete(document.getElementById('p1Name'), nameArr, subArr, idArr, document.getElementById('p1ID'));
                autocomplete(document.getElementById('p2Name'), nameArr, subArr, idArr, document.getElementById('p2ID'));

                p1Player = playerList[$('#p1ID').html()];
                p2Player = playerList[$('#p2ID').html()];
            }
            
        }
    }
}

//
// Character Functions
//

function setCharList(url) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('GET', 'https://api.github.com/repos/jokermain668/ScoreboardController/contents/json/' + url + '?ref=main');
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            charList = JSON.parse(atob(JSON.parse(xhr.responseText)['content']));
            charDump('p1Char');
            charDump('p2Char');
        }
    }
}

function charDump(string) {
    $('#' + string + 'DD').find('a').remove();
    changeChar(string, charList[0]['Name']);
    for (let i = 0; i < charList.length; i++) {
        var name = charList[i]['Name'];
        var img = charList[i]['img'];
        $('#' + string + 'DD').append(`<a style="background-image: url(${img})" onclick="changeChar('${string}', '${name}')">${name}</a>`);
    }
}


//
// On Change Functions //
//

function changeChar(id, char) {
    $('#' + id).html(char);
    var index = 0;
    for (let i = 0; i < charList.length; i++) {
        if (charList[i]['Name'] == char) {
            index = i;
            break;
        }
    }
    $("#" + id).attr('style', 'background-image: url('+ charList[index]['img'] + ')');
}

function flagChange(string) {
    setTimeout(() => {
        var value = $("#" + string).val();
        for (var i = 0; i < flagJSON.length; i++) {
            if (flagJSON[i]["Code"] == value) {
                $('#' + string + 'img').css('opacity', 1);
                $('#' + string + 'img').attr('src', 'https://raw.githubusercontent.com/JokerMain668/ScoreboardController/main/img/flags/' + flagJSON[i]["img"] + '.svg');
                break;
            } else {
                $('#' + string + 'img').css('opacity', 0);
            }
        }
    }, 100);
}

function onIDChange(string) {
    var player = playerList[$('#' + string + 'ID').html()];

    if (string == 'p1') p1Player = player;
    else p2Player = player;

    if (player != null) {
        $('#' + string + 'Sponsor').val(player.sponsor);
        $('#' + string + 'Flag').val(player.state);
        $('#' + string + 'Twitter').val(player.twitter);
        $('#' + string + 'Pronoun').val(player.pronoun);
        flagChange(string + 'Flag');

        if ($('#bSetPair').is(':checked')) {
            var altPlayer = playerList[setsList[$('#' + string + 'ID').text()]];
            if (altPlayer != null) {
                var wrap = string == 'p1' ? 'p2' : 'p1';
                $('#' + wrap + 'ID').html(altPlayer.id);
                $('#' + wrap + 'Name').val(altPlayer.name);
                $('#' + wrap + 'Sponsor').val(altPlayer.sponsor);
                $('#' + wrap + 'Flag').val(altPlayer.state);
                $('#' + wrap + 'Twitter').val(altPlayer.twitter);
                $('#' + wrap + 'Pronoun').val(altPlayer.pronoun);
                flagChange(wrap + 'Flag');

                if (wrap == 'p1') p1Player = altPlayer;
                else p2Player = altPlayer;
            }
        }
    }
}

function onNameChange(string) {
    if ($('#' + string + 'Name').val() != playerList[$('#' + string + 'ID').html()].name) {
        $('#' + string + 'ID').html('');
    }
    // if (string == 'p1') p1Player = null;
    // else p2Player = null;
}

//
// Save //
//

function save() {
    JSONtxt.p1Name = $("#p1Name").val();
    JSONtxt.p2Name = $("#p2Name").val();
    JSONtxt.p1Sponsor = $("#p1Sponsor").val();
    JSONtxt.p2Sponsor = $("#p2Sponsor").val();
    JSONtxt.p1Flag = $("#p1Flag").val();
    JSONtxt.p2Flag = $("#p2Flag").val();
    JSONtxt.p1Score = parseInt($("#p1Score").val());
    JSONtxt.p2Score = parseInt($("#p2Score").val());
    JSONtxt.p1LoserMark = $("#p1LoserMark").is(':checked');
    JSONtxt.p2LoserMark = $("#p2LoserMark").is(':checked');
    JSONtxt.p1ID = $("#p1ID").text();
    JSONtxt.p2ID = $("#p2ID").text();
    JSONtxt.p1Twitter = $("#p1Twitter").val();
    JSONtxt.p2Twitter = $("#p2Twitter").val();
    JSONtxt.p1Char = $("#p1Char").text();
    JSONtxt.p2Char = $('#p2Char').text();
    JSONtxt.p1Pronoun = $("#p1Pronoun").val();
    JSONtxt.p2Pronoun = $("#p2Pronoun").val();
    JSONtxt.round = $("#mText2 option:selected").text();
    JSONtxt.Game = $("#game option:selected").text();
    JSONtxt.EvtName = $("#mTxt1").val();
    JSONtxt.p1Comm = $("#c1Name").val()
    JSONtxt.p2Comm = $("#c2Name").val();
    JSONtxt.bracketChecked = $("#bracketChecked").is(':checked');
    JSONtxt.startggToken = $("#startggToken").val();
    JSONtxt.startggID = $("#startggID").val();
    JSONtxt.ChallongeAPI = $("#challongeAPI").val();
    JSONtxt.ChallongeID = $("#challongeID").val();
    JSONtxt.btmL = $("#btmL").val();
    JSONtxt.btmR = $("#btmR").val();
    JSONtxt.scaleVal = $('#ui-scaling-slider').slider('option', 'value');
    JSONtxt.bScoreAuto = $('#bScoreAuto').is(':checked');
    JSONtxt.bSetPair = $('#bSetPair').is(':checked');
    
    
    localStorage.setItem("JSON", JSON.stringify(JSONtxt));
    console.log(localStorage.getItem("JSON"));
}

//
// Basic Button Functions //
//

function openDialog() {
    $('#settings').dialog('open');
}

function expand() {
    $('#lssc-panels').find('.accordion').accordion('option', 'active', 0);
}

function collapse() {
    $('#lssc-panels').find('.accordion').accordion('option', 'active', false);
}

function reload() {
    location.reload();
}

function swapVal(string1, string2) {
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
                var temp = $('#' + p1Arr[i]).text();
                $('#' + p1Arr[i]).html($('#' + p2Arr[i]).text());
                $('#' + p2Arr[i]).html(temp);
                var temp = p1Player;
                p1Player = p2Player
                p2Player = temp;
                break;
            default:
                var temp = $("#" + p1Arr[i]).val();
                $("#" + p1Arr[i]).val($("#" + p2Arr[i]).val());
                $("#" + p2Arr[i]).val(temp);
                break;
        }
    }
}


function resetVal(string) {
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
                $("#" + element).html('');
                if (element == 'p1ID') p1Player = null;
                if (element == 'p2ID') p2Player = null;
            default:
                $("#" + element).val("");
                break;
        }
    });
}

//
// DropDown Functions //
//

function toggleDD(string) {
    document.getElementById(string).classList.toggle("show");
}

function filterFunction(dropdown, input) {
    var input, filter, ul, li, a;
    input = document.getElementById(input);
    filter = input.value.toUpperCase();
    div = document.getElementById(dropdown);
    a = div.getElementsByTagName("a");
    for (var i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn') && !event.target.matches('.searchbar')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

//
// Set Pairing Function and Class
//

function fetchBracket() {
    if ($('#bracketChecked').is(':checked')) {
        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType('application/json');
        xhr.open('GET', 'https://api.challonge.com/v1/tournaments/' + $('#challongeID').val() + '/matches.json?api_key=' + $('#challongeAPI').val())
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                setsList = {};
                var data = JSON.parse(xhr.responseText);
                for (let i = 0; i < data.length; i++) {
                    if (data[i]['match']['state'] == 'open') {
                        var setData = data[i]['match'];
                        var p1 = setData['player1_id'];
                        var p2 = setData['player2_id'];
                        setsList[p1] = p2;
                        setsList[p2] = p1;
                    }
                }
                //console.log(setsList);
            }
        }
    } else {
        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType('application/json');
        const parseQuery = {
            query: `query {
                event(id: ` + $('#startggID').val() + `) {
                    sets(
                        page: 1
                        perPage: 500
                    ) {
                        nodes {
                            slots {
                                entrant {
                                    participants {
                                        id
                                        gamerTag
                                    }
                                }
                            }
                            completedAt
                        }
                    }
                }
            }`
        }
        xhr.open('POST', 'https://api.start.gg/gql/alpha', true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + $('#startggToken').val());
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify(parseQuery));
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                setsList = {};
                var data = JSON.parse(xhr.responseText)['data']['event']['sets']['nodes'];
                for (let i = 0; i < data.length; i++) {
                    var setData = data[i];
                    if (setData['completedAt'] == null && setData['slots'][0]['entrant'] != null && setData['slots'][1]['entrant'] != null) {
                        var p1 = setData['slots'][0]['entrant']['participants'][0]['id'];
                        var p2 = setData['slots'][1]['entrant']['participants'][0]['id'];
                        setsList[p1] = p2
                        setsList[p2] = p1;
                    }
                }
                //console.log(setsList);
            }
        }
    }
}

//
// AutoComplete Function //
//

function autocomplete(inp, nameArr, subArr, idArr, idp) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < Math.min(nameArr.length, subArr.length); i++) {
            var name = nameArr[i];
            var prefix = subArr[i];
            var id = '';
            if (idArr != null) id = idArr[i];
            /*check if the item starts with the same letters as the text field value:*/
            if (name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + name.substr(0, val.length) + "</strong>";
                b.innerHTML += name.substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value=\"" + name + "\">";
                b.innerHTML += "<span style='text-align: right; font-size: 8rem'>" + prefix + "</span>";
                b.innerHTML += "<span style='opacity: 0'>" + id + "</span>"
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    e.preventDefault();
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    if (idp != null) idp.innerHTML = this.getElementsByTagName("span")[1].innerHTML;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                    inp.blur();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            //e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) {
                    x[currentFocus].click();
                }
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
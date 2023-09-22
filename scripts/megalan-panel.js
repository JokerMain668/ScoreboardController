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
    p1Pronoun: "",
    p2Pronoun: "",
    Game: "",
    bottomLeft: "",
    bottomRight: "",
    EvtName: "",
    p1Comm: "",
    p2Comm: ""
}

var bracketID = {
    "Street Fighter 6": "970274",
    "Guilty Gear -Strive-": "970269",
    "Tekken 7": "970268",
    "Granblue Fantasy: Versus": "970272",
    "King of Fighters XV": "970270",
    "BlazBlue: Central Fiction": "970277",
    "Guilty Gear Xrd REV 2": "970273",
    "Under Night In-Birth Exe:Late[cl-r]": "970271",
    "Super Smash Bros. Ultimate": "970275"
}

var charList;
var playerJSON;

function init() {
    // Apply accordion class from JQuery UI
    $(".accordion").accordion({
        active: false,
        collapsible: true,
        heightStyle: "content"
    });

    // Apply controlgroup class from JQuery UI
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
    })

    resizeTF();

    $(document).tooltip({
        content: function() { return $(this).attr('title'); },
        position: { my: "top-150%", at: "top left" },
    });

    setPlayerList();

    var xhr = new XMLHttpRequest();

    xhr.overrideMimeType('application/json');
    
    xhr.open('GET', 'https://api.github.com/repos/jokermain668/ScoreboardController/contents/json/flags.json?ref=main');
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            scObj = JSON.parse(atob(JSON.parse(xhr.responseText)['content']));
            console.log(scObj);
            storeDataList();
            loadOldStorage();
        }
    }
    
    function storeDataList() {
        var nameArr = [];
        var subArr = [];
        for (var i = 0; i < scObj.length; i++) {
            nameArr.push(scObj[i]["Code"]);
            subArr.push(scObj[i]["Name"]);
        }
        autocomplete(document.getElementById("p1Flag"), nameArr, subArr);
        autocomplete(document.getElementById("p2Flag"), nameArr, subArr);
    }
}

function charDump(string) {
    $("#" + string + "DD").find('a').remove();
    changeChar(string, charList[0]["Name"]);

    for (var i = 0; i < charList.length; i++) {
        var name = charList[i]["Name"];
        var img = charList[i]['img'];
        
        $("#" + string + "DD").append(`<a style="background-image: url(${img})" onclick="changeChar('${string}', '${name}')">${name}</a>`);
    }
}

function resizeTF() {
    // Resize textfields in scoreboard
    $('#p1Sponsor').autocomplete().width('50rem');
    $('#p1Name').autocomplete().width('110rem');
    $('#p1Flag').autocomplete().width('50rem');
    $('#p2Sponsor').autocomplete().width('50rem');
    $('#p2Name').autocomplete().width('110rem');
    $('#p2Flag').autocomplete().width('50rem');

    $( "#p1Score" ).spinner().width('20rem');
    $( "#p2Score" ).spinner().width('20rem');
}

function loadOldStorage() {
    var data = JSON.parse(localStorage.getItem("JSON"));
    console.log(data);
    $("#game").val(data.Game);
    gameChange();

    $("#p1Sponsor").val(data.p1Sponsor);
    $("#p1Name").val(data.p1Name);
    $("#p2Sponsor").val(data.p2Sponsor);
    $("#p2Name").val(data.p2Name);
    $("#p1Score").val(data.p1Score);
    $("#p2Score").val(data.p2Score);
    $("#mText2").val(data.round);
    $("#p1Flag").val(data.p1Flag);
    $("#p2Flag").val(data.p2Flag);
    flagChange("p1Flag");
    flagChange("p2Flag");
    
    /* Bugged for some reason
    $("#p2LoserMark").prop("checked", false);
    console.log($("#p2LoserMark").is(":checked"));
    */

    $("#p1Pronoun").val(data.p1Pronoun);
    $("#p2Pronoun").val(data.p2Pronoun);
    $("#p1Twitter").val(data.p1Twitter);
    $("#p2Twitter").val(data.p2Twitter);

    setTimeout(() => {
        changeChar('p1Char', data.p1Char);
        changeChar('p2Char', data.p2Char);
    }, 500);

    $("#mTxt1").val(data.EvtName);
    $("#bottomLeft").val(data.bottomLeft);
    $("#bottomRight").val(data.bottomRight);
    $("#c1Name").val(data.p1Comm);
    $("#c2Name").val(data.p2Comm);
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
            default:
                $("#" + element).val("");
                break;
        }
    });
}

function gameChange() {
    var game = $("#game option:selected").text();
    switch(game) {
        case "Street Fighter 6":
            setCharList('sf6.json');
            break;
        case "Tekken 7":
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
    setPlayerList();
}

function setCharList(url) {
    var vhr = new XMLHttpRequest();
    vhr.overrideMimeType('application/json');
    vhr.open('GET', 'https://api.github.com/repos/jokermain668/ScoreboardController/contents/json/' + url + '?ref=main');
    vhr.send();
    vhr.onreadystatechange = function() {
        if (vhr.readyState === 4) {
            charList = JSON.parse(atob(JSON.parse(vhr.responseText)['content']));
            charDump("p1Char");
            charDump("p2Char");
        }
    }
}

function setPlayerList() {
    var vhr = new XMLHttpRequest();
    vhr.overrideMimeType('application/json');
    /*
    var id = bracketID[$('#game option:selected').text()];
    const parseQuery = {
        query: `query {
            event(id: ` + id + `) {
                id
                name
                entrants(query: {
                    page: 1
                    perPage: 500
                }) {
                    nodes {
                        id
                        participants {
                            id
                            prefix
                            gamerTag
                        }
                    }
                }
            }
        }`
    }
    vhr.open('POST', "https://api.start.gg/gql/alpha", true);
    vhr.setRequestHeader('Authorization', 'Bearer 6a31e52afed0b3ddc06ed3db049ef03a');
    vhr.setRequestHeader('Content-type', 'application/json');
    vhr.send(JSON.stringify(parseQuery));
    vhr.onreadystatechange = function() {
        if (vhr.readyState === 4) {
            playerJSON = JSON.parse(vhr.responseText)['data']['event']['entrants']['nodes'];
            //console.log(playerJSON);
            var nameArr = [];
            var subArr = [];
            for (var i = 0; i < Object.keys(playerJSON).length; i++) {
                nameArr.push(playerJSON[i]['participants'][0]['gamerTag']);
                var prefix = playerJSON[i]["participants"][0]["prefix"] == "" || playerJSON[i]["participants"][0]["prefix"] == null ? 
                    "" : playerJSON[i]["participants"][0]["prefix"];
                subArr.push(prefix);
            }
            autocomplete(document.getElementById("p1Name"), nameArr, subArr);
            autocomplete(document.getElementById("p2Name"), nameArr, subArr);
        }
    }
    */
    vhr.overrideMimeType('application/json')
    vhr.open('GET', 'https://api.github.com/repos/jokermain668/ScoreboardController/contents/json/ggst-players.json?ref=main');
    vhr.send();
    vhr.onreadystatechange = function() {
        if (vhr.readyState === 4) {
            playerJSON = JSON.parse(atob(JSON.parse(vhr.responseText)['content']));
            console.log(playerJSON);
            var nameArr = [];
            var subArr = [];
            for (var i = 0; i < Object.keys(playerJSON).length; i++) {
                nameArr.push(playerJSON[i]['Player']);
                var prefix = playerJSON[i]["Sponsor"] == null ? 
                "" : playerJSON[i]["Sponsor"];
                subArr.push(prefix);
            }
            autocomplete(document.getElementById("p1Name"), nameArr, subArr);
            autocomplete(document.getElementById("p2Name"), nameArr, subArr);
        }
    }
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
            default:
                var temp = $("#" + p1Arr[i]).val();
                $("#" + p1Arr[i]).val($("#" + p2Arr[i]).val());
                $("#" + p2Arr[i]).val(temp);
                break;
        }
    }
}

function flagChange(string) {
    var value = $("#" + string).val();
    for (var i = 0; i < scObj.length; i++) {
        if (scObj[i]["Code"] == value) {
            $('#' + string + 'img').css('opacity', 1);
            $('#' + string + 'img').attr('src', 'img/flags/' + scObj[i]["img"] + '.svg');
            break;
        }
        $('#' + string + 'img').css('opacity', 0);
        $('#' + string + 'img').attr('src', '');
    }
}

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

function changeChar(id, char) {
    $("#" + id).html(char);
    var index = 0;
    for (var i = 0; i < charList.length; i++) {
        if (charList[i]["Name"] == char) {
            index = i;
            break;
        }
    }
    $("#" + id).attr('style', 'background-image: url('+ charList[index]['img'] + ')');
}

function onNameChange(string) {
    
    setTimeout(() => {
        var name = $("#" + string + "Name").val();
        for (var i = 0; i < playerJSON.length; i++) {
            /*
            if (playerJSON[i]["participants"][0]["gamerTag"] == name) {
                var prefix = playerJSON[i]["participants"][0]["prefix"];
                $("#" + string + "Sponsor").val(prefix);
            }
            */
            if (playerJSON[i]["Player"] == name) {
                var prefix = playerJSON[i]["Sponsor"] == null ? "" : playerJSON[i]["Sponsor"];
                $("#" + string + "Sponsor").val(prefix);
                $("#" + string + "Flag").val(playerJSON[i]["State"]);
                flagChange(string + 'Flag');
                if (playerJSON[i]["Main"] != null) changeChar(string + 'Char', playerJSON[i]["Main"]);
                $("#" + string + "Twitter").val(playerJSON[i]["Twitter"]);
            }
        }
    }, 100);
}

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
    JSONtxt.p1Twitter = $("#p1Twitter").val();
    JSONtxt.p2Twitter = $("#p2Twitter").val();
    JSONtxt.p1Char = $("#p1Char").text();
    JSONtxt.p2Char = $('#p2Char').text();
    JSONtxt.p1Pronoun = $("#p1Pronoun").val();
    JSONtxt.p2Pronoun = $("#p2Pronoun").val();
    JSONtxt.round = $("#mText2 option:selected").text();
    JSONtxt.Game = $("#game option:selected").text();
    JSONtxt.bottomLeft = $("#bottomLeft").val();
    JSONtxt.bottomRight = $("#bottomRight").val()
    JSONtxt.EvtName = $("#mTxt1").val();
    JSONtxt.p1Comm = $("#c1Name").val()
    JSONtxt.p2Comm = $("#c2Name").val();
    
    localStorage.setItem("JSON", JSON.stringify(JSONtxt));
    console.log(localStorage.getItem("JSON"));
}
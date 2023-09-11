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
    startggToken: "",
}
function init() {
    // Apply accordion class from JQuery UI
    $(".accordion").accordion({
        active: false,
        collapsible: true,
        heightStyle: "content"
    });

    // Apply controlgroup class from JQuery UI
    $(".controlgroup").controlgroup();

    resizeTF();

    $(document).tooltip({
        content: function() { return $(this).attr('title'); },
        position: { my: "top-150%", at: "top left" },
    });

    var xhr = new XMLHttpRequest();
    var vhr = new XMLHttpRequest();

    xhr.overrideMimeType('application/json');
    vhr.overrideMimeType('application/json');
    
    xhr.open('GET', 'https://api.github.com/repos/jokermain668/ScoreboardController/contents/flags.json?ref=main');
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            scObj = JSON.parse(atob(JSON.parse(xhr.responseText)['content']));
            //console.log(scObj);
            storeDataList();
        }
    }

    vhr.open('GET', 'https://api.github.com/repos/jokermain668/ScoreboardController/contents/ggst.json?ref=main');
    vhr.send();
    vhr.onreadystatechange = function() {
        if (vhr.readyState === 4) {
            ggst = JSON.parse(atob(JSON.parse(vhr.responseText)['content']));
            console.log(ggst);
            charDump("p1Char");
            charDump("p2Char");
        }
    }

    function storeDataList() {
        for (var i = 0; i < scObj.length; i++) {
            var code = scObj[i]["Code"];
            var name = scObj[i]["Name"];

            $('#Flags').append(`<option value="${code}">${name}</option>`);
        }
    }

    function charDump(string) {
        for (var i = 0; i < ggst.length; i++) {
            var name = ggst[i]["Full"];
            var img = ggst[i]['img'];
            
            $("#" + string + "DD").append(`<a style="background-image: url(img/ggst/${img}.jpg);" onclick="changeChar('${string}', '${name}', ${i})">${name}</a>`);
        }
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

function changeChar(id, char, index) {
    console.log(char + ", " + index);
    $("#" + id).html(char);
    $("#" + id).attr('style', 'background-image: url(img/ggst/' + ggst[index]['img'] + '.jpg)');
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
    JSONtxt.startggToken = $("#startggToken").val();
    
    localStorage.setItem("JSON", JSON.stringify(JSONtxt));
    console.log(localStorage.getItem("JSON"));
}
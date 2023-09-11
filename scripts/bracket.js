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
window.onload = function() {
    var xhr = new XMLHttpRequest();
    var url = "https://api.start.gg/gql/alpha";
    var setsList = [];
    var animating = true;
    var json = JSON.parse(localStorage.getItem("JSON"));
    var token = '6a31e52afed0b3ddc06ed3db049ef03a';
    var startggID = bracketID[json.Game];

    var scObj;
    xhr.overrideMimeType('application/json');

    parseJSON();

    function parseJSON() {
        if (xhr.readyState === 4) {
            scObj = JSON.parse(xhr.responseText)['data']['event']['sets']['nodes'];
            console.log(scObj);
            setsList = [];
            for (let i = 0; i < scObj.length; i++) {
                var displayScore = (scObj[i]['displayScore'] == "DQ" || scObj[i]['displayScore'] == null) ? ["",""] : scObj[i]['displayScore'].split(" - ");
                var player1 = (scObj[i]['slots'][0]['entrant'] == null) ? "" : scObj[i]['slots'][0]['entrant']['name'];
                var player2 = (scObj[i]['slots'][1]['entrant'] == null) ? "" : scObj[i]['slots'][1]['entrant']['name'];
                
                var set = new Set(scObj[i]['round'], player1, player2, displayScore[0].slice(-1), displayScore[1].slice(-1), scObj[i]['fullRoundText']); //e.g. (-7, Spon1 | Player1, Player2, 1, 3)
                setsList.push(set);
            }
            bracket();
        }
    }
    
    function pollJSON() {
        const parseQuery = {
            query: `query {
                event(id: ` + startggID + `) {
                    id
                    name
                    sets(
                        perPage: 300
                        sortType: STANDARD
                    ) {
                        pageInfo {
                        total
                    }
                    nodes {
                        id
                        slots {
                            id
                            entrant {
                                id
                                name
                                }
                            }
                            displayScore
                            fullRoundText
                            round
                        }
                    }
                }
            }`
        }
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify(parseQuery));
    }

    setInterval(function() {
        pollJSON();
    }, 2000);

    xhr.onreadystatechange = parseJSON;

    function bracket() {
        //var rounds = ["Winners Semi-Final", "Winners Final", ""]
        var wsSets = [];
        var wfSet;
        var ltSets = [];
        var lqSets = [];
        var lsSet;
        var lfSet;
        var gfSets = [];
        //var imgArr = ['ws', 'lt', 'wf', 'lq', 'gf', 'ls', 'gfr', 'lf'];
        var wrapperArr = ['ws10', 'ws11', 'ws20', 'ws21', 'lt10', 'lt11', 'lt20', 'lt21', 'wf0', 'wf1', 'lq10', 'lq11',
        'lq20', 'lq21', 'gf0', 'gf1', 'ls0', 'ls1', 'gf20', 'gf21', 'lf0', 'lf1'];
        //var wrapArr = ['winnerSemi', 'loserTop8', 'winnerFinal', 'loserQuarter', 'grandFinal', 'loserSemi',
        //'grandFinalReset', 'loserFinal'];

        getrdNums();
        if (animating == true) {
            if (wsSets[0] != null) htmlInput('ws1', wsSets[0]);
            if (wsSets[1] != null) htmlInput('ws2', wsSets[1]);
            if (ltSets[0] != null) htmlInput('lt1', ltSets[0]);
            if (ltSets[1] != null) htmlInput('lt2', ltSets[1]);
            if (wfSet != null) htmlInput('wf', wfSet);
            if (lqSets[0] != null) htmlInput('lq1', lqSets[0]);
            if (lqSets[1] != null) htmlInput('lq2', lqSets[1]);
            if (lsSet != null) htmlInput('ls', lsSet);
            if (lfSet != null) htmlInput('lf', lfSet);
            if (gfSets[0] != null) htmlInput('gf1', gfSets[0]);
            if (gfSets[1] != null) htmlInput('gf2', gfSets[1]);

            for (let i = 0; i < wrapperArr.length; i++) {
                resize($('#' + wrapperArr[i] + 'wrapper'), '+9px');
            }

            animating = false;
        } else {
            if (wsSets[0] != null) updateInfo('ws1', wsSets[0]);
            if (wsSets[1] != null) updateInfo('ws2', wsSets[1]);
            if (ltSets[0] != null) updateInfo('lt1', ltSets[0]);
            if (ltSets[1] != null) updateInfo('lt2', ltSets[1]);
            if (wfSet != null) updateInfo('wf', wfSet);
            if (lqSets[0] != null) updateInfo('lq1', lqSets[0]);
            if (lqSets[1] != null) updateInfo('lq2', lqSets[1]);
            if (gfSets[0] != null) updateInfo('gf1', gfSets[0]);
            if (lsSet != null) updateInfo('ls', lsSet);
            if (gfSets[1] != null)updateInfo('gf2', gfSets[1]);
            if (lfSet != null) updateInfo('lf', lfSet);
            if (JSON.parse(localStorage.getItem("JSON")).Game != json.Game) {
                location.reload();
            }
        }
        
        function htmlInput(wrap, set) {
            $('#' + wrap + '0Name').html(set.Player1);
            $('#' + wrap + '1Name').html(set.Player2);
            $('#' + wrap + '0score').html(set.score1);
            $('#' + wrap + '1score').html(set.score2);

        }
        function getrdNums() {
            var gfrd = setsList[0].roundNum;
            var lfrd;

            for (let i = 0; i < setsList.length; i++) {
                if (setsList[i].roundName == "Grand Final") {
                    gfrd = setsList[i].roundNum;
                }
                if (setsList[i].roundName == "Losers Final") {
                    lfrd = setsList[i].roundNum;
                }
            }

            for (let i = 0; i < setsList.length; i++) {
                switch (setsList[i].roundNum) {
                    case gfrd - 2:
                        if (gfrd - 2 > 0) {
                            wsSets.push(setsList[i]);
                        }
                        break;
                    case gfrd - 1:
                        if (gfrd - 1 > 0) {
                            wfSet = setsList[i];
                        }
                        break;
                    case lfrd + 3:
                        if (lfrd + 3 < 0) {
                            ltSets.push(setsList[i]);
                        }
                        break;
                    case lfrd + 2:
                        if (lfrd + 2 < 0) {
                            lqSets.push(setsList[i]);
                        }
                        break;
                    case lfrd + 1:
                        if (lfrd + 1 < 0) {
                            lsSet = setsList[i];
                        }
                        break;
                    case lfrd:
                        if (lfrd < 0) {
                            lfSet = setsList[i];
                        }
                        break;
                    case gfrd:
                        gfSets.push(setsList[i]);
                        break;
                }
            }
        }

        function updateInfo(wrap, set) {
            if ($('#' + wrap + '0Name').text() != set.Player1) {
                gsap.to('#'  + wrap + '0wrapper', 0.5, {css: {opacity: 0}, ease: Quad.easeOut, onComplete: function() {
                    $('#'  + wrap + '0Name').html(set.Player1);
                    $('#' + wrap + '0wrapper').css('font-size', '35px');
                    $('#' + wrap + '0wrapper').css('top', '0px');
                    resize($('#' + wrap + '0wrapper'), '+1px');
                    gsap.to('#'  + wrap + '0wrapper', 0.5, {css: {opacity: 1}, ease: Quad.easeOut});
                }});
            }
            if ($('#'  + wrap + '0score').text() != set.score1) {
                gsap.to('#'  + wrap + '0score', 0.5, {css: {opacity: 0}, ease: Quad.easeOut, onComplete: function() {
                    $('#'  + wrap + '0score').html(set.score1);
                    $('#'  + wrap + '0score').css('font-size', '50px');
                    gsap.to('#'  + wrap + '0score', 0.5, {css: {opacity: 1}, ease: Quad.easeOut});
                }});
            }
            if ($('#'  + wrap + '1Name').text() != set.Player2) {
                gsap.to('#'  + wrap + '1wrapper', 0.5, {css: {opacity: 0}, ease: Quad.easeOut, onComplete: function() {
                    $('#'  + wrap + '1Name').html(set.Player2);
                    $('#'  + wrap + '1wrapper').css('font-size', '35px');
                    $('#'  + wrap + '1wrapper').css('top', '0px');
                    resize($('#'  + wrap + '1wrapper'), '+1px');
                    gsap.to('#'  + wrap + '1wrapper', 0.5, {css: {opacity: 1}, ease: Quad.easeOut});
                }});
            }
            if ($('#'  + wrap + '1score').text() != set.score2) {
                gsap.to('#'  + wrap + '1score', 0.5, {css: {opacity: 0}, ease: Quad.easeOut, onComplete: function() {
                    $('#'  + wrap + '1score').html(set.score2);
                    $('#'  + wrap + '1score').css('font-size', '50px');
                    gsap.to('#'  + wrap + '1score', 0.5, {css: {opacity: 1}, ease: Quad.easeOut});
                }});
            }
        }
    }
    
    class Set {
        constructor(roundNum, Player1, Player2, score1, score2, roundName) {
            this.roundNum = roundNum;
            this.Player1 = Player1;
            this.Player2 = Player2;
            this.score1 = score1;
            this.score2 = score2;
            this.roundName = roundName;
        }
    }

    function resize(Wrap, size) {
        Wrap.each(function(i, Wrap) {
            while (Wrap.scrollWidth > Wrap.offsetWidth || Wrap.scrollHeight > Wrap.offsetHeight) {
                var newFontSize = (parseFloat($(Wrap).css('font-size').slice(0, -2)) * .75) + 'px';
                $(Wrap).css('font-size', newFontSize);
                $(Wrap).css('top', size);
            }
        })
    }
}
window.onload = function() {
    var scObj;
    var animating = true;
    
    function pollJSON() {
        scObj = JSON.parse(localStorage.getItem("JSON"));
        console.log(scObj);
        camOverlay();
    }

    setInterval(function() {
        pollJSON();
    }, 1000);

    function camOverlay() {
        var title = scObj.EvtName;
        var game = scObj.Game;
        var p1Name = scObj.p1Name;
        var p2Name = scObj.p2Name;
        var p1Spon = scObj.p1Sponsor;
        var p2Spon = scObj.p2Sponsor;

        if (animating == true) {
            $('#title').html(title);
            $('#location').html(location);
            $('#game').html(game);
            $('#Spon1').html(p1Spon);
            $('#Spon2').html(p2Spon);
            $('#p1Name').html(p1Name);
            $('#p2Name').html(p2Name);

            gsap.set("#title", {css:{x: '+50px', opacity: 0}});
            gsap.set("#subtitle", {css:{x: '+50px', opacity: 0}});
            gsap.set('#leftPlayer', {css:{x: '-50px', opacity: 0}});
            gsap.set('#rightPlayer', {css:{x: '+50px', opacity: 0}});

            gsap.to('#title', .8, {css:{x: '+0px', opacity: 1}, ease: Quad.easeOut, delay: 0.5});
            gsap.to('#subtitle', .8, {css:{x: '+0px', opacity: 1}, ease: Quad.easeOut, delay: 0.8});
            gsap.to('#leftPlayer', .8, {css:{x: '+0px', opacity: 1}, ease: Quad.easeOut, delay: 1.3});
            gsap.to('#rightPlayer', .8, {css:{x: '+0px', opacity: 1}, ease: Quad.easeOut, delay: 1.3});
            animating = false;
        } else {
            if (animating == false) {
                switch (true) {
                    case $('#title').text() != title:
                        gsap.to('#title', .8, {css:{x: '+50px', opacity: 0}, ease: Quad.easeOut, delay: 0, onComplete: function() {
                            $('#title').html(title);
                            gsap.to('#title', .8, {css:{x: '+0px', opacity: 1}, ease: Quad.easeOut, delay: 0});
                        }});
                        break;
                    case $('#game').text() != game:
                        gsap.to('#subtitle', .8, {css:{x: '+50px', opacity: 0}, ease: Quad.easeOut, delay: 0, onComplete: function() {
                            $('#game').html(game);
                            gsap.to('#subtitle', .8, {css:{x: '+0px', opacity: 1}, ease: Quad.easeOut, delay: 0});
                        }});
                        break;
                    case $('#p1Name').text() != p1Name:
                    case $('#Spon1').text() != p1Spon:
                        gsap.to('#leftPlayer', .8, {css:{x: '-50px', opacity: 0}, ease: Quad.easeOut, delay: 0, onComplete: function() {
                            $('#Spon1').html(p1Spon);
                            $('#p1Name').html(p1Name);
                            gsap.to('#leftPlayer', .8, {css:{x: '+0px', opacity: 1}, ease: Quad.easeOut, delay: 0});
                        }});
                        break;
                    case $('#p2Name').text() != p2Name:
                    case $('#Spon2').text() != p2Spon:
                        gsap.to('#rightPlayer', .8, {css:{x: '+50px', opacity: 0}, ease: Quad.easeOut, delay: 0, onComplete: function() {
                            $('#Spon2').html(p2Spon);
                            $('#p2Name').html(p2Name);
                            gsap.to('#rightPlayer', .8, {css:{x: '+0px', opacity: 1}, ease: Quad.easeOut, delay: 0});
                        }});
                        break;
                }
            }
        }
    }
}
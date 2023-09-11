window.onload = function() {
    gsap.registerPlugin(MotionPathPlugin);
    var scObj;
    var animating = true;
    var p1LoserHold;
    var p2LoserHold;

    function pollJSON() {
        scObj = JSON.parse(localStorage.getItem("JSON"));
        console.log(scObj);
        scoreboard();
    }

    setInterval(function() {
        pollJSON();
    }, 1000);

    function scoreboard() {
        var p1Name = scObj.p1Name;
        var p2Name = scObj.p2Name;
        var p1Sponsor = scObj.p1Sponsor;
        var p2Sponsor = scObj.p2Sponsor;
        var round = scObj.round;
        var p1Loser = scObj.p1Loser;
        var p2Loser = scObj.p2Loser;
        var p1Score = scObj.p1Score;
        var p2Score = scObj.p2Score;
        var bottomLeft = scObj.bottomLeft;
        var bottomRight = scObj.bottomRight;

        if (animating == true) {
            $("#p1Name").html(p1Name);
            $("#p2Name").html(p2Name);
            $("#p1Sponsor").html(p1Sponsor);
            $("#p2Sponsor").html(p2Sponsor);
            $("#p1Score").html(p1Score);
            $("#p2Score").html(p2Score);
            $("#round").html(round);
            $("#bottomLeft").html(bottomLeft);
            $("#bottomRight").html(bottomRight);

            p1LoserHold = p1Loser;
            p2LoserHold = p2Loser;

            var loserArr = loserFunc(p1Loser, p2Loser);

            $("#p1Loser").html(loserArr[0]);
            $("#p2Loser").html(loserArr[1]);

            resize($('#p1Wrapper'), '+=1px');
            resize($('#p2Wrapper'), '+=1px');
            resize($('#round'), '+=0.7px');

            gsap.set("#top", {y: "-50px", opacity: 0});
            gsap.set("#bottom", {y: "+50px", opacity: 0});
            gsap.set(".scores", {opacity: 0});
            gsap.set(".bottom_wrappers", {y: "+50px", opacity: 0});
            gsap.set('#p1Wrapper', {x: "+200px", opacity: 0});
            gsap.set('#p2Wrapper', {x: "-50px", opacity: 0});
            gsap.set('#rdWrapper', {y: "-50px", opacity: 0});
            gsap.set('#p1svg', {x: "+350px", width: 80, opacity: 0});
            gsap.set('#p2svg', {x: "-350px", width: 80, opacity: 0});

            gsap.to("#top", .8, {y: "0px", opacity: 1, ease: "power1.out"});
            gsap.to("#bottom", .8, {y: "0px", opacity: 1, ease: "power1.out", delay: .5});
            gsap.to("#p1Wrapper", .8, {x: "0px", opacity: 1, ease: "power1.out", delay: .8});
            gsap.to("#p2Wrapper", .8, {x: "0px", opacity: 1, ease: "power1.out", delay: .8});
            gsap.to("#rdWrapper", .8, {y: "0px", opacity: 1, ease: "power1.out"});
            gsap.to(".scores", .8, {opacity: 1, ease: "power1.out", delay: .8});
            gsap.to(".bottom_wrappers", .8, {y: "0px", opacity: 1, ease: "power1.out", delay: .5});
            gsap.to("#p1svg", 1.6, {x: "0px", opacity: 1, width: 5, ease: "power4.out", delay: 1});
            gsap.to("#p2svg", 1.6, {x: "0px", opacity: 1, width: 5, ease: "power4.out", delay: 1});

            animating = false;
        } else {
            if (animating == false) {
                switch (true) {
                    case $('#p1Score').text() != p1Score:
                        gsap.to('#p1Score', .3, {css:{opacity: 0}, ease: Quad.easeOut, delay: 0, onComplete: function() {
                            gsap.set("#p1Score", {css:{y: "+0px", opacity: 0}});
                            $('#p1Score').html(p1Score);
                            gsap.to('#p1Score', .3, {css:{y: '0px', opacity: 1}, ease:Quad.easeOut, delay: 0});
                        }});
                        break;
                    case $('#p2Score').text() != p2Score:
                        gsap.to('#p2Score', .3, {css:{opacity: 0}, ease: Quad.easeOut, delay: 0, onComplete: function() {
                            gsap.set("#p2Score", {css:{y: "+0px", opacity: 0}});
                            $('#p2Score').html(p2Score);
                            gsap.to('#p2Score', .3, {css:{y: '0px', opacity: 1}, ease:Quad.easeOut, delay: 0});
                        }});
                        break;
                    case $('#p1Name').text() != p1Name:
                    case $('#p1Sponsor').text() != p1Sponsor:
                        gsap.to('#p1Score', .5, {css:{x: "-50px", opacity: 0}, ease: Quad.easeOut, delay: 0});
                        gsap.to('#p1Wrapper', .5, {css:{x: "-50px", opacity: 0}, ease: Quad.easeOut, delay: 0, onComplete: function() {
                            $('#p1Wrapper').css('font-size', '38px');
                            $('#p1Wrapper').css('top', '-6px');
                            $('#p1Sponsor').html(p1Sponsor);
                            $('#p1Name').html(p1Name);
                            $('#p1Score').html(p1Score);
                            gsap.to('#p1Wrapper', .5, {css:{x: "+0px", opacity: 1}, ease: Quad.easeOut, delay: 0});
                            gsap.to('#p1Score', .5, {css:{x: "0px", opacity: 1}, ease: Quad.easeOut, delay: 0});
                        }});
                        break;
                    case $('#p2Name').text() != p2Name:
                    case $('#p2Sponsor').text() != p2Sponsor:
                        gsap.to('#p2Score', .5, {css:{x: "+50px", opacity: 0}, ease: Quad.easeOut, delay: 0});
                        gsap.to('#p2Wrapper', .5, {css:{x: "50px", opacity: 0}, ease: Quad.easeOut, delay: 0, onComplete: function() {
                            $('#p2Wrapper').css('font-size', '38px');
                            $('#p2Wrapper').css('top', '-6px');
                            $('#p2Sponsor').html(p2Sponsor);
                            $('#p2Name').html(p2Name);
                            $('#p2Score').html(p2Score);
                            gsap.to('#p2Wrapper', .5, {css:{x: "+0px", opacity: 1}, ease: Quad.easeOut, delay: 0});
                            gsap.to('#p2Score', .5, {css:{x: "0px", opacity: 1}, ease: Quad.easeOut, delay: 0});
                        }});
                        break;
                    case $('#round').text() != round:
                        gsap.to('#rdWrapper', .5, {css:{y: "-20px", opacity: 0}, ease: Quad.easeOut, delay: 0, onComplete: function() {
                            $('#rdWrapper').css('font-size', '28px');
                            $('#rdWrapper').css('top', '-5px');
                            $('#round').html(round);
                            gsap.to('#rdWrapper', .5, {css:{y: "+0px", opacity: 1}, ease: Quad.easeOut, delay: 0});
                        }});
                        break;
                    case p1LoserHold != p1Loser:
                    case p2LoserHold != p2Loser:
                        gsap.to('#p1Score', .5, {css:{x: "-50px", opacity: 0}, ease: Quad.easeOut, delay: 0});
                        gsap.to('#p1Wrapper', .5, {css:{x: "-50px", opacity: 0}, ease: Quad.easeOut, delay: 0, onComplete: function() {
                            $('#p1Wrapper').css('font-size', '38px');
                            $('#p1Wrapper').css('top', '-6px');
                            $('#p1Sponsor').html(p1Sponsor);
                            $('#p1Name').html(p1Name);
                            $('#p1Score').html(p1Score);
                            $('#p1Loser').html(loserFunc(p1Loser, p2Loser)[0]);
                            gsap.to('#p1Wrapper', .5, {css:{x: "+0px", opacity: 1}, ease: Quad.easeOut, delay: 0});
                            gsap.to('#p1Score', .5, {css:{x: "0px", opacity: 1}, ease: Quad.easeOut, delay: 0});
                        }});
                        gsap.to('#p2Score', .5, {css:{x: "+50px", opacity: 0}, ease: Quad.easeOut, delay: 0});
                        gsap.to('#p2Wrapper', .5, {css:{x: "50px", opacity: 0}, ease: Quad.easeOut, delay: 0, onComplete: function() {
                            $('#p2Wrapper').css('font-size', '38px');
                            $('#p2Wrapper').css('top', '-6px');
                            $('#p2Sponsor').html(p2Sponsor);
                            $('#p2Name').html(p2Name);
                            $('#p2Score').html(p2Score);
                            $('#p2Loser').html(loserFunc(p1Loser, p2Loser)[1]);
                            gsap.to('#p2Wrapper', .5, {css:{x: "+0px", opacity: 1}, ease: Quad.easeOut, delay: 0});
                            gsap.to('#p2Score', .5, {css:{x: "0px", opacity: 1}, ease: Quad.easeOut, delay: 0});
                        }});
                        p1LoserHold = p1Loser;
                        p2LoserHold = p2Loser;
                        break;
                    case $('#bottomLeft').text() != bottomLeft:
                        gsap.to('#bottomLeft', .5, {x: "-50px", opacity: 0, ease: "power1.out", onComplete: function() {
                            $('#bottomLeft').html(bottomLeft);
                            gsap.to("#bottomLeft", .5, {x: "0px", opacity: 1, ease: "power1.out"});
                        }});
                        break;
                    case $('#bottomRight').text() != bottomRight:
                        gsap.to('#bottomRight', .5, {x: "+50px", opacity: 0, ease: "power1.out", onComplete: function() {
                            $('#bottomRight').html(bottomRight);
                            gsap.to("#bottomRight", .5, {x: "0px", opacity: 1, ease: "power1.out"});
                        }});
                        break;
                }
            }
        }
    }
}

function resize(Wrap, size) {
    Wrap.each(function(i, Wrap) {
        while (Wrap.scrollWidth > Wrap.offsetWidth || Wrap.scrollHeight > Wrap.offsetHeight) {
            var newFontSize = (parseFloat($(Wrap).css('font-size').slice(0, -2)) * .95) + 'px';
            $(Wrap).css('font-size', newFontSize);
            $(Wrap).css('top', size);
        }
    })
}

function loserFunc(p1loser, p2loser) {
    if (p1loser == true && p2loser == true) {
        return [' (L)', ' (L)'];
    }
    else if (p1loser == false && p2loser == true) {
        return [' (W)', ' (L)'];
    }
    else if (p1loser == true && p2loser == false) {
        return [' (L)', ' (W)'];
    } else {
        return ['', ''];
    }
}
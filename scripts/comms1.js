window.onload = function() {
    var scObj;
    var animating = true;
    
    function pollJSON() {
        scObj = JSON.parse(localStorage.getItem("JSON"));
        console.log(scObj);
        comms();
    }

    setInterval(function() {
        pollJSON();
    }, 1000);

    function comms() {
        var comm1 = scObj.p1Comm;
        var comm2 = scObj.p2Comm;
        
        if (animating == true) {
            $('#c1Name').html(comm1);
            $('#c2Name').html(comm2);

            gsap.set('#commDouble', {css:{opacity: 0}});
            gsap.to('#commDouble', .4, {css:{opacity: 1}, ease:Quad.easeOut, delay: 1});

            resize($('#c1Wrapper'), '+=1.5px');
            resize($('#c2Wrapper'), '+=1.5px');

            gsap.set('#c1Wrapper', {css:{x: '+20px', opacity: 0}});
            gsap.set('#c2Wrapper', {css:{x: '-20px', opacity: 0}});

            gsap.to('#c1Wrapper', .4, {css:{x: '+0px', opacity: 1}, ease:Quad.easeOut, delay: 2});
            gsap.to('#c2Wrapper', .4, {css:{x: '+0px', opacity: 1}, ease:Quad.easeOut, delay: 2});

            animating = false;
        } else {
            if (animating == false) {
                switch (true) {
                    case $('#c1Name').text() != comm1:
                        gsap.to('#c1Wrapper', .4, {css:{x: '+20px', opacity: 0}, ease: Quad.easeOut, delay: 0, onComplete: function() {
                            $('#c1Name').html(comm1);
                            $('#c1Wrapper').css('font-size', '60px');
                            $('#c1Wrapper').css('top', '925px');
                            gsap.to('#c1Wrapper', .4, {css:{x: '+0px', opacity: 1}, ease:Quad.easeOut, delay: 0.4});
                        }});
                        break;
                    case $('#c2Name').text() != comm2:
                        gsap.to('#c2Wrapper', .4, {css:{x: '-20px', opacity: 0}, ease: Quad.easeOut, delay: 0, onComplete: function() {
                            $('#c2Name').html(comm2);
                            $('#c2Wrapper').css('font-size', '60px');
                            $('#c2Wrapper').css('top', '925px');
                            gsap.to('#c2Wrapper', .4, {css:{x: '+0px', opacity: 1}, ease:Quad.easeOut, delay: 0.4});
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
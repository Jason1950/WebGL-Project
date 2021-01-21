(function() {
    
    var filename = 'https://tympanus.net/codrops/adpacks/demoad.css?' + new Date().getTime();
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
    document.getElementsByTagName("head")[0].appendChild(fileref);

    let cdaSpots = ['ad1','ad2'];
    let cdaSpot = cdaSpots[Math.floor(Math.random() * cdaSpots.length)];

    switch (cdaSpot) {
        case "ad1":
            var cdaLink = 'https://ad.doubleclick.net/ddm/clk/485056538;291073416;m';
            var cdaImg = 'https://tympanus.net/codrops/wp-content/banners/mailchimp_demo.png';
            var cdaImgAlt = 'Mailchimp';
            var cdaText = "Create an effective campaign and grow sales using insights on what people are more likely to buy next.";
            break;
        case "ad2":
            var cdaLink = 'https://ad.doubleclick.net/ddm/clk/485058722;291073419;m';
            var cdaImg = 'https://tympanus.net/codrops/wp-content/banners/mailchimp_demo.png';
            var cdaImgAlt = 'Mailchimp';
            var cdaText = "Elevate all your marketing with Mailchimp Smarts - everything from planning and design, to execution and analysis.";
            break;
        case "ad3":
            var cdaLink = 'https://ad.doubleclick.net/ddm/trackclk/N718679.452584BUYSELLADS.COM/B23601142.286416854;dc_trk_aid=480171160;dc_trk_cid=140351232;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;gdpr=${GDPR};gdpr_consent=${GDPR_CONSENT_755}';
            var cdaImg = 'https://tympanus.net/codrops/wp-content/uploads/2020/11/Squarespace300.jpg';
            var cdaImgAlt = 'Squarespace';
            var cdaText = "Beautiful website templates for Creative Entrepreneurs";
            break;
        case "ad4":
            var cdaLink = 'https://ad.doubleclick.net/ddm/trackclk/N1224323.3091281BUYSELLADS/B24576799.286056056;dc_trk_aid=480019649;dc_trk_cid=140342740;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;gdpr=${GDPR};gdpr_consent=${GDPR_CONSENT_755}';
            var cdaImg = 'https://tympanus.net/codrops/wp-content/banners/mailchimp_demo.png';
            var cdaImgAlt = 'Mailchimp';
            var cdaText = "Create an effective campaign and grow sales using insights on what people are more likely to buy next.";
            break;
        case "ad5":
            var cdaLink = 'https://srv.buysellads.com/ads/long/x/THB2FF4XTTTTTT63F42HOTTTTTTVXKABZATTTTTTN3JQYUYTTTTTTBDW5JYFC5JGHRSU5R752QENB7J5K2UNBZSK5TUUC7ZWHMBUTZZ2KHUC47SHHMENA732537CORDHK2B4BYZE53NCPZZ6KMSCLYSH5KNN4R325RUU6B7GFRBUVSPX52UUPAIDKWONCSS65QUUTA7C5MBCBUS2KMLCLRZ2FMLCLASE2JEULQIM5JNMOYS32MYC4BZF2YON57Z5KM7C4S3252BUTADG5QB4KRZW2MGNCSS55JLNAR3RCVYD6K32C6Y4BKJYZRUCORBXK2UNVAIG537LBASQKJLN6YZL';
            var cdaImg = 'https://tympanus.net/codrops/wp-content/uploads/2020/11/jamf300-1-e1604254069903.jpg';
            var cdaImgAlt = 'Jamf';
            var cdaText = "No IT? No problem! Jamf Now takes the fuss out of managing your company's Apple devices.";
            break;
        default:
            var cdaLink = 'https://www.elegantthemes.com/affiliates/idevaffiliate.php?id=17972_5_1_16';
            var cdaImg = 'https://tympanus.net/codrops/wp-content/banners/Divi_Carbon.jpg';
            var cdaImgAlt = 'Divi';
            var cdaText = "From our sponsor: Divi is more than just a WordPress theme, it's a completely new website building platform. Try it.";
    }

    var cda = document.createElement('div');
    cda.id = 'cdawrap';
    cda.style.display = 'none';
    cda.innerHTML = '<a href="'+cdaLink+'" class="carbon-img" target="_blank" rel="noopener"><img src="'+cdaImg+'" alt="'+cdaImgAlt+'" border="0" height="100" width="130"></a><a href="'+cdaLink+'" class="carbon-text" target="_blank" rel="noopener">'+cdaText+'</a><div class="cda-footer"><a class="carbon-poweredby" href="https://tympanus.net/codrops/advertise/" target="_blank" rel="noopener">Become a sponsor</a><span class="cda-remove" id="cda-remove">Close</span></div>';
    document.getElementsByTagName('body')[0].appendChild(cda);

    setTimeout(function() {
        cda.style.display = 'block';
    }, 1000);

    document.getElementById('cda-remove').addEventListener('click', function(e) {
        cda.style.display = 'none';
        e.preventDefault();
    });
    
})();
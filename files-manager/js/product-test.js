let dataProduct;
(()=>{
    imgCarrusel()    
})()
// IMAGEN PRINCIPAL PRODUCTO

function imgCarrusel(){
    const listImg = $(".thumbs a");
    for (let i = 0; i < listImg.length; i++) {
        $(".gallery-thumbs .swiper-wrapper").append('<div class="swiper-slide"><img src="'+listImg.eq(i).attr("rel")+'"/></div>');
        $(".gallery-prod .swiper-wrapper").append('<div class="swiper-slide"><img src="'+listImg.eq(i).attr("zoom")+'" data-magnify-src="'+listImg.eq(i).attr("zoom")+'"/></div>');
    }
    $(".swiper-container.gallery-prod").append('<div class="cant-fotos bg-gris3 color-violeta1"><strong>'+listImg.length+' FOTOS</strong></div>')

    const galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        slidesPerView: 3,
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        breakpoints:{
            1024: {
                direction: 'vertical',
                slidesPerView: 4,
                freeMode: false,
            },

            768: {
                direction: 'horizontal',
                slidesPerView: 4,
                freeMode: false,
            }


        
        }
    });
    const galleryTop = new Swiper('.gallery-prod', {
        spaceBetween: 10,
        navigation: {
            nextEl: '.gallery-prod .swiper-button-next',
            prevEl: '.gallery-prod .swiper-button-prev',
        },
        thumbs: {
            swiper: galleryThumbs,
        }
    });

    if ($(window).width() >= 768){
        $(".gallery-prod img").magnify();
    }
}

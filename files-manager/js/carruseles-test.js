(()=>{
    setCarruselProd()
  })()
  
  function setCarruselProd(){
    const carruselProd = $(".carrusel-prod")
    if(carruselProd.length){
        const cantCarruseles = carruselProd.length;
        for (let i = 0; i < cantCarruseles; i++) {
            const carrusel = carruselProd.eq(i)
            carruselInjection(carrusel);
            carruselType(carrusel);
            carruselImg(carrusel);
        }
    }
  }
  function carruselInjection(carrusel){
    const listaProduct = carrusel.find(".prateleira .vitrina");
  
    for (let i = 0; i < listaProduct.length; i++) {
        let $this = listaProduct.eq(i).parent();
        carrusel.find(".swiper-wrapper").append(
            '<div class="swiper-slide">'+$this.html()+'</div>'  // Agregar cada producto al carrusel
        );
    }
  
  }
  function carruselImg(carrusel){
    console.log(carrusel)
    console.log(carrusel.find(".box-banner"))
    const boxBanner = carrusel.find(".box-banner")
    console.log(boxBanner)
    carrusel.find(".redirect").html(boxBanner)
  }
  function carruselType(carrusel){
    console.log(carrusel)
    console.log()
    if(carrusel.hasClass("type-1")){
        new Swiper('.carrusel-prod.type-1 .swiper-container',{
            spaceBetween: 20,
            slidesPerView: 'auto',
            loop: false,
            freeMode: true,
            navigation: {
                nextEl: null,
                prevEl: null,
            },
            // autoplay: {
            //     delay: 3200,
            //     disableOnInteraction: false,
            // },
            breakpoints: {
                768: {
                    slidesPerView: 7,
                    freeMode: false,
                    navigation: {
                        nextEl: '.carrusel-prod .swiper-button-next',
                        prevEl: '.carrusel-prod .swiper-button-prev',
                    },
                },
            }
        });
    }else{
      new Swiper('.carrusel-prod.type-2 .swiper-container',{
        spaceBetween: 20,
        slidesPerView: 'auto',
        loop: false,
        freeMode: true,
        navigation: {
            nextEl: null,
            prevEl: null,
        },
        // autoplay: {
        //     delay: 3200,
        //     disableOnInteraction: false,
        // },
        breakpoints: {
            768: {
                slidesPerView: 3,
                freeMode: false,
                navigation: {
                    nextEl: '.carrusel-prod .swiper-button-next',
                    prevEl: '.carrusel-prod .swiper-button-prev',
                },
            },
        }
    });
    }
  }
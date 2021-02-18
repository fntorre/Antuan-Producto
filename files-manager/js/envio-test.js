$(window).on("load", function(){    
	$("#btnFreteSimulacao").on("click", function(){
    	console.log("se calculara el costo de envio");
        setTimeout(function() {
            $('.freight-values').html(function () {
                return $(this).html().replace(/entrega/g,'entrega estimada').replace(/para el CP/g,'días para el CP'); 
                    });
                }, 3000);
            });
        });
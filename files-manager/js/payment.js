$(document).ready(function(){
    getOtherPayment()
})

function getOtherPayment(){
    const msj = $(".see-other-payment-method-link").attr("onclick");
    const end = msj.indexOf("FormaPagamento")-3;
    const start = msj.indexOf("https");
    const url = msj.substring(start,end);
    $.ajax({
        url: url,
        method:"GET",
        success:function(page){
            setOtherPayment(page);
        },
        error:function(data){
            console.log(data);
        }
    });
}

function setOtherPayment(page){
    (new Promise((res,rej)=>{
        // Copiar tablas que ya estan creadas
        const listTarCred = $(page).find("#ddlCartao option");
        for (let i = 0; i < listTarCred.length; i++) {
            const $this = listTarCred.eq(i);
            const nomTar = $this.html().toLowerCase().replace(/\s/g,"");
            console.log(nomTar)
            $("#content-other-payment .tarjetas-credito .list").append('<div class="tar '+nomTar+'" nomtar="'+nomTar+'"></div>');
    
            $("#content-other-payment").append(
                '<div class="t-op" nomtar="'+nomTar+'">'+
                    '<div class="volver hidden-md hidden-lg">'+
                        '<div class="'+nomTar+'"></div>'+
                    '</div>'+
                    '<table id="'+nomTar+'"></table>'+
                '</div>'
            );
            const valueTar = $this.val();
            $("table#"+nomTar).replaceWith($(page).find("#tbl"+valueTar));
            traducirTablas("#tbl"+valueTar);
        }
    
        // Crear tablas de datos sueltos
        const otherListTarCred = $(page).find(".custom");
        let otherTar = "a";
        for (let k = 0; k < otherListTarCred.length; k++) {
            const $this = otherListTarCred.eq(k);
            const nomTar =  $this.find("#ltlBoletoTextoWrapper").html()
                                .replace(/à vista| vezes sem juros| vezes com juros/g,"")
                                .replace(/\d/g,"")
                                .replace(/\s/g,"")
                                .toLowerCase();
            
            const cuota =   $this.find("#ltlBoletoTextoWrapper").html()
                                .replace(/à vista/g,"un pago")
                                .replace(/vezes sem juros/g,'cuotas <span class="hasntInteres">sin interés</span>')
                                .replace(/vezes com juros/g,"cuotas con interés");

            const valorCuota = $this.find("#ltlPrecoWrapper").html().replace(/R/g,"");

            if(otherTar != nomTar){
                otherTar = nomTar
                // Se agrega la tarjeta a la lista
                $("#content-other-payment .tarjetas-credito .list").append('<div class="tar '+nomTar+'" nomtar="'+nomTar+'"></div>');
    
                // Se agrega el content de la tarjeta
                $("#content-other-payment").append(
                    '<div class="t-op" nomtar="'+nomTar+'">'+
                        '<div class="volver hidden-md hidden-lg">'+
                            '<div class="'+nomTar+'"></div>'+
                        '</div>'+
                        '<table id="'+nomTar+'" class="tbl-payment-system">'+
                            '<tbody>'+
                                '<tr class="even">'+
                                    '<th class="parcelas">Nº de Cuotas</th>'+
                                    '<th class="valor">Valor</th>'+
                                '</tr>'+
                                '<tr>'+
                                    '<td class="parcelas">'+cuota+'</td>'+
                                    '<td>'+valorCuota+'</td>'+
                                '</tr>'+
                            '</tbody>'+
                        '</table>'+
                    '</div>'
                );
            }
            else{
                $("table#"+nomTar).append(
                    '<tr>'+
                        '<td class="parcelas">'+cuota+'</td>'+
                        '<td>'+valorCuota+'</td>'+
                    '</tr>'
                )
            }

            const sinInteres = cuota.indexOf("sin interés");
            if(sinInteres != -1){
                // Obtener numero de sin interes
                const regex = /(\d+)/g;
                const numSinInteres = cuota.match(regex)[0];
                
                // Agregar msj de cantidad maxima de cuotas sin interes para mobile
                $(".tarjetas-credito .tar[nomtar='"+nomTar+"']").html('<div>'+numSinInteres+' Sin Interés</div>');
                
                // Agregar Titulo de sin Interes en icono de la lista de las tarjetas
                if(!$(".tarjetas-credito .tar[nomtar='"+nomTar+"']").hasClass("sinInteres")){
                    $(".tarjetas-credito .tar[nomtar='"+nomTar+"']").addClass("sinInteres");
                }
            }
        }

        // Cargar valor de cuotas en efectivo y debito
        const valorUnPago = $(".skuBestPrice").html();
        $("#content-other-payment .pago-efectivo").append('<span class="valor-un-pago">'+valorUnPago+'</span>');
        $("#content-other-payment .tarjetas-debito").append('<span class="valor-un-pago">'+valorUnPago+'</span>');

        res("ok");
    }))
    .then(()=>{
        // Activar la primer tabla
        if ($(window).width() > 768){
            $("#content-other-payment .tarjetas-credito .tar.visa").addClass("active");
            $("#content-other-payment .t-op[nomtar='visa']").addClass("show");
        }
        showTables();
    })

}

function traducirTablas(table){
    
    // Quitar el R$ de los valores de las cuotas
    const listValCuota = $(table+" td:not(.parcelas)");
    for (let i = 0; i < listValCuota.length; i++) {
        const $this = listValCuota.eq(i);
        const valCuotaPeso = $this.html().replace(/R/g,"");
        $this.html(valCuotaPeso);
    }

    // Traducir texto de cuotas y encontrar la mayor cuota sin interes
    const listCuotaText = $(table+" td.parcelas");
    for (let i = 0; i < listCuotaText.length; i++) {
        const $this = listCuotaText.eq(i);
        const nomtar = $this.parents(".t-op").attr("nomtar");
        const text = $this.html();
        const sinInteres = text.indexOf("vezes sem juros");
        if(sinInteres != -1){
            // Obtener numero de sin interes
            const regex = /(\d+)/g;
            const numSinInteres = text.match(regex)[0];

            // Resaltar msj de cuotas sin interes
            const textSinInteres =    text.replace(/\d/g,"")
                                        .replace(/vezes sem juros/g,"");
            $this.html(textSinInteres+" "+numSinInteres+' cuotas <span>sin interés</span>');

            // Agregar msj de cantidad maxima de cuotas sin interes para mobile
            $(".tarjetas-credito .tar[nomtar='"+nomtar+"']").html('<div>'+numSinInteres+' Sin Interés</div>');
            
            // Agregar Titulo de sin Interes en icono de la lista de las tarjetas
            if(!$(".tarjetas-credito .tar[nomtar='"+nomtar+"']").hasClass("sinInteres")){
                $(".tarjetas-credito .tar[nomtar='"+nomtar+"']").addClass("sinInteres");
            }
        }
        else{
            const textTraducido = text.replace(/à vista/g,"un pago")
                                    .replace(/vezes com juros/g,"cuotas con interés");
            $this.html(textTraducido);
        }
    }

    // Traducir encabezados de las tablas
    const listEncabezados = $(".tbl-payment-system th");
    for (let i = 0; i < listEncabezados.length; i++) {
        const $this = listEncabezados.eq(i);
        const titleTraducido =  $this.html()
                                    .replace(/Nº de Parcelas/g,"N° de Cuotas")
                                    .replace(/Valor de cada parcela/g,"Valor");
        $this.html(titleTraducido);
    }
}

function showTables(){
    let contentTar;
    let nomTar;

    $("#content-other-payment .tarjetas-credito").on("click",".tar",function(){
        nomTar = $(this).attr("nomtar");
        $(".tar").removeClass("active"); $(this).addClass("active");
        contentTar = $("#content-other-payment .t-op[nomtar='"+nomTar+"']");
        $("#content-other-payment .t-op").removeClass("show"); contentTar.addClass("show");
    });

    $("#content-other-payment").on("click",".t-op .volver",function(){
        $(this).parent().removeClass("show")
    });

    // if ($(window).width() < 768){
    //     $("#content-other-payment").on("click",".list-other-payment .dp",function(){
    //         $(this).toggleClass("show");
    //     });
    // }

    $(".pagos-on").click(function() {
        $("#modal-overlay,#formas-pago,body").addClass("show")
    })
    $("#modal-overlay,.close-modal").click(function() {
        $("#modal-overlay,#formas-pago,body").removeClass("show")
    })
}
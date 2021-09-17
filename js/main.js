

//-------Traemos nuestros productos desde el stock hecho en un archivo .json y los imprimimos en el DOM---------------


const URLJSON = "assets/productos.json"
let listadoDelJson = [];

$( document ).ready( () => {
        $.getJSON(URLJSON, function (respuesta, estado) {
            if (estado === "success") {
                respuesta.forEach(objeto => {
                    procesarRespuesta(listadoDelJson, objeto);
                });
            };
            imprimirTarjetas(listadoDelJson);
        });
});


function procesarRespuesta(array, objeto) {
    array.push(objeto);
}



function imprimirTarjetas (listado) {

    $("#tarjeta").html(listado.map(item => `
                        <div class="col mb-5" >
                            <div class="card h-100">
                                <!-- Nombre del producto-->
                                <h5 class="fw-bolder">${item.nombre}</h5>
                                <!-- Imagen del producto-->
                                <img class="card-img-top" src="assets/img/${item.imagen}" alt="..." />
                                <!-- Detalles del producto-->
                                <div class="card-body p-4">
                                    <div class="text-center">
                                        <!-- Precio del producto-->
                                        $${item.precio}
                                    </div>
                                </div>
                                <!-- Boton del Producto-->
                                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                    <div class="text-center"><span href="#" class="btn btn-outline-dark mt-auto" onclick="clickearBotonYGuardarEnLocalStorage('${item.id}', '${item.imagen}', '${item.nombre}', '${item.precio}')">Comprar</span></div>
                                </div>
                            </div>
                        </div>`).join(""));
}



//--------------------------------------------------------------------------------------------------------------------



//-----------------------Configuramos el boton del carrito para que se muestre al clickearlo--------------------------


$("#botonCarrito").on("click", function(event) {
    event.preventDefault();
    $("#tarjetaDelCarrito").toggleClass("tarjetaDelCarritoActiva");
}
);


//--------------------------------------------------------------------------------------------------------------------



var elementosCarrito = [];



//--------------------------------Funciónes que agregan datos al carrito y lo dibujan--------------------------------- 

function agregaralCarrito (id, imagen, nombre, precio) {
    elementosCarrito.push({id, imagen, nombre, precio})
}

function clickearBotonYGuardarEnLocalStorage(id, imagen, nombre, precio) {
    
    agregaralCarrito (id, imagen, nombre, precio)
    
    $("#contadorCarrito").html(elementosCarrito.length);

    $('.agregadoConExito').show("slow")
        .delay("1000")
        .hide("slow")
    ;
    
    dibujarCarrito(elementosCarrito);

    localStorage.setItem("elementosCarrito", JSON.stringify(elementosCarrito));
}



function dibujarCarrito (contenidoDelCarrito) {
    if (contenidoDelCarrito !== null) {   
            $("#cuerpoDelCarrito").html(contenidoDelCarrito.map( e => `
                                        <tr class="filaDelCarrito">
                                            <td class="izquierdaDeLaTabla">
                                                <img src="assets/img/${e.imagen}" class= "imagenDelCarrito">
                                            </td>
                                            <td class="medioDeLaTabla">
                                                ${e.nombre}
                                            </td>
                                            <td class="derechaDeLaTabla">
                                                ${e.precio}
                                            </td>
                                            <td>
                                            </td>
                                            <td>
                                                <a id="idTabla" href="#" onclick="eliminarItem(${e.id})" >Eliminar</a>
                                            </td>
                                        </tr>
                                        <hr class="rayaSeparadora">
                                  `).join(""));    
    
    let contador = contenidoDelCarrito.length;
    $("#contadorCarrito").html(contador);


    let total = 0;
    for (let i = 0; i <= contenidoDelCarrito.length - 1; i++) {
        total = total + parseInt(contenidoDelCarrito[i].precio);
    }
    $("#totalSuma").html(total)

    localStorage.setItem("total", total);
    return JSON.stringify(contenidoDelCarrito);
    }
}



//--------------------------------------FUNCIÓN ELIMINAR ITEM DEL CARRITO-----------------------------------------------

function eliminarItem (id) {
    let objetosDelLocal = JSON.parse(localStorage.getItem("elementosCarrito"));
    let indiceDelObjetoEnLocal = objetosDelLocal.findIndex(element => element.id == id);
    objetosDelLocal.splice(indiceDelObjetoEnLocal, 1);
    dibujarCarrito(objetosDelLocal)
    let objetoAlLocalEnJson = JSON.stringify(objetosDelLocal);
    localStorage.setItem("elementosCarrito", objetoAlLocalEnJson);

    if (objetosDelLocal.length == 0) {
        elementosCarrito = [];
        localStorage.removeItem("elementosCarrito");
    }
}

//-------------------------------------------------------------------------------------------------------------------





//--------------------------------------BOTON VACIAR CARRITO--------------------------------------------------------

$("#vaciarCarrito").on("click", function vaciarCarrito(){
    elementosCarrito = [];
    localStorage.removeItem("elementosCarrito");
    $("#cuerpoDelCarrito").html("") ;
    contador = 0;
    $("#contadorCarrito").html(contador);
    $("#totalSuma").html("$0");
});

//-------------------------------------------------------------------------------------------------------------------





//------------------------------------------------BOTON PAGAR--------------------------------------------------------

function compraEfectuada() {


    if (elementosCarrito.length > 0) {
        window.location.href="pages/compra_realizada.html";
        
    }
}

//------------------------------------------------------------------------------------------------------------------





//-------------------------------------Filtramos la página segun categorías de producto-----------------------------


const filtrarTarjetas = (categoria) => {
    imprimirTarjetas( categoria? listadoDelJson.filter( item => item.categoria == categoria ) : listadoDelJson );
}


//-------------------------------------------------------------------------------------------------------------------


//------------------------------------------PARA CUANDO RECARGA LA PAGINA--------------------------------------------

$( document ).ready( function () {
    let storage = localStorage.getItem("elementosCarrito");
    if ( storage !== null ) {
        dibujarCarrito ( JSON.parse(storage) );
    }else{
        console.log("Cuando se recargó la página el carrito estaba vacío");
    }
    
})

//--------------------------------------------------------------------------------------------------------------------
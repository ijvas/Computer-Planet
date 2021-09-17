
    $( document ).ready( () => {
        let totalTraidoDelLocal = localStorage.getItem("total");
        $("#totalDeLaCompra"). totalTraidoDelLocal;

        document.querySelector("#totalDeLaCompra").innerHTML += totalTraidoDelLocal;

        localStorage.removeItem("total");
        localStorage.removeItem("elementosCarrito");
});


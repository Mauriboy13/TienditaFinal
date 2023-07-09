//Base de datos para Categorias
var bdCategoria = new PouchDB("tiendita_Categoria");
var bdProductos = new PouchDB("tiendita_Productos");
var bdLista = new PouchDB("tiendita_listas");

function btnAltaCategoria() {
  var categoria = document.getElementById('nombreCategoria').value;
  if (categoria) {
    bdCategoria.post({ categoria: categoria }).then(function (respuesta) {
      if (respuesta.ok) {
        swal({
          icon: 'success',
          title: 'Categoria guardada',
        });
        limpiarcampos('nueva-categoria');
        actualizarTablaCategorias();
      }
    });
  } else {
    swal({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, rellene todos los campos',
    });
    console.log('Error');
  }
}

// Obtener la referencia al tbody de la tabla
const tbody = document.querySelector('#tabla-categorias tbody');

// Función para obtener las categorías de la base de datos
function obtenerCategorias() {
  // Utilizar la función allDocs() de PouchDB para obtener todas las categorías almacenadas
  bdCategoria.allDocs({ include_docs: true }).then(function (respuesta) {
    // Vaciar el tbody de la tabla
    tbody.innerHTML = '';

    // Iterar sobre la lista de categorías y agregar una fila para cada una
    respuesta.rows.forEach(function (row) {
      // Obtener la información de la categoría desde el objeto doc
      const categoria = row.doc;

      // Crear una fila para esta categoría
      const fila = document.createElement('tr');

      // Agregar una celda para el nombre de la categoría
      const nombreCategoria = document.createElement('td');
      nombreCategoria.textContent = categoria.categoria;
      fila.appendChild(nombreCategoria);

      // Agregar una celda para las acciones (por ejemplo, un botón para eliminar la categoría)
      const acciones = document.createElement('td');
      const botonEliminar = document.createElement('button');
      botonEliminar.textContent = 'Eliminar';
      botonEliminar.className = 'btn btn-danger btn-block';
 

      botonEliminar.addEventListener('click', function () {
        eliminarCategoria(categoria._id, categoria._rev);
      });
      const botonEditar = document.createElement('button');
      botonEditar.className = 'btn btn-primary btn-block';

      botonEditar.textContent = 'Editar';

      botonEditar.addEventListener('click', function () {
        // Llamar a la función para editar la categoría
        editarCategoria(categoria._id, categoria._rev, categoria.categoria);
      });
      acciones.appendChild(botonEliminar);
      acciones.appendChild(botonEditar);
      fila.appendChild(acciones);

      // Agregar la fila al tbody de la tabla
      tbody.appendChild(fila);
    });
  });
}

// Función para editar una categoría en la base de datos
function editarCategoria(id, rev, categoriaActual) {
  var nuevaCategoria = prompt('Ingrese la nueva categoría', categoriaActual);
  if (nuevaCategoria !== null && nuevaCategoria.trim() !== '') {
    bdCategoria.put({
      _id: id,
      _rev: rev,
      categoria: nuevaCategoria.trim()
    }).then(function (respuesta) {
      if (respuesta.ok) {
        swal({
          icon: 'success',
          title: 'Categoría actualizada',
        });
        actualizarTablaCategorias();
      }
    });
  } else {
    swal({
      icon: 'error',
      title: 'Error',
      text: 'El nombre de categoría no puede estar vacío',
    });
  }
}

obtenerCategorias();


//Dar de alta un nuevo producto
function btnAltaProducto() {
  var nombreA = document.getElementById('nombreProducto').value;
  var cantidadA = document.getElementById('cantidad').value;
  var precioA = document.getElementById('precio').value;
  var categoriaA = document.getElementById('categoria').value;
  var notaA = document.getElementById('nota').value;
  var imagenA = document.getElementById('imgFile').src;
  if (nombreA && precioA && cantidadA && categoriaA && notaA) {
    bdProductos.post({
      nombreA: nombreA,
      precioA: precioA,
      cantidadA: cantidadA,
      categoriaA: categoriaA,
      notaA: notaA,
      imagenA: imagenA
    }).then(function(respuesta) {
      if (respuesta.ok) {
        swal({
          icon: 'success',
          title: 'Producto guardado',
        });
        limpiarcampos('nuevo-producto');
      }
    });
  }
  else{
    swal({
      icon: 'error',
            title: 'Error',
            text: 'Por favor, rellene todos los campos',
    });
    console.log('Error');
  }
};

function actualizarTablaCategorias() {
  // Obtener todas las categorías de la base de datos
  obtenerCategorias(function(categorias) {
    // Obtener el tbody de la tabla de categorías
    var tbody = document.getElementById("tbody-categorias");

    // Limpiar el tbody existente
    tbody.innerHTML = "";

    // Agregar cada categoría como una nueva fila en la tabla
    categorias.forEach(function(categoria) {
      var fila = "<tr><td>" + categoria.nombre + "</td></tr>";
      tbody.innerHTML += fila;
    });
  });
}
// Función para eliminar una categoría de la base de datos
function eliminarCategoria(id, rev) {
  bdCategoria.remove(id, rev).then(function(respuesta) {
    obtenerCategorias();
    swal({
      icon: 'success',
      title: 'Categoria eliminada',
    });
  });
}
//Mostrar productos
function vistaProductos(){
  bdProductos.allDocs({
    include_docs: true
  }).then(function(documentos) {
    var htmlProductos = "";
    for (var i = 0; i < documentos.rows.length; i++) {
      var producto = documentos.rows[i].doc;
      htmlProductos += "<div style='display: flex; margin-bottom: 20px; margin-top: 10px; background:#D4F974;'>";

      htmlProductos += "<div style='margin-right: 20px; margin-left:10px; margin-top: 30px;'>";
      htmlProductos += "<img src = '" + producto.imagenA + "' alt='Imagen' style='width: 100px;'>";
      htmlProductos += "</div>";
      htmlProductos += "<div>";
      // muestra el id
      // htmlProductos += "<p><strong>ID:</strong> " + producto._id + "</p>";
      htmlProductos += "<p><strong>Nombre:</strong> " + producto.nombreA+ "</p>";
      htmlProductos += "<p><strong>Categoría:</strong> " + producto.categoriaA+"</p>";
      htmlProductos += "<p><strong>Nota:</strong> " + producto.notaA + "</p>";
      htmlProductos += "<div>";
      htmlProductos += "<label><input type='checkbox' class='producto-checkbox' data-id-producto='" + producto._id + "'>Agregar</label>";
      htmlProductos += "</div>";
 
      htmlProductos += "</div>";
      htmlProductos += "</div>";
    }
    document.getElementById("productosContainer").innerHTML = htmlProductos;
    document.getElementById("agregarCarrito").addEventListener("click", agregarAlCarrito);
  });
};

// Agregar productos al carrito
function agregarAlCarrito() {
  var checkboxes = document.getElementsByClassName("producto-checkbox");
  var productosSeleccionados = [];
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      var idProducto = checkboxes[i].getAttribute("data-id-producto");
      productosSeleccionados.push(idProducto);
    }
  }
  localStorage.setItem("productosSeleccionados", JSON.stringify(productosSeleccionados));
  window.location.href = "PaginaInicial.html";
}

function vistaCarrito() {
  var productosSeleccionados = JSON.parse(localStorage.getItem("productosSeleccionados"));
  var promesas = []; // Array de promesas para cada producto seleccionado
  var htmlProductos = "";
  var total = 0; // Variable para acumular el total de todos los precios
  for (var i = 0; i < productosSeleccionados.length; i++) {
    // document.getElementById("cantidadProductos").innerHTML = productosSeleccionados.length;
    var idProducto = productosSeleccionados[i];
    var promesa = bdProductos.get(idProducto);
    promesas.push(promesa); // Añadir la promesa al array
  }
  // Esperar a que se completen todas las promesas
  Promise.all(promesas).then(function(productos) {
    for (var i = 0; i < productos.length; i++) {
      var producto = productos[i];
      htmlProductos += "<div style='display: flex; margin-bottom: 20px; margin-top: 10px; background:#D4F974;'>";

      htmlProductos += "<div style='margin-right: 20px; margin-left:10px; margin-top: 30px;'>";
      htmlProductos += "<img src = '" + producto.imagenA + "' alt='Imagen' style='width: 100px;'>";
      htmlProductos += "</div>";
      htmlProductos += "<div>";
      // htmlProductos += "<p><strong>ID:</strong> " + producto._id + "</p>";
      htmlProductos += "<p><strong>Nombre:</strong> " + producto.nombreA+ "</p>";
      htmlProductos += "<p><strong>Categoría:</strong> " + producto.categoriaA+"</p>";
      htmlProductos += "<p><strong>Precio: $</strong>" + producto.precioA + "</p>";
      htmlProductos += "<p><strong>Cantidad:</strong> " + producto.cantidadA + "</p>";
      var precioTotal =  producto.cantidadA*producto.precioA;
      htmlProductos += "<p><strong>Total: $</strong>" + precioTotal+ "</p>";
      htmlProductos += "<div>";
      htmlProductos += "<button data-id-producto='" + producto._id + "' class='btn btn-primary btn-block editar-producto'>Editar</button>";
      htmlProductos += "<button data-id-producto='" + producto._id + "' class='btn btn-danger btn-block eliminar-producto'>Eliminar</button>";
      document.addEventListener("click", function(event) {
        if (event.target.classList.contains("eliminar-producto")) {
          var idProducto = event.target.getAttribute("data-id-producto");
          eliminarProductoDelCarrito(idProducto);
        }
      });
      
      document.addEventListener("click", function(event) {
        if (event.target.classList.contains("editar-producto")) {
          var idProducto = event.target.getAttribute("data-id-producto");
          localStorage.setItem("idProductoEditar", idProducto);
          window.location.href = "editarProducto.html";
        }
      });
      htmlProductos += "</div>";
      
      total += precioTotal; // Acumular el precio total en la variable 'total'

      htmlProductos += "</div>";
      htmlProductos += "</div>";
    }
    // Agregar el total de todos los precios al final del carrito
    htmlProductos += "<br><br><br><div style='display: flex; margin-top: 15px; background:#C4C4C4; position: fixed; bottom: 0; width: 100%; padding-top: 15px;'>";
    htmlProductos += "<p style='align-self: flex-start'><strong>Productos agregados: </strong>" + productosSeleccionados.length + "</p>";
    htmlProductos += "<p style='align-self: flex-end'><strong>Total de todos los productos: $</strong>" + total + "</p>";
    htmlProductos += "<div>";
    document.getElementById("productosSeleccionados").innerHTML = htmlProductos;
  });
}
document.addEventListener("DOMContentLoaded", function(event) {
  vistaCarrito();
});

////
function eliminarProductoDelCarrito(idProducto) {
  var productosSeleccionados = JSON.parse(localStorage.getItem("productosSeleccionados"));
  var index = productosSeleccionados.indexOf(idProducto);
  if (index > -1) {
    productosSeleccionados.splice(index, 1);
    localStorage.setItem("productosSeleccionados", JSON.stringify(productosSeleccionados));
    vistaCarrito();
    swal({
      icon: 'success',
      title: 'Producto eliminado del carrito',
    });
  }
}





// Dar de alta una nueva lista
function btnAltaLista() {
  var nombreLista = document.getElementById('nombreLista').value;
  if (nombreLista) {
    bdLista.post({nombreLista: nombreLista}).then(function(respuesta) {
      if (respuesta.ok) {
        swal({
          icon: 'success',
          title: 'Lista guardada',
        });
        limpiarcampos('nueva-lista');
      }
    });
  }
  else {
    swal({
      icon: 'error',
            title: 'Error',
            text: 'Por favor, rellene todos los campos',
    });
    console.log('Error');
  }
}

// Obtener todas las listas de la base de datos
bdLista.allDocs({include_docs: true}).then(function(respuesta) {
  respuesta.rows.forEach(function(row) {
    var lista = row.doc;
    // Crear elemento <a> con la información de la lista y agregarlo al div con id="listas"
    var link = document.createElement('a');
    link.setAttribute('class', 'dropdown-item');
    link.setAttribute('href', 'verLista.html?id=' + lista._id);
    link.innerText = lista.nombreLista;
    document.getElementById('listas').appendChild(link);
  });
}).catch(function(error) {
  console.log('Error al obtener las listas', error);
});
function cargarListas() {
  bdListas.allDocs({
    include_docs: true
  }).then(function (documentos) {
    var htmlListas = "";
    for (var i = 0; i < documentos.rows.length; i++) {
      var lista = documentos.rows[i].doc;
      htmlListas += "<option value='" + lista._id + "'>" + lista.nombre + "</option>";
    }
    document.getElementById("listaSeleccionada").innerHTML += htmlListas;
  });
}



// Funcion para limipiar los inputs
function limpiarcampos(valor){
  if(valor == 'nueva-categoria'){
    document.getElementById('nombreCategoria').value = '';
  }
  else if (valor == 'nuevo-producto'){
    document.getElementById('nombreProducto').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('categoria').value ='';
    document.getElementById('cantidad').value = '';
    document.getElementById('nota').value = '';
    document.getElementById('imgFile').src = '../img/imgSubir.png';
    document.getElementById('imagen'),value="";
  }
  else if (valor == 'nueva-lista'){
    document.getElementById('nombreLista').value = '';
  }
}
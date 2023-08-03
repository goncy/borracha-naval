# #04-Batalla naval Borracha
El Challenge se trata de manejar iteraciones sobre una matriz de 8x8.
La matriz viene prevista por el desafio.

![Matriz de ejemplo en el código](https://i.imgur.com/fIkm8gX.png)

Dada la matriz hay que conseguir:
* Que se puedan clickear para marcar en un casillero y luego 3 clicks mas en casilleros aledaños para lograr dibujar una linea (tiene que ser del largo de 4 casilleros), horizontal o vertical.
El primer click puede ser en cualquier lado dentro de la matriz, (define la posicion)
El segundo click puede ser para arriba, abajo, izquierda o derecha del primer click ( define la direccion )
El tercer y cuarto click estan obligados a continuar la direccion definida
* Debajo de la matriz de dibujar la linea, van a aparecer 3 botones:
1) Boton Con una flecha para la izquierda ( rotacion anti-horaria // levogiro )
2) Boton Con una flecha a la derecha ( rotacion horaria // dextrogiro )
3) Boton Con un tacho de basura

* Los botones con flecha deberian rotar dicha linea previamente dibujada 90deg para el lado de la flecha. recorriendo la matriz y modificando la posicion de los casilleros marcados

* El boton con el tacho de basura deberia borrar el ultimo casillero dibujado

## +1
Los siguientes puntos no son necesarios en la entrega, pero sí suman:

* Hacer la UI responsive
* Los botones deberian estar habilitados o deshabilitados dependiendo de si la linea esta completa o de si hay algo para borrar
* Pintar las celdas de colores con cierto degrade, puede ser con opacidad
* Limitar cliclear afuera u en otro casillero que no continue con una linea
* Tanto el casillero tildado como los botones con iconos deberian ser componentes separados
* Trabajar los componentes en Storybook
* Resaltar las pociones posibles para clickear
* Usar Types para definir los parametros de las funciones de React ( Pure Function Components )

## Entrega

* El tiempo de resolución del challenge son 2~3 días contando desde el momento que se envió el mismo.
* Se debe enviar la desarrollado vía git.
* El código debe poder ejecutarse y ver la solución funcionando.
* Enviar las instrucciones que sean necesarias para ejecutar la solución, y en caso de que sea oportuno comentarios o consideraciones realizadas sobre la problemática o la forma en la que fue resuelta.

#### Antes de empezar
El ejercicio viene con un proyecto base en React en typescript y un Eslint como linteador para mantener la prolijidad, con bootstrap usando el framework de NextJs. tiene configurado scss (Sass) y viene con Storybook. Los comandos para prender el proyecto estan mas abajo

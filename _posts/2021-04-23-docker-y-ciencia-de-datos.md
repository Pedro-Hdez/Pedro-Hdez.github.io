---
layout: post
title: "Docker y Ciencia de Datos"
author: pedro
portada: assets/images/portadas/ciencia_datos_proyecto_es.png
categories: [Ciencia de datos]
description: "Mini proyecto de limpieza de datos generando una imagen de Docker."
beforetoc: "En esta publicación se realizará una limpieza de datos de Covid-19 en México utilizando
la línea de comandos de Unix y se generará un contenedor de Docker para la reproducibilidad del 
proceso."
toc: true
---

## Objetivo

El objetivo de este pequeño tratamiento de datos es obtener el número total de casos positivos
y negativos de Covid-19 para cada municipio de Sonora, partiendo de la [base de datos federal](https://www.gob.mx/salud/documentos/datos-abiertos-152127) correspondiente a dicha enfermedad. Estos resultados se almacenarán en un archivo
csv. De este modo, tendremos un conjunto de datos limpios sobre los cuales podríamos aplicar
técnicas de análisis.

## Prerrequisitos

El único requisito es tener instalado Docker en nuestra computadora. [Aquí](https://docs.docker.com/get-docker/) puedes consultar las guías
de instalación.

El código fuente de este mini proyecto lo puedes encontrar en [este repositorio](https://github.com/Pedro-Hdez/DataScienceAndDockerMiniProject).

## Cómo usarlo

### Generar la imagen

Para generar la imagen de docker necesitamos:

1. Instalar docker
2. Clonar o descargar el repositorio
3. Situarnos en la carpeta del repositorio
4. Ejecutar el siguiente comando:

```console
$ docker build -t <nombre_imagen> .
```

Recuerda reemplazar la cadena <nombre_imagen> por el nombre que deseas asignar a la imagen que se va a construir.

### Crear un contenedor a partir de la imagen generada

Para crear un contenedor persistente con la imagen que acabamos de crear ejecutamos la siguiente instrucción:

```console
$ docker run -it --name <nombre_contenedor> <nombre_imagen>
```

Recuerda reemplazar la cadena <nombre_contenedor> por el nombre que deseas asignar al contenedor que se va a construir.

El nombre de la imagen <nombre_imagen> debe coincidir con el nombre que escribiste al momento de generar la imagen.

En este momento se desplegará la terminal del contenedor y podrás ver algo parecido a lo siguiente:

```console
(base) root@3328f252cf7f:/data_cleaning#
```

Si enlistamos los archivos contenidos en el directorio actual tendremos lo siguiente:

```console
(base) root@3328f252cf7f:/data_cleaning# ls
201128_Catalogos.xlsx	 data_processing.yml  numero_positivos_y_negativos_municipios_sonora.csv
210422COVID19MEXICO.csv  fix_data.py	      positivos_y_negativos_municipios_sonora.csv
```

El archivo llamado **positivos_y_negativos_municipios_sonora.csv** es el que almacena el resultado deseado. Podemos echarle un vistazo y confirmar que contiene la sumatoria de los casos positivos y negativos a Covid-19 para cada municipio del estado de Sonora.

```console
(base) root@3328f252cf7f:/data_cleaning# cat positivos_y_negativos_municipios_sonora.csv | head -n 10
TOTAL,MUNICIPIO_RES,CLASIFICACION_FINAL
17,ACONCHI,CASO DE SARS-COV-2  CONFIRMADO
14,ACONCHI,NEGATIVO A SARS-COV-2
1021,AGUA PRIETA,CASO DE SARS-COV-2  CONFIRMADO
851,AGUA PRIETA,NEGATIVO A SARS-COV-2
178,ALAMOS,CASO DE SARS-COV-2  CONFIRMADO
143,ALAMOS,NEGATIVO A SARS-COV-2
76,ALTAR,CASO DE SARS-COV-2  CONFIRMADO
82,ALTAR,NEGATIVO A SARS-COV-2
21,ARIVECHI,CASO DE SARS-COV-2  CONFIRMADO
```

Si deseas conocer el procedimiento para obtener dicho resultado te invito a continuar leyendo este post.

## Procedimiento

El procedimiento consta de dos sencillos pasos:

1. Para la descarga y limpieza preliminar de los datos usaremos las herramientas de la línea de comandos de Unix, más específicamente, utilizaremos la distribución de Ubuntu.
2. Con el paso anterior obtendremos un archivo csv pero cada casilla contendrá las claves de los valores reales. Por lo tanto, es necesaria una segunda etapa para sustituir dichas claves y así obtener un resultado humanamente legible. Para esta etapa nos apoyaremos de un script de Python utilizando la librería Pandas.

Este procedimiento se realizará desde un Dockerfile, por lo tanto, cualquier usuario puede reproducirlo y obtendrá exactamente el mismo resultado; además, nos ahorraremos todos los problemas de configuración de nuestro ambiente de trabajo ¡Qué bonito es Docker!.

### Archivos necesarios

Se presenta una breve explicación de la función de cada archivo necesario. Recuerda que todos éstos los puedes encontrar en el repositorio del proyecto.

- **Dockerfile**: Archivo que contiene las instrucciones necesarias para la configuración de nuestro ambiente de trabajo y para realizar el procedimiento de limpieza de datos.
- **data_processing.yml**: Entorno de Anaconda. Recordemos que necesitamos ejecutar un script de Python y utilizar Pandas. Me di a la tarea de instalar todas las dependencias necesarias y desde el Dockerfile instalaremos Anaconda y exportaremos este archivo a un nuevo entorno.
- **fix_data.py**: Script de Python para ejecutar la segunda etapa del procedimiento y obtener un resultado final.
- **201128_Catalogos.xlsx**: Este archivo contiene las claves y valores reales utilizados en la base de datos que vamos a procesar. Es necesario para intercambiar el valor de las claves por sus valores reales.

Los archivos más relevantes son **Dockerfile** y **fix_data.py**. A continuación les echaremos un vistazo.

### Dockerfile

```yml
# Tomamos como base la imagen de ubuntu y además instalamos miniconda
FROM ubuntu
FROM continuumio/miniconda3

# Autor
LABEL Pedro Hernandez <pedro.a.hdez.a@gmail.com>

# Creamos un directorio y lo convertimos en nuestro directorio de trabajo
RUN mkdir data_cleaning
WORKDIR /data_cleaning

# Actualizamos todos los paquetes e instalamos los que faltan
RUN apt -y update
RUN apt install -y curl unzip csvkit

# Descargamos los datos
RUN curl -O http://datosabiertos.salud.gob.mx/gobmx/salud/datos_abiertos/datos_abiertos_covid19.zip

# Descomprimimos el archivo y eliminamos el zip
RUN unzip datos_abiertos_covid19.zip && rm datos_abiertos_covid19.zip

# Obtenemos la suma de los negativos y confirmados de covid para cada municipio de Sonora y
# guardamos el resultado en el archivo "numero_positivos_y_negativos_municipios_sonora.csv"
RUN csvcut -c ENTIDAD_RES,MUNICIPIO_RES,CLASIFICACION_FINAL 210422COVID19MEXICO.csv | \
    csvgrep -c ENTIDAD_RES -m "26" | csvcut -c MUNICIPIO_RES,CLASIFICACION_FINAL | \
    csvgrep -c CLASIFICACION_FINAL -r "[37]" | csvsort --no-inference -c 1,2 | uniq -c | \
    tail -n+2 | sed -e 's/\s\+/,/g' | cut -c 2- > numero_positivos_y_negativos_municipios_sonora.csv

RUN sed -i '1s/^/TOTAL,MUNICIPIO_RES,CLASIFICACION_FINAL\n/' numero_positivos_y_negativos_municipios_sonora.csv

CMD ["bash"]

# El archivo anterior tendrá como valores en sus renglones el total, las claves de los municipios
# y la clave de la clasificación. Para mapear estas claves a sus respectivos valores haremos
# uso de un script de python.

# Copiamos el entorno de anaconda, el catálogo de los datos y el script para arreglar los datos
COPY data_processing.yml .
COPY 201128_Catalogos.xlsx .
COPY fix_data.py .

# Creamos el entorno de anaconda y configuramos bash para correr anaconda
RUN conda env create -f data_processing.yml
SHELL ["conda", "run", "-n", "data_processing", "/bin/bash", "-c"]
SHELL ["conda", "run", "--no-capture-output", "-n", "data_processing", "python", "fix_data.py"]

# Corremos el script para arreglar los datos
RUN python fix_data.py
```

La parte fundamental de este Dockerfile es el tratamiento de los datos (líneas 24-29), explicaré
cada pipe que se utilizó:

```console
$ csvcut -c ENTIDAD_RES,MUNICIPIO_RES,CLASIFICACION_FINAL 210422COVID19MEXICO.csv
```

La base de datos contiene 40 columnas. Nosotros únicamente necesitamos las columnas de
_ENTIDAD_RES_ para identificar a Sonora, _MUNICIPIO_RES_ para identificar cada municipio, _CLASIFICACION_FINAL_ para
identificar a los casos positivos y negativos a Covid-19. Entonces, en nuestra primer pipe filtramos el archivo
para quedarnos únicamente con las columnas que nos interesan.

```console
$ csvgrep -c ENTIDAD_RES -m "26"
```

Con este pipe elegimos únicamente los renglones que tengan como valor "26" (la clave de Sonora) en su columna _ENTIDAD_RES_.
Para entender esta clave y las demás es necesario consultar el archivo **201128_Catalogos.xlsx**

```console
$ csvcut -c MUNICIPIO_RES,CLASIFICACION_FINAL
```

Aquí deshechammos la columna _ENTIDAD_RES_, ésta ya no nos interesa porque con el pipe anterior nos
aseguramos que estamos trabajando únicamente con registros de Sonora.

```console
$ csvgrep -c CLASIFICACION_FINAL -r "[37]"
```

Aplicamos la expresión regular "[37]" a la columna _CLASIFICACION_FINAL_; es decir, nos quedamos
únicamente con los renglones que tengan un "3" o un "7" como valor en la columna mencionada. Esto
significa que nos quedamos úncamente con los datos positivos (3) y negativos a Covid-19.

```console
$ csvsort --no-inference -c 1,2 | uniq -c
```

Aquí existen dos pipes que van de la mano. Con el primero ordenamos los datos, primero por su
columna 1 (_MUNICIPIO_RES_) y después por la columna 2 (_CLASIFICACION_FINAL_) y con el segundo
contamos las líneas únicas de la base de datos. Haciendo ésto obtenemos el total de positivos y
el total de negativos a Covid-19 en cada uno de los municipios de Sonora.

```console
$ tail -n+2
```

La pipe anterior cuenta cuántas veces se repite una línea en todo el archivo, por lo tanto, también
cuenta el encabezado del csv (el renglón que contiene el nombre de las columnas) y le agrega la cantidad
de veces que se repite, por lo tanto, este encabezado ya no nos sirve más. Con esta instrucción
tomamos todas las líneas del archivo excepto la primera.

```console
$ sed -e 's/\s\+/,/g'
```

El comando _uniq_ tiene su propio formato de salida, por lo general utiliza espacios en blanco como
separadores y también los agrega al inicio de cada línea. Con esta instrucción sustituímos esos espacios en blanco por comas.

```console
$ cut -c 2- > numero_positivos_y_negativos_municipios_sonora.csv
```

Debido a que el comando anterior también incluyó comas al inicio de cada renglón del archivo, con este pipe
borramos los dos primeros caracteres de cada línea, es decir, nos deshacemos de las comas existentes
al inicio de todas las líneas. Finalmente escribimos este resultado en un archivo.

En este punto ya tenemos un archivo con la sumatoria de casos positivos y negativos a Covid-19 para
cada municipio del estado de Sonora. Pero todavía nos falta un pequeño detalle. Recordemos que al usar
la instrucción _uniq -c_ destruimos el encabezado de nuestro archivo, entonces como última acción
necesitamos volver a añadir dicho encabezado, para eso utilizamos la siguiente instrucción:

```console
$ sed -i '1s/^/TOTAL,MUNICIPIO_RES,CLASIFICACION_FINAL\n/' numero_positivos_y_negativos_municipios_sonora.csv
```

¡Listo! Ahora ya tenemos el resultado parcial.

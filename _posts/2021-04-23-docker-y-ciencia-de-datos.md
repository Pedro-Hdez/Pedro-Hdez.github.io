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

Recuerda reemplazar la cadena _<nombre_imagen>_ por el nombre que deseas asignar a la imagen que se va a construir.

### Utilizar la imagen

Para crear un contenedor persistente con la imagen que acabamos de crear ejecutamos la siguiente instrucción:

```console
$ docker run -it --name <nombre_contenedor> <nombre_imagen>
```

Recuerda reemplazar la cadena _<nombre_contenedor>_ por el nombre que deseas asignar al contenedor que se va a construir.

El nombre de la imagen _<nombre_imagen>_ debe coincidir con el nombre que escribiste al momento de generar la imagen.

## Procedimiento

El procedimiento consta de dos sencillos pasos:

1. Para la descarga y limpieza preliminar de los datos usaremos las herramientas de la línea de comandos de Unix, más específicamente, utilizando la distribución de Ubuntu.
2. Con el paso anterior obtendremos un archivo csv pero cada casilla contendrá las claves de los valores reales. Por lo tanto, es necesaria una segunda etapa para sustituir dichas claves y así obtener un resultado humanamente legible. Para esta etapa nos apoyaremos de un script de Python utilizando la librería Pandas.

Este procedimiento se realizará desde un Dockerfile, por lo tanto, cualquier usuario puede reproducirlo y obtendrá exactamente el mismo resultado que se mostrará en este post; además, nos ahorraremos todos los problemas de configuración de nuestro ambiente de trabajo ¡Qué bonito es Docker!.

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

# proyecto iot weather station

Módulo IOT-SERVER

# Servicios:

    1. http://server/weather/getTime

    Método: GET

    Devuelve la fecha actual (día y hora) en formato: AAAA-MM-DDTHH:MM:SS.0Z

    2.  http://server/weather/saveSensor?idhome=<username>&temp=<val>&humid=<val>&timestamp=<date>

    Método: GET

    Descripción: Salva en la Base de datos, cada registro de temperatura & humidad.

    Datos de entrada:

      idhome, temp, humid, timestamp

    Datos de salida:

      Copia en JSON guardado en la base de datos.
      ej: [{"idhome":"emontoya","temp":22.3,"humid":80.3,"timestamp":"2017-03-30T18:03:00.000Z"]

    3. http://server/weather/<username>

    Método: GET

    Descripción: Recupera todos los registros almacenados para el idhome igual a <username>
      trae los últimos 10 registros enviados al servidor.

      ej: http://server/weather/emontoya

    Datos de entrada: NO

    Datos de salida:

      lista de registros así:

      [{"idhome":"emontoya","temp":22.3,"humid":80.3,"timestamp":"2017-03-30T18:03:00.000Z"},
      {"idhome":"emontoya","temp":22.3,"humid":80.3,"timestamp":"2017-03-30T18:03:00.000Z",
      {"idhome":"emontoya","temp":22.3,"humid":80.3,"timestamp":"2017-03-30T18:03:00.000Z",
      {"idhome":"emontoya","temp":22.3,"humid":80.3,"timestamp":"2017-03-30T18:03:00.000Z"]

    4. http://<server>[:<port>]/weather/<username>/<size>

    Método: GET

    Descripción: Recupera todos los registros almacenados para el idhome igual a <username>
      trae los últimos <size> registros enviados al servidor.

      ej: http://server/weather/emontoya/2

    Datos de entrada: NO

    Datos de salida:

      lista de registros así:

      [{"idhome":"emontoya","temp":22.3,"humid":80.3,"timestamp":"2017-03-30T18:03:00.000Z"},
      {"idhome":"emontoya","temp":22.3,"humid":80.3,"timestamp":"2017-03-30T18:03:00.000Z"]

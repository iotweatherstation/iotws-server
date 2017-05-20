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

      5. http://server/weather/getSwitch?idhome="username"

      Método: GET

      Descripción: Recupera el valor del switch para el idhome -> "username"

      Datos de entrada: idhome="username"

      Datos de salida: valor "0", "1" ó "-1"

      6. http://server/weather/putSwitch?idhome="username"&val="val"

      Método: GET

      Descripción: Salva el valor del switch para el idhome -> "username" con "val".
        "val" tendrá valor: "0" ó "1"

      Datos de entrada: idhome="username" y val=["0"|"1"]

      Datos de salida: registro json almacenado en la base de datos. Ej:
        {"idhome":"emontoya","val":0,"_id":"591fbe7efd652a2d534df328"}

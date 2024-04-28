let turnos;

async function getTurnos() {
  let response;
  try {
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '1tft1ies-usJJqsZ58W4q8DpHyi_O3nP8Xm3dMUcFJtU',
      range: 'Hoja1!A:G',
    });
  } catch (err) {
    console.error(err);
    return;
  }
  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    console.warn("No se encontraron valores");
    return;    
  }

  turnos = [];
  range.values.forEach((fila) => {
    if (isNaN(parseInt(fila[0])) || fila[5] !== undefined) return;
    const nuevoTurno = {
      id: fila[0],
      cliente: fila[1],
      email: fila[2],
      modelo: fila[3],
      problema: fila[4],
      fecha_terminado: fila[5],
      comentario: fila[6]
    };
    turnos.push(nuevoTurno);
  });
  console.log(turnos);
}

async function editTurno(contenido) {
  const update = [
    contenido.id,
    contenido.cliente,
    contenido.email,
    contenido.modelo,
    contenido.problema,
    new Date().toISOString(),
    contenido.comentario,
  ];
 
  const filaEditar = parseInt(contenido.id) + 1;
  try {
    const response = await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: '1tft1ies-usJJqsZ58W4q8DpHyi_O3nP8Xm3dMUcFJtU',
      range: `Hoja1!A${filaEditar}:G${filaEditar}`,
      values: [update],
      valueInputOption: "USER_ENTERED"
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

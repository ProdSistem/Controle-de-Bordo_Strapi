import { headerCenterStyle, headerLeftStyle } from './styles';

export const createTitleBoardRegister = (
  ws,
  itens,
  functionary_name,
  cost_center_code,
  date_initial,
  date_final,
  plateVehicle,
) => {
  ws.cell(2, 1, 2, 16, true)
    .string(`RELATÓRIO DE BORDO`)
    .style(headerCenterStyle);

  ws.cell(3, 1, 3, 1, true).string('FILTROS:').style(headerLeftStyle);
  ws.cell(3, 2, 3, 4, true)
    .string(`Nome do Motorista: ${functionary_name}`)
    .style(headerLeftStyle);
  ws.cell(3, 5, 3, 7, true)
    .string(`Placa do veículo: ${plateVehicle}`)
    .style(headerLeftStyle);
  ws.cell(3, 8, 3, 10, true)
    .string(`Centro de resultado: ${cost_center_code}`)
    .style(headerLeftStyle);
  ws.cell(3, 11, 3, 13, true)
    .string(`A partir de: ${date_initial} Até:  ${date_final}`)
    .style(headerLeftStyle);
  ws.cell(3, 14, 3, 16, true).date(new Date()).style(headerCenterStyle);

  itens.map((item, key) => {
    ws.cell(4, key + 1)
      .string(`${item}`)
      .style(headerCenterStyle);
  });
  return ws;
};

export const createTitleFunctionary = (
  ws,
  itens,
  registration,
  name,
  active,
) => {
  let status;
  if (active === 'true') {
    status = 'Ativo';
  } else if (active === 'false') {
    status = 'Desativado';
  } else {
    status = 'Todos';
  }

  ws.cell(2, 1, 2, 18, true)
    .string(`RELATÓRIO DE BORDO`)
    .style(headerCenterStyle);

  ws.cell(3, 1, 3, 1, true).string('FILTROS:').style(headerLeftStyle);
  ws.cell(3, 2, 3, 4, true)
    .string(`Matrícula: ${registration}`)
    .style(headerLeftStyle);
  ws.cell(3, 5, 3, 11, true).string(`Nome: ${name}`).style(headerLeftStyle);
  ws.cell(3, 12, 3, 15, true)
    .string(`Status: ${status}`)
    .style(headerLeftStyle);
  ws.cell(3, 16, 3, 18, true).date(new Date()).style(headerCenterStyle);
  ws.cell(4, 12, 4, 18, true)
    .string(`Endereço ${active}`)
    .style(headerCenterStyle);

  itens.map((item, key) => {
    if (key + 1 <= 11) {
      ws.cell(4, key + 1, 5, key + 1, true)
        .string(`${item}`)
        .style(headerCenterStyle);
    } else {
      ws.cell(5, key + 1)
        .string(`${item}`)
        .style(headerCenterStyle);
    }
  });
  return ws;
};

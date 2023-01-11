export const filtersBoardRegister = async (
  functionary_name,
  cost_center_code,
  date_initial,
  date_final,
  plateVehicle,
) => {
  return await strapi.entityService.findMany(
    'api::board-register.board-register',
    {
      populate: '*',
      filters: {
        functionary_id: {
          name: {
            $containsi: functionary_name ? functionary_name : '',
          },
        },
        vehicle_id: {
          plate: {
            $containsi: plateVehicle ? plateVehicle : '',
          },
        },
        cost_center_id: {
          code: {
            $containsi: cost_center_code ? cost_center_code : '',
          },
        },
        date_register: {
          $gte: date_initial ? date_initial : '1922-01-01',
          $lte: date_final ? date_final : '2922-01-01',
        },
      },
      limit: 17000,
    },
  );
};

export const filtersFunctionary = async (registration, name, active) => {
  return await strapi.entityService.findMany('api::functionary.functionary', {
    populate: '*',
    filters: {
      name: {
        $containsi: name ? name : '',
      },
      registration: {
        $containsi: registration ? registration : '',
      },
      status: {
        $containsi: active ? active : '',
      },
    },
    limit: 17000,
  });
};

export const filtersVehicles = async (
  code,
  plate,
  brand,
  vehicleName,
  proprietaryType,
) => {
  return await strapi.entityService.findMany('api::vehicle.vehicle', {
    populate: '*',
    filters: {
      code: {
        $containsi: code ? code : '',
      },
      brand: {
        $containsi: brand ? brand : '',
      },
      plate: {
        $containsi: plate ? plate : '',
      },
      equipment_name: {
        $containsi: vehicleName ? vehicleName : '',
      },
      proprietary_type: {
        $containsi: proprietaryType ? proprietaryType : '',
      },
    },
    limit: 17000,
  });
};

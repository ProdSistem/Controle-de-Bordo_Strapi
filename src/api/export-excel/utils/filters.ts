export const filtersBoardRegister = async (
  functionary_name,
  cost_center_code,
  date_initial,
  date_final,
) => {
  return await strapi.entityService.findMany(
    'api::board-register.board-register',
    {
      populate: '*',
      filters: {
        $or: [
          { createdAt: { $gte: date_initial || '2000-01-01T01:00:00.000Z' } },
          { createdAt: { $lte: date_final || '2999-12-08T14:41:00.250Z' } },
          { cost_center_id: { code: cost_center_code } },
          { functionary_id: { name: { $containsi: functionary_name } } },
        ],
      },
    },
  );
};

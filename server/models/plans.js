module.exports = (sequelize, DataTypes) => {
  const plans = sequelize.define(
    'plans',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      desc: {
        type: DataTypes.TEXT,
      },
      settings: {
        type: DataTypes.TEXT,
        defaultValue: '{}',
      },
      ownerInfo: {
        type: DataTypes.TEXT,
        defaultValue: '{}',
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  plans.associate = (models) => {
    plans.belongsTo(models.planfolders);
  };
  return plans;
};

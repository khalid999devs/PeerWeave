module.exports = (sequelize, DataTypes) => {
  const subplans = sequelize.define(
    'subplans',
    {
      desc: {
        type: DataTypes.TEXT,
      },
      filesURL: {
        type: DataTypes.TEXT,
        defaultValue: '{}',
        allowNull: false,
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
      editorsInfo: {
        type: DataTypes.TEXT,
        defaultValue: '[]',
      },
    },
    { timestamps: true }
  );

  subplans.associate = (models) => {
    subplans.belongsTo(models.plans);
  };
  return subplans;
};

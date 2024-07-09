module.exports = (sequelize, DataTypes) => {
  const planfolders = sequelize.define(
    'planfolders',
    {
      name: {
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

  planfolders.associate = (models) => {
    planfolders.belongsTo(models.spaces);
    planfolders.hasMany(models.plans, {
      foriegnKey: 'folderId',
      onDelete: 'CASCADE',
    });
  };
  return planfolders;
};

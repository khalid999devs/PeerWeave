module.exports = (sequelize, DataTypes) => {
  const clientspaces = sequelize.define('clientspaces', {
    // spaceId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'member', //values= 'member'||'owner'
    },
    userInfo: {
      type: DataTypes.TEXT,
      defaultValue: '{}',
    },
    spaceInfo: {
      type: DataTypes.TEXT,
      defaultValue: '{}',
    },
  });

  clientspaces.associate = (models) => {
    clientspaces.belongsTo(models.clients);
    clientspaces.belongsTo(models.spaces);
  };

  return clientspaces;
};

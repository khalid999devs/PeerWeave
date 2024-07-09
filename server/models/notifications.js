module.exports = (sequelize, DataTypes) => {
  const notifications = sequelize.define('notifications', {
    title: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'unread',
      allowNull: false,
    },
    info: {
      type: DataTypes.TEXT,
      defaultValue: '{}',
    },
  });

  notifications.associate = (models) => {
    notifications.belongsTo(models.clients);
    notifications.belongsTo(models.Admin);
  };

  return notifications;
};

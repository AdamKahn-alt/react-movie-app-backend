// AUTOMATICALLY RETURNS THE PPUBLIC USER OBJECT WITHOUT SENSITIVE INFORMATION LIKE PASSWORD AND __V
export const publicUser = (user) => {
  let publicUser = user.toObject ? user.toObject() : { ...user };

  delete publicUser.password;
  delete publicUser.__v;

  return publicUser;
};

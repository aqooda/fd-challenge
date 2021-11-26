module.exports = {
  '*.ts': () => 'tsc --noEmit',
  '*.(ts|js)': ['prettier --write', 'eslint'],
};

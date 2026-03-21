const bcrypt = require('bcryptjs');

const password = '123456';
const hash = bcrypt.hashSync(password, 10);

console.log('Password:', password);
console.log('Hash:', hash);
console.log('\nAdd this hash to your mock user in src/app/api/auth/login/route.ts');

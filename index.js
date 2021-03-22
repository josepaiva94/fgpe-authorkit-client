const authorkit = require('./authorkit-api');

require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://fgpe.dcc.fc.up.pt:80/api';
const JWT_TOKEN = process.env.JWT_TOKEN || '';
const EMAIL = process.env.EMAIL || '';
const PASSWORD = process.env.PASSWORD || '';
const PROJECT_ID = process.env.PROJECT_ID || '';


function sleep(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}


(async () => {

  const token = JWT_TOKEN ? JWT_TOKEN : (await authorkit.login(BASE_URL, EMAIL, PASSWORD)).accessToken;
  console.log(token)

  const exercises = await authorkit.getAllExerciseStatements(BASE_URL, token, PROJECT_ID, 'strings');
    console.log(exercises);
  for (const exercise of exercises) {

    console.log(exercise.title);

    for (const statement of exercise.statements) {
      let contents = await authorkit.getStatementContents(BASE_URL, token, statement.id);

      // tidy up
      console.log(contents);

      await sleep(1000); // sleep for 10s
    }
  }
})();

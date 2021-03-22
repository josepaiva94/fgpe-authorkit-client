const got = require('got');
const FormData = require('form-data');


async function login(baseUrl, email, password) {
  return await got.post(`${baseUrl}/auth/login`, {
    json: {
      email,
      password
    },
    resolveBodyOnly: true,
    responseType: 'json'
  });
}

async function getAllExerciseStatements(baseUrl, token, projectId, keywords) {
  const searchParams = {
    fields: 'id,title,keywords',
    join: 'statements',
    sort: 'title,ASC',
    limit: 200
  };
  if (keywords) {
    if (typeof keywords === 'string') {
      searchParams.s = JSON.stringify({
        keywords: {
          $contL: keywords
        }
      });
    } else if (Array.isArray(keywords)) {
      searchParams.s = { 
        $and: []
      };
      keywords.forEach(kw => {
        searchParams.s.$and.push({
          keywords: {
            $contL: kw
          }
        });
      });
      searchParams.s = JSON.stringify(searchParams.s);
    }
  } 
  return await got.get(`${baseUrl}/exercises`, {
    headers: {
      Authorization: `Bearer ${token}`,
      project: projectId
    },
    resolveBodyOnly: true,
    searchParams: new URLSearchParams(searchParams)
  }).json();
}

async function getStatementContents(baseUrl, token, id) {
  const b64contents = await got.get(`${baseUrl}/statements/${id}/contents`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    resolveBodyOnly: true
  });
  return b64decode(b64contents);
}

async function updateStatementContents(baseUrl, token, id, filename, contents) {
  const fd = new FormData();
  fd.append('file', Buffer.from(contents), filename)
  return await got.patch(`${baseUrl}/statements/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    resolveBodyOnly: true,
    body: fd
  });
}

function b64decode(data) {
  const buff = Buffer.from(data, 'base64');
  return buff.toString('utf8');
}

module.exports = {
  login,
  getAllExerciseStatements,
  getStatementContents,
  updateStatementContents
}

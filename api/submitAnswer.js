const axios = require('axios')

module.exports = async (questionID, answer, nodeID, assignmentID, token) => {
    const data = JSON.stringify({ "id": `${questionID}`, "answer": [{ "type": "select", "answer": `${answer}` }] });

    var config = {
        method: 'post',
        url: `https://cauhoi-api.sachmem.vn/api/questions/answer?node_id=${nodeID}&assignment_id=${assignmentID}`,
        headers: {
            'Connection': 'keep-alive',
            'Accept': 'application/json, text/plain, */*',
            'x-access-token': `${token}`,
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36',
            'Content-Type': 'application/json',
            'Origin': 'https://hoclieu.vn',
            'Sec-Fetch-Site': 'cross-site',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Referer': 'https://hoclieu.vn/',
            'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8'
        },
        data: data
    };

    const reponse = await axios(config)
    return reponse.data
}